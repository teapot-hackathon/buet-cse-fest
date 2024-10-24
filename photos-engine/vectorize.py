import faiss
from sentence_transformers import SentenceTransformer
import numpy as np

# Load the model
model = SentenceTransformer('all-mpnet-base-v2')

# Sample data (texts or descriptions)
texts = [
    "arafed man in blue shirt showing thumbs up with both hands",
    "there are rocks on the beach near the water and boats",
    "three dices on a chess board with a triangle in the background",
    "arafed man picking tea leaves in a tea plantation"
]

# Define the path where the index will be saved
index_file_path = "faiss_index.index"

def save_faiss_index(index, file_path):
    """Save the Faiss index to a file."""
    faiss.write_index(index, file_path)


# Convert these texts into embeddings
embeddings = model.encode(texts)

# Print out the embeddings for verification
embedding_matrix = np.array(embeddings)

# Build the index
dimension = embedding_matrix.shape[1]  # The number of dimensions in the embeddings
index = faiss.IndexFlatL2(dimension)

index.add(embedding_matrix)

save_faiss_index(index, index_file_path)

# query = "Man giving thumbs up"
# query_embedding = model.encode([query])

# print('this is the query embeddings')
# print(query_embedding)

# distances, indices = index.search(np.array(query_embedding), k=3)  # Get top 3 results

# # Print the indices of the closest matches
# print(indices)