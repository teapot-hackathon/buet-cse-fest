# BHROMON

## Overview
A travel itinerary maker using FastAPI, which incorporates web scraping capabilities to gather information on hotels, restaurants, and activities based on user queries. The tool aims to generate personalized itineraries based on user preferences, budget types, and selected dates.

## Features
- **Feature 1**: Personalised itinerary creation
- **Feature 2**: Explore maps for travel destinations
- **Feature 3**: Uploading photos during travels
- **Feature 4**: Blog generation based on latest travels

## Installation

### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed.
- Ensure you have [Python](https://www.python.org/) installed.
- Ensure you have [FastAPI](https://fastapi.tiangolo.com/) installed.

### Frontend Setup (Preact)
1. Clone the repository:
   ```git@github.com:teapot-hackathon/buet-cse-fest.git
   ```

2. Install the frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

### Backend Setup (FastAPI)
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```

3. Install the backend dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

## Usage
1. Open your browser and navigate to `http://localhost:3000` to access the React frontend.
2. The FastAPI backend will be running on `http://localhost:8000`.
