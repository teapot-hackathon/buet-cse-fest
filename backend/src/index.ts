import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import { getCollection } from "./mongo";
import { ObjectId } from "mongodb";

dotenv.config();

const CLERK_PUBLIC_KEY = process.env.CLERK_PUBLIC_KEY ?? "";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY ?? "";

console.log(CLERK_PUBLIC_KEY);
console.log(CLERK_SECRET_KEY);

const app = express();
app.use(express.json());

interface ClerkRequest extends Request {
  auth?: {
    userId: any;
  };
}

const port = 3002;

// Set up Multer to store the uploaded files in a "uploads/" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Save the file with its original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is the backend!");
});

app.get(
  "/protected",
  clerkMiddleware({
    publishableKey: CLERK_PUBLIC_KEY,
    secretKey: CLERK_SECRET_KEY,
  }),
  (req: ClerkRequest, res: Response) => {
    if (!req?.auth?.userId) {
      res.status(400).send("Need to be authenticated to access this route");
    }

    // do the auth stuff later after adnan has implemented the frontend with clerk sth sth idk

    res.send("Hello, this is a protected route!");
  }
);

// actual stuff below here

app.get("/photos/search", (req: Request, res: Response) => {
  const searchQuery = req.query.q; // 'q' is the name of the query parameter (e.g., ?q=search-term)

  if (!searchQuery) {
    res.status(400).send("A search query is required.");
  }

  // Perform the search logic here with `searchQuery`
  res.send(`Search for photos with the query: ${searchQuery}`);
});

app.post("/photos/album", async (req: Request, res: Response) => {
  const { albumName } = req.body;

  if (!albumName) {
    res.status(400).json({
      message: "Album name is required.",
    });
  }

  const collection = await getCollection("albums");

  const exists = await collection.find({
    owned_by: "imtiaz",
  });

  if (!(await exists.toArray()).length) {
    res.status(400).json({
      message: "Album already exists",
    });
  }

  await collection.insertOne({
    name: albumName,
    owned_by: null,
  });

  res.json({
    created: true,
  });
});

app.get("/photos/albums", async (req: Request, res: Response) => {
  const collection = await getCollection("albums");
  const username = "imtiaz"; // get this from clerk maybe? email maybe?

  const albums = await collection.findOne({
    owned_by: "imtiaz",
  });

  const result = albums;

  res.json(result);
});

app.get("/photos/albums/:albumName", async (req: Request, res: Response) => {
  const albumName = req.params.albumName;

  if (!albumName) {
    res.status(400).send("Album name is required.");
  }

  const collection = await getCollection("photos");
  const username = "imtiaz"; // get this from clerk somehow

  const photos = await collection
    .find({
      owned_by: username,
    })
    .toArray();

  res.json(photos);
});

app.post(
  "/photos/albums/:albumName",
  upload.single("photo"),
  async (req: Request, res: Response) => {
    const albumName = req.params.albumName; // Get the album name from the URL
    const photoFile = req.file; // Get the uploaded image file

    if (!albumName) {
      res.status(400).send("Album name is required.");
    }

    if (!photoFile) {
      res.status(400).send("No photo file uploaded.");
    }

    const collection = await getCollection("photos");
    const username = "imtiaz"; // get this from clerk somehow

    // at this point i call my python backend to:
    // 1. generate the summary
    // 2. create a vector
    // 3. sucess

    const inserted = await collection.insertOne({
      album_name: albumName,
      original_name: photoFile?.originalname,
      filepath: photoFile?.path,
      owned_by: username,
    });

    console.log(inserted.insertedId);

    // Assuming the file was successfully uploaded to the 'uploads/' folder
    res.send(
      `Photo successfully uploaded to the album: ${albumName}. File path: ${photoFile?.path}`
    );
  }
);

// view the photos
app.get("/photos/view/:photoId", async (req, res) => {
  const photoId = req.params.photoId; // Get the album name from the URL
  if (!photoId) {
    res.status(400).send("Photo ID is required.");
  }

  const collection = await getCollection("photos");

  const img = await collection.findOne({
    _id: new ObjectId(photoId),
  });

  const fullFilePath = path.join(__dirname, "../", img?.filepath); // Build the full path to the image

  res.sendFile(fullFilePath, (err) => {
    if (err) {
      console.log(err);
      res.status(404).send("Image not found.");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
