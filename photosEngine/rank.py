import numpy as np
import faiss
import os
from sentence_transformers import SentenceTransformer

# Load the model
model = SentenceTransformer('all-mpnet-base-v2')

def load_faiss_index(file_path):
    """Load the Faiss index from a file."""
    return faiss.read_index(file_path)

def search(query, index, k=4):
    """Search for the top k nearest neighbors for a given query."""
    # Convert the query to an embedding
    query_embedding = model.encode([query], convert_to_tensor=False).astype('float32')
    
    # Perform the search
    distances, indices = index.search(query_embedding, k)
    
    return distances, indices


# query = "an umbrella"
# query_embedding = loaded_index.encode([query])

# distances, indices = search(query, loaded_index, k=2)
# result = indices.tolist()[0]
# print(result)

def rank_photos(dir_loc, query, k=4):
    loaded = load_faiss_index(f'{dir_loc}/index.bin')
    result = search(query, loaded, k)
    return result[1].tolist()[0]
    # query_embedding = loaded.encode([query])

    # distances, indices = search(query_embedding, loaded, k=2)
    # result = indices.tolist()[0]
    # print(result)
    # return result
