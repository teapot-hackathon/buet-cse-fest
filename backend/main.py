import asyncio
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random
import os
import sys
from datetime import datetime, timedelta
import logging

from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)  # Changed to INFO for better debugging
logger = logging.getLogger(__name__)

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from mapScraper.placesCrawlerV2 import search
from photosEngine.summarize import summarize_photo
from photosEngine.vectorize import append_to_index
from photosEngine.vectorize import append_to_json
from photosEngine.rank import rank_photos
from photosEngine.vectorize import generate_ids

app = FastAPI()

cache = {}
cache_timestamps = {}
cache_expiry_time = timedelta(hours=1)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def normalize_rating(stars, reviews):
    """Normalize rating considering both stars and number of reviews."""
    if stars is None or reviews is None:
        return 0
    # Weight: 80% stars, 20% review count normalized
    # Normalize reviews to a 0-5 scale where 1000+ reviews = 5
    review_score = min(reviews / 200, 5)  # Adjust this number based on your data
    return (stars * 0.8) + (review_score * 0.2)

def pick_by_budget(options, budget_type, previous_selections=(), category_type=""):
    """
    Select a place based on budget type with improved selection logic.
    
    Args:
        options: List of place options
        budget_type: "budget", "mid-range", or "luxury"
        previous_selections: List of previously selected place IDs
        category_type: Type of place ("hotel", "restaurant", "activity")
    """
    try:
        if not options:
            raise ValueError(f"No options provided for {category_type}")

        logger.info(f"Selecting {budget_type} option from {len(options)} choices for {category_type}")

        # Remove previously selected places
        available_options = [opt for opt in options if opt['id'] not in previous_selections]
        
        # If we're running too low on options, reset and allow reuse
        if len(available_options) < 3:
            available_options = options
            logger.info(f"Reset available options for {category_type} due to low count")

        # Calculate normalized ratings for all options
        rated_options = []
        for option in available_options:
            stars = option.get('stars', 0)
            reviews = option.get('reviews', 0)
            if stars is None: stars = 0
            if reviews is None: reviews = 0
            
            normalized_rating = normalize_rating(stars, reviews)
            rated_options.append((option, normalized_rating))

        # Sort by normalized rating
        rated_options.sort(key=lambda x: x[1], reverse=True)

        if budget_type == "luxury":
            # For luxury, pick from top 20%
            top_count = max(1, len(rated_options) // 5)
            selection_pool = rated_options[:top_count]
            logger.info(f"Luxury selection from top {top_count} options")
            
        elif budget_type == "mid-range":
            # For mid-range, pick from middle 50%
            start_idx = len(rated_options) // 4
            end_idx = start_idx + (len(rated_options) // 2)
            selection_pool = rated_options[start_idx:end_idx]
            logger.info(f"Mid-range selection from options {start_idx} to {end_idx}")
            
        else:  # budget
            # For budget, pick from bottom 60%
            cutoff = int(len(rated_options) * 0.4)
            selection_pool = rated_options[cutoff:]
            logger.info(f"Budget selection from bottom {len(selection_pool)} options")

        if not selection_pool:
            selection_pool = rated_options  # Fallback to all options if pool is empty

        # Make final selection
        selected_option, _ = random.choice(selection_pool)
        logger.info(f"Selected {category_type} with rating {selected_option.get('stars')} and {selected_option.get('reviews')} reviews")
        
        return selected_option

    except Exception as e:
        logger.error(f"Error in pick_by_budget: {str(e)}", exc_info=True)
        raise

@app.get("/itinerary")
async def generate_itinerary(
    query: str = Query(..., description="The search query"),
    type: str = Query(..., description="Budget type: budget, mid-range, or luxury"),
    days: int = Query(..., description="Number of days for the itinerary", ge=1, le=30)
):
    try:
        if type not in ["budget", "mid-range", "luxury"]:
            raise HTTPException(status_code=400, detail="Invalid type. Choose 'budget', 'mid-range', or 'luxury'.")

        current_time = datetime.now()
        cache_key = f"{query}_{type}_{days}"

        if cache_key in cache and (current_time - cache_timestamps[cache_key]) < cache_expiry_time:
            return JSONResponse(content=cache[cache_key])

        # Perform searches
        queries = [f"hotels in {query}", f"attractions in {query}", f"restaurants in {query}"]
        results = await asyncio.gather(*[search(q) for q in queries])
        hotels, activities, restaurants = results[0], results[1], results[2]

        logger.info(f"Found {len(hotels)} hotels, {len(activities)} activities, {len(restaurants)} restaurants")

        if not hotels or not activities or not restaurants:
            raise HTTPException(status_code=404, detail=f"No results found for some categories in {query}")

        selected_places = set()
        itinerary = []

        for day in range(1, days + 1):
            day_plan = {
                "day": day,
                "morning": {},
                "afternoon": {},
                "evening": {}
            }

            # Morning
            if day == 1:
                selected_hotel = pick_by_budget(hotels, type, list(selected_places), "hotel")
                day_plan["morning"] = {
                    "title": "Hotel check-in and rest",
                    "place": selected_hotel
                }
                selected_places.add(selected_hotel['id'])
            else:
                morning_activity = pick_by_budget(activities, type, list(selected_places), "activity")
                day_plan["morning"] = {
                    "title": "Morning Activity",
                    "place": morning_activity
                }
                selected_places.add(morning_activity['id'])

            # Afternoon
            afternoon_activity = pick_by_budget(activities, type, list(selected_places), "activity")
            lunch_place = pick_by_budget(restaurants, type, list(selected_places), "restaurant")
            day_plan["afternoon"] = {
                "title": "Afternoon Activity & Lunch",
                "activity": afternoon_activity,
                "restaurant": lunch_place
            }
            selected_places.update({afternoon_activity['id'], lunch_place['id']})

            # Evening
            evening_activity = pick_by_budget(activities, type, list(selected_places), "activity")
            dinner_place = pick_by_budget(restaurants, type, list(selected_places), "restaurant")
            day_plan["evening"] = {
                "title": "Dinner & Evening Activity",
                "activity": evening_activity,
                "restaurant": dinner_place
            }
            selected_places.update({evening_activity['id'], dinner_place['id']})

            itinerary.append(day_plan)

        response_data = {"query": query, "type": type, "days": days, "itinerary": itinerary}
        
        cache[cache_key] = response_data
        cache_timestamps[cache_key] = current_time

        return JSONResponse(content=response_data)

    except Exception as e:
        logger.error(f"Error generating itinerary: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the itinerary: {str(e)}")

@app.get("/search")
async def search_route(query: str = Query(..., description="The search query")):
    try:
        current_time = datetime.now()

        if query in cache and (current_time - cache_timestamps[query]) < cache_expiry_time:
            return JSONResponse(content=cache[query])

        queries = [f"hotels in {query}", f"attractions in {query}", f"restaurants in {query}"]
        result = await asyncio.gather(*[search(q) for q in queries])
        flattened_result = [item for sublist in result for item in sublist]

        cache[query] = flattened_result
        cache_timestamps[query] = current_time

        return JSONResponse(content=flattened_result)

    except Exception as e:
        logger.error(f"Error in search route: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred while performing the search: {str(e)}")

class FileData(BaseModel):
    filename: str
    mongo_id: str
    username: str


@app.post("/photo/process")
async def upload_file(file_data: FileData):
    # Validate data (optional)
    if not file_data.filename or not file_data.mongo_id:
        raise HTTPException(status_code=400, detail="filename and mongo_id are required.")
    
    # file_data = {
    #     "filename": 'uploads/photo-1729799639506-596868215.jpeg',
    #     "mongo_id": 'abcd',
    #     "username": 'imtiaz'
    # }

    dir_loc = f'indices/{file_data.username}'
    os.makedirs(dir_loc, exist_ok=True)

    index_loc = f'{dir_loc}/index.bin'
    json_loc = f'{dir_loc}/meta.json'

    print(file_data)
    summary = summarize_photo(f'uploads/{file_data.filename}')
    append_to_index(index_loc, summary)
    append_to_json(json_loc, file_data.mongo_id)
    
    # Process the data
    return {
        "message": "File data received successfully.",
        "filename": file_data.filename,
        "mongo_id": file_data.mongo_id
    }

class SearchData(BaseModel):
    query: str
    username: str

@app.post("/photo/search")
async def search_photo(file_data: SearchData):
    # get the search term
    if not file_data.query or not file_data.username:
        raise HTTPException(status_code=400, detail="query is required and username is required")

    result = rank_photos(f'indices/{file_data.username}', file_data.query)
    ids = generate_ids(f'indices/{file_data.username}/meta.json', result)
    
    return_list = []
    for i in ids:
        return_list.append({
            '_id': i
        })

    return return_list

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)