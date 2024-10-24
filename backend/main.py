from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from mapScraper.placesCrawlerV2 import search  # Now it should find the module


# Initialize the FastAPI app
app = FastAPI()

@app.get("/search")
async def search_route(query: str = Query(..., description="The search query")):
    try:
        # Await the asynchronous search function
        results = await search(query)
        return JSONResponse(content=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
