from requests_html import HTMLSession
from urllib.parse import unquote
import json
import os

def search(query):
    result = []
    PAGINATION = 0
    
    # Set environment variable and browser args
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"  # Adjust this path
    os.environ["PYPPETEER_CHROMIUM_REVISION"] = "1045629"
    
    # Initialize session
    session = HTMLSession()
    session._browser_args = [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        f'--executable-path={chrome_path}'
    ]
    
    try:
        while True:
            url = f'https://www.google.com/localservices/prolist?hl=en&ssta=1&q={query}&oq={query}&src=2&lci={PAGINATION}'
            r = session.get(url)
            # Removed browser_args parameter
            r.html.render(timeout=30)

            data_script = r.html.find('#yDmH0d > script:nth-child(12)')[0].text
            data_script = data_script.replace("AF_initDataCallback(","").replace("'","").replace("\n","")[:-2]
            data_script = data_script.replace("{key:","{\"key\":").replace(", hash:",", \"hash\":").replace(", data:",", \"data\":").replace(", sideChannel:",", \"sideChannel\":")
            data_script = data_script.replace("\"key\": ds:","\"key\": \"ds: ").replace(", \"hash\":","\",\"hash\":")
            data_script = json.loads(data_script)

            placesData = data_script["data"][1][0]

            try:
                for i in range(0, len(placesData)):
                    obj = {
                        "id": placesData[i][21][0][1][4],
                        "title": placesData[i][10][5][1],
                        "category": placesData[i][21][9],
                        "address": "",
                        "phoneNumber": "",
                        "completePhoneNumber": "",
                        "domain": "",
                        "url": "",
                        "coor": "",
                        "stars": "",
                        "reviews": ""
                    }

                    try:
                        obj["phoneNumber"] = placesData[i][10][0][0][1][0][0]
                        obj["completePhoneNumber"] = placesData[i][10][0][0][1][1][0]
                    except TypeError:
                        pass

                    try:
                        obj["domain"] = placesData[i][10][1][1]
                        obj["url"] = placesData[i][10][1][0]
                    except TypeError:
                        pass

                    try:
                        obj["address"] = unquote(placesData[i][10][8][0][2]).split("&daddr=")[1].replace("+"," ")
                    except:
                        pass

                    try:
                        obj["coor"] = f"{placesData[i][19][0]},{placesData[i][19][1]}"
                    except:
                        pass

                    try:
                        obj["stars"] = placesData[i][21][3][0]
                        obj["reviews"] = placesData[i][21][3][2]
                    except:
                        pass

                    result.append(obj)
            except TypeError:
                break

            if len(placesData) < 20:
                break
            else:
                PAGINATION += len(placesData)

    finally:
        session.close()
    
    return result
