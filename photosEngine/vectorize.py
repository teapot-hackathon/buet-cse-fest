import faiss
from sentence_transformers import SentenceTransformer
import numpy as np
import os

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
        loaded = load_faiss_index(index_location)
        embeddings = model.encode([text])
        embedding_matrix = np.array(embeddings)
        loaded.add(embedding_matrix)
        save_faiss_index(loaded, index_location)


def append_to_json(json_location, text):
    
# append_to_index('faiss_index.index', 'a green umbrella')