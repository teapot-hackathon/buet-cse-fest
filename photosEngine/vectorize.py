import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
import os
import json

# Load the model
model = SentenceTransformer('all-mpnet-base-v2')

def load_faiss_index(file_path):
    """Load the Faiss index from a file."""
    return faiss.read_index(file_path)

def save_faiss_index(index, file_path):
    """Save the Faiss index to a file."""
    faiss.write_index(index, file_path)


def create_index(index_location, text):
    embeddings = model.encode([text])
    embedding_matrix = np.array(embeddings)
    dimension = embedding_matrix.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embedding_matrix)
    save_faiss_index(index, index_location)



def append_to_index(index_location, text):

    if not os.path.exists(index_location):
        # Create index if it doesn't exist
        create_index(index_location, text)
    else:
        print('loaded index')
        loaded = load_faiss_index(index_location)
        embeddings = model.encode([text])
        embedding_matrix = np.array(embeddings)
        loaded.add(embedding_matrix)
        save_faiss_index(loaded, index_location)


def append_to_json(json_location, text):
    
    if not os.path.exists(json_location):
        with open(json_location, 'w') as json_file:
            json.dump([], json_file)  # Create an empty list in the file

    # Load the existing data from the file
    with open(json_location, 'r') as json_file:
        data = json.load(json_file)

    # Append the new text to the list
    data.append(text)

    # Write the updated list back to the file
    with open(json_location, 'w') as json_file:
        json.dump(data, json_file, indent=4)  # Write the updated list with indentation for readability

def generate_ids(json_location, idx_list):
    with open(json_location, 'r') as json_file:
        data = json.load(json_file)

    new_list = []

    for idx in idx_list:
        new_list.append(data[idx])

    return new_list