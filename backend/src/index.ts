import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { clerkMiddleware, clerkClient } from "@clerk/express";
import dotenv from "dotenv";
import { getCollection } from "./mongo";
import { ObjectId } from "mongodb";
import axios from "axios";
import cors from "cors";

dotenv.config();

const PYTHON_BACKEND = "http://localhost:8000";

const CLERK_PUBLIC_KEY = process.env.CLERK_PUBLIC_KEY ?? "";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY ?? "";

console.log(CLERK_PUBLIC_KEY);
console.log(CLERK_SECRET_KEY);

const app = express();
app.use(cors());
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

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello, this is the backend!");
});

app.get(
  "/protected",
  clerkMiddleware({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLIC_KEY,
  }),
  async (req: any, res: Response) => {
    console.log(req.auth);

    if (!req?.auth?.userId) {
      res.status(400).send("Need to be authenticated to access this route");
      return;
    }

    const users = await clerkClient.users.getUserList();
    const data = users.data;
    res.json({
      users: data,
    });
  }
);

// actual stuff below here

app.get(
  "/photos/search",
  clerkMiddleware({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLIC_KEY,
  }),
  async (req: ClerkRequest, res: Response) => {
    const searchQuery = req.query.q; // 'q' is the name of the query parameter (e.g., ?q=search-term)

    if (!req?.auth?.userId) {
      res.status(400).send("Need to be authenticated to access this route");
      return;
    }

    if (!searchQuery) {
      res.status(400).send("A search query is required.");
    }

    const userId = req?.auth?.userId;

    // at this point i call my python backend to:
    const response = await axios
      .post(`${PYTHON_BACKEND}/photo/search`, {
        query: searchQuery,
        username: userId,
      })
      .catch((e) => {
        console.log(e);
      });

    // Perform the search logic here with `searchQuery`
    res.json(response?.data);
  }
);

app.post(
  "/photos/album",
  clerkMiddleware({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLIC_KEY,
  }),
  async (req: ClerkRequest, res: Response) => {
    console.log(req.auth, "<--- req.auth");

    if (!req?.auth?.userId) {
      res.status(400).send("Need to be authenticated to access this route");
      return;
    }

    const userId = req.auth.userId;

    const { albumName } = req.body;

    if (!albumName) {
      res.status(400).json({
        message: "Album name is required.",
      });
    }

    const collection = await getCollection("albums");

    const exists = await collection.find({
      owned_by: userId,
    });

    if (!(await exists.toArray()).length) {
      res.status(400).json({
        message: "Album already exists",
      });
    }

    await collection.insertOne({
      name: albumName,
      owned_by: userId,
    });

    const created_collection = await collection.findOne({
      name: albumName,
      owned_by: userId,
    });

    res.json(created_collection);
  }
);

app.get(
  "/photos/album",
  clerkMiddleware({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLIC_KEY,
  }),
  async (req: ClerkRequest, res: Response) => {
    const collection = await getCollection("albums");
    if (!req?.auth?.userId) {
      res.status(400).send("Need to be authenticated to access this route");
      return;
    }

    const userId = req.auth.userId;

    const albums = await collection
      .find({
        owned_by: userId,
      })
      .toArray();

    const result = albums;

    res.json(result);
  }
);

app.get(
  "/photos/albums/:albumName",
  clerkMiddleware({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLIC_KEY,
  }),
  async (req: ClerkRequest, res: Response) => {
    const albumName = req.params.albumName;

    if (!albumName) {
      res.status(400).send("Album name is required.");
    }

    const collection = await getCollection("photos");
    if (!req?.auth?.userId) {
      res.status(400).send("Need to be authenticated to access this route");
      return;
    }

    const userId = req.auth.userId;

    const photos = await collection
      .find({
        owned_by: userId,
        album_name: albumName,
      })
      .toArray();

    res.json(photos);
  }
);

app.post(
  "/photos/albums/:albumName",
  upload.single("photo"),
  clerkMiddleware({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLIC_KEY,
  }),
  async (req: ClerkRequest, res: Response) => {
    const albumName = req.params.albumName; // Get the album name from the URL
    const photoFile = req.file; // Get the uploaded image file

    if (!req?.auth?.userId) {
      res.status(400).send("Need to be authenticated to access this route");
      return;
    }

    if (!albumName) {
      res.status(400).send("Album name is required.");
    }

    if (!photoFile) {
      res.status(400).send("No photo file uploaded.");
    }

    const collection = await getCollection("photos");
    const userId = req.auth.userId;

    const inserted = await collection.insertOne({
      album_name: albumName,
      original_name: photoFile?.originalname,
      filepath: photoFile?.path,
      owned_by: userId,
    });

    // at this point i call my python backend to:
    axios
      .post(`${PYTHON_BACKEND}/photo/process`, {
        filename: photoFile?.filename,
        mongo_id: inserted.insertedId,
        username: userId,
      })
      .catch((e) => {
        console.log(e);
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
