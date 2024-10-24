import numpy as np
import faiss
import os
from sentence_transformers import SentenceTransformer

# Load the model
model = SentenceTransformer('all-mpnet-base-v2')

# Define the path where the index will be saved
index_file_path = "faiss_index.index"

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


loaded_index = load_faiss_index(index_file_path)

query = "a group of friends showing V sign in a tea garden"
# query_embedding = loaded_index.encode([query])

distances, indices = search(query, loaded_index, k=2)
result = indices.tolist()[0]
print(result)