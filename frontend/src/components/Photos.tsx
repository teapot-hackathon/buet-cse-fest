import React, { useEffect, useRef, useState } from "react";
import { Folder, Search, Plus, Upload, X } from "lucide-react";
import Searchbar from "./Searchbar";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import useStore from "../store/store";

export default function Photos() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [pictures, setPictures] = useState([]);
  const [searchMode, setSearchMode] = useState(false);

  const formRef = useRef(null);

  const BASE_URL = "http://172.28.31.141:3002";
  const auth = useAuth();

  const photoSearch = useStore((state) => state.photoSearch);
  const setPhotoSearch = useStore((state) => state.setPhotoSearch);

  const handleSearch = async () => {
    const url = `${BASE_URL}/photos/search?q=${photoSearch}`;
    setPictures([]);
    setSearchMode(true);
    setSelectedFolder("");
    setPhotoSearch("");

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${await auth.getToken()}`,
      },
    });
    const { data } = res;
    setPictures(data);
  };

  const handleCreateFolder = async () => {
    if (newFolderName) {
      const newFolder = {
        albumName: newFolderName,
      };
      const res = await axios.post(`${BASE_URL}/photos/album`, newFolder, {
        headers: {
          Authorization: `Bearer ${await auth.getToken()}`,
        },
      });
      const data = res.data;
      console.log(data);
      setFolders(folders.concat(data));
      setNewFolderName("");
      setIsNewFolderModalOpen(false);
    }
  };

  const fetchAlbums = async () => {
    const res = await axios.get(`${BASE_URL}/photos/album`, {
      headers: {
        Authorization: `Bearer ${await auth.getToken()}`,
      },
    });
    const data = res.data;
    setFolders(data);
  };

  const handleAlbumClick = async (id) => {
    const album = folders.find((item) => item._id == id);
    setSelectedFolder(id);
    setSearchMode(false);

    const res = await axios.get(`${BASE_URL}/photos/albums/${album.name}`, {
      headers: {
        Authorization: `Bearer ${await auth.getToken()}`,
      },
    });
    setPictures(res.data);
    console.log(res.data);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Access the selected file

    if (file) {
      console.log("File selected:", file);
      // You can now handle the file (e.g., upload it using fetch or axios)
      // Example:
      const formData = new FormData();
      formData.append("photo", file);
      const res = await axios.post(
        `${BASE_URL}/photos/albums/${
          folders.find((item) => item._id == selectedFolder).name
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${await auth.getToken()}`,
          },
        }
      );
      const { data } = res;
      setPictures(pictures.concat(data));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="flex flex-row-reverse h-screen bg-gray-100">
      {/* Sidebar (now on the right) */}
      <div className="w-72 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Photos</h1>
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-neutral-900 transition duration-200 flex items-center justify-center font-semibold"
          >
            <Plus
              size={18}
              className="mr-2"
            />{" "}
            New Folder
          </button>
        </div>
        <nav className="mt-4">
          {folders?.map((folder, i) => (
            <button
              key={i}
              onClick={() => handleAlbumClick(folder._id)}
              className={`w-full text-left py-2 px-4 hover:bg-gray-100 transition duration-200 ${
                selectedFolder === folder._id ? "bg-gray-200" : ""
              }`}
            >
              <Folder
                size={18}
                className="inline-block mr-2"
              />{" "}
              {folder.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Searchbar
              placeholder="Search photos..."
              text={photoSearch}
              setText={setPhotoSearch}
              handleSubmit={handleSearch}
            />
          </div>
        </div>

        {selectedFolder || searchMode ? (
          <div>
            {selectedFolder && (
              <h2 className="text-2xl font-bold mb-4">
                {folders.find((folder) => folder._id === selectedFolder).name}
              </h2>
            )}

            {/* Photo Upload Form */}
            {!searchMode && (
              <form
                className="mb-6"
                ref={formRef}
                encType="multipart/form-data"
                onSubmit={handleSubmit}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    name="photo"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="bg-black text-white py-2 px-4 rounded-md hover:bg-white transition duration-200 cursor-pointer flex items-center font-semibold border-2 border-black hover:text-black"
                  >
                    <Upload
                      size={18}
                      className="mr-2"
                    />{" "}
                    Upload Photos
                  </label>
                </div>
              </form>
            )}

            {/* Photo Grid (placeholder) */}
            <div className="flex flex-row flex-wrap gap-4">
              {!pictures.length &&
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-200 aspect-square rounded-md"
                  ></div>
                ))}
              {pictures.map((picture) => (
                <img
                  src={`${BASE_URL}/photos/view/${picture._id}`}
                  className="w-[100x] h-[100px]"
                  key={picture._id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <Folder
              size={48}
              className="mx-auto mb-4"
            />
            <p>Select a folder to view photos</p>
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Album</h2>
              <button onClick={() => setIsNewFolderModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full py-2 px-4 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateFolder}
              className="w-full bg-black text-white py-2 px-4 rounded-md font-semibold transition duration-200"
            >
              Create Album
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
