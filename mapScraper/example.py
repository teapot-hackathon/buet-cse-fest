import placesCrawlerV2

if __name__ == "__main__":
    try:
        results = placesCrawlerV2.search("4 star hotels in sylhet")
        print(f"Found {len(results)} results")
        print(results[0:10] if results else "No results found")
    except Exception as e:
        print(f"Error occurred: {str(e)}")