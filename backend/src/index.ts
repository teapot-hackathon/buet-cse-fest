import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";

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
      res.status(400).send("Nope need auth stuff ig");
    }

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

app.get("/photos/albums", (req: Request, res: Response) => {
  res.send("this page sends back all the albums of the person");
});

app.get("/photos/albums/:albumName", (req: Request, res: Response) => {
  const albumName = req.params.albumName; // 'albumName' is the dynamic parameter from the URL

  if (!albumName) {
    res.status(400).send("Album name is required.");
  }

  // Perform the logic to retrieve the album with `albumName`
  res.send(`This page sends back all the albums for: ${albumName}`);
});

app.post("/photos/albums/", (req: Request, res: Response) => {
  // accept an albumName from post body
  const { albumName } = req.body; // Extract albumName from the request body

  if (!albumName) {
    res.status(400).send("Album name is required.");
  }

  // Perform logic with the albumName, such as creating a new album
  res.send(`New album created: ${albumName}`);
});

app.post(
  "/photos/albums/:albumName",
  upload.single("photo"),
  (req: Request, res: Response) => {
    const albumName = req.params.albumName; // Get the album name from the URL
    const photoFile = req.file; // Get the uploaded image file

    if (!albumName) {
      res.status(400).send("Album name is required.");
    }

    if (!photoFile) {
      res.status(400).send("No photo file uploaded.");
    }

    // Assuming the file was successfully uploaded to the 'uploads/' folder
    res.send(
      `Photo successfully uploaded to the album: ${albumName}. File path: ${photoFile?.path}`
    );
  }
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
