from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import sys
import os
from pydantic import BaseModel

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from mapScraper.placesCrawlerV2 import search
from photosEngine.summarize import summarize_photo
from photosEngine.vectorize import append_to_index
from photosEngine.vectorize import append_to_json

# Initialize the FastAPI app
app = FastAPI()

cache = {}

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/itinerary")
async def search_route(query: str = Query(..., description="The search query"),
                       type: str = Query(..., description="Budget type: budget, mid-range, or luxury")):
    try:
        # Ensure that the type is one of the valid options
        if type not in ["budget", "mid-range", "luxury"]:
            raise HTTPException(status_code=400, detail="Invalid type. Choose either 'budget', 'mid-range', or 'luxury'.")

        # Prepare category-based search queries based on type
        queries = [
            f"{type} hotels in {query}",
            f"{type} attractions in {query}",
            f"{type} restaurants in {query}"
        ]

        # Run searches concurrently
        results = await asyncio.gather(*[search(q) for q in queries])

        # Flatten results
        flattened_results = [item for sublist in results for item in sublist]

        return JSONResponse(content=flattened_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
async def search_route(query: str = Query(..., description="The search query")):
    try:

        # Check if the query is already in the cache
        if query in cache:
            return JSONResponse(content=cache[query])

        # Run the search
        queries = [
            f"hotels in {query}",
            f"attractions in {query}",
            f"restaurants in {query}"
        ]

        result = await asyncio.gather(*[search(q) for q in queries])
        flattened_result = [item for sublist in result for item in sublist]

        cache[query] = flattened_result

        return JSONResponse(content=flattened_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

class FileData(BaseModel):
    filename: str
    mongo_id: str


@app.post("/photo/process")
async def upload_file():
    # Validate data (optional)
    # if not file_data.filename or not file_data.mongo_id:
    #     raise HTTPException(status_code=400, detail="filename and mongo_id are required.")
    
    file_data = {
        "filename": 'uploads/photo-1729799639506-596868215.jpeg',
        "mongo_id": 'abcd',
        "username": 'imtiaz'
    }

    dir_loc = f'indices/{file_data['username']}'
    os.makedirs(dir_loc, exist_ok=True)

    index_loc = f'{dir_loc}/index.bin'
    json_loc = f'{dir_loc}/meta.json'

    print(file_data)
    summary = summarize_photo(file_data['filename'])
    append_to_index(index_loc, summary)
    append_to_json(json_loc, mongo_id)
    
    # Process the data
    return {
        "message": "File data received successfully.",
        "filename": file_data["filename"],
        "mongo_id": file_data['mongo_id']
    }
    
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
