import logging
from requests_html import AsyncHTMLSession
from urllib.parse import unquote
import json
import os

# Set logging level for specific libraries
logging.getLogger('websockets').setLevel(logging.ERROR)
logging.getLogger('pyppeteer').setLevel(logging.ERROR)

# Initialize session globally, but use it within the event loop later
session = None

async def initialize_session():
    global session
    if session is None:
        session = AsyncHTMLSession()
        chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"  # Adjust this path

        # Set browser args
        session._browser_args = [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            f'--executable-path={chrome_path}'
        ]

async def search(query, max_searches=15):
    await initialize_session()  # Ensure session is initialized in the event loop
    
    result = []
    PAGINATION = 0
    search_count = 0

    try:
        while search_count < max_searches:
            # Construct the URL for the search query
            url = f'https://www.google.com/localservices/prolist?hl=en&ssta=1&q={query}&oq={query}&src=2&lci={PAGINATION}'
            r = await session.get(url)

            # Reduce rendering timeout for faster performance
            await r.html.arender(timeout=20)

            # Extract the relevant data from the rendered HTML
            data_script = r.html.find('#yDmH0d > script:nth-child(12)')[0].text
            data_script = data_script.replace("AF_initDataCallback(", "").replace("'", "").replace("\n", "")[:-2]
            data_script = data_script.replace("{key:", "{\"key\":").replace(", hash:", ", \"hash\":").replace(", data:", ", \"data\":").replace(", sideChannel:", ", \"sideChannel\":")
            data_script = data_script.replace("\"key\": ds:", "\"key\": \"ds: ").replace(", \"hash\":", "\",\"hash\":")
            data_script = json.loads(data_script)

            placesData = data_script["data"][1][0]

            try:
                for i in range(len(placesData)):
                    obj = {
                        "id": placesData[i][21][0][1][4],
                        "title": placesData[i][10][5][1],
                        "category": placesData[i][21][9],
                        "address": "",
                        "completePhoneNumber": "",
                        "domain": "",
                        "url": "",
                        "coor": "",
                        "stars": "",
                        "reviews": "",
                    }

                    # Extract phone numbers
                    try:
                        obj["completePhoneNumber"] = placesData[i][10][0][0][1][1][0]
                    except (TypeError, IndexError):
                        pass

                    # Extract domain and URL
                    try:
                        obj["domain"] = placesData[i][10][1][1]
                        obj["url"] = placesData[i][10][1][0]
                    except (TypeError, IndexError):
                        pass

                    # Extract address
                    try:
                        obj["address"] = unquote(placesData[i][10][8][0][2]).split("&daddr=")[1].replace("+", " ")
                    except (IndexError, TypeError):
                        pass

                    # Extract coordinates
                    try:
                        obj["coor"] = f"{placesData[i][19][0]},{placesData[i][19][1]}"
                    except (IndexError, TypeError):
                        pass

                    # Extract stars and reviews
                    try:
                        obj["stars"] = placesData[i][21][3][0]
                        obj["reviews"] = placesData[i][21][3][2]
                    except (IndexError, TypeError):
                        pass

                    result.append(obj)
            except TypeError:
                break

            # Break early if less than expected results are found (pagination optimization)
            if len(placesData) < 16:  # Adjust based on typical result count per page
                break
            else:
                PAGINATION += len(placesData)
                search_count += 1
    finally:
        pass
    
    return result
