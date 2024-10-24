import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient;
let db: Db;

async function connectToDatabase() {
  if (!client) {
    const url = "mongodb://root:example@localhost:27017";
    client = new MongoClient(url);
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db("photo_album_db");
  }
  return db;
}

export async function getCollection(
  collectionName: string
): Promise<Collection> {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}
