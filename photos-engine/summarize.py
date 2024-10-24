import time
import requests
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('HUGGING_FACE_TOKEN')

API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
headers = {"Authorization": f"Bearer {TOKEN}"}

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

def wait_for_model_ready():
    while True:
        response = requests.get(API_URL, headers=headers)
        status = response.json()
        if "error" in status and "loading" in status["error"]:
            print(f"Model is loading. Estimated time: {status['estimated_time']} seconds.")
            time.sleep(int(status['estimated_time']))  # Wait for the estimated loading time
        else:
            print("Model is ready.")
            break

wait_for_model_ready()

output = query(f"media/image-10.jpeg")
print(output)
