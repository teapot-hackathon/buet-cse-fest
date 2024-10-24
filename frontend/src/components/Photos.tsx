import React, { useState } from "react";
import { Folder, Search, Plus, Upload, X } from "lucide-react";
import Searchbar from "./Searchbar";

export default function Photos() {
  const [folders, setFolders] = useState(["Vacation", "Work", "Family"]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = () => {
    if (newFolderName) {
      setFolders([...folders, newFolderName]);
      setNewFolderName("");
      setIsNewFolderModalOpen(false);
    }
  };

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
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`w-full text-left py-2 px-4 hover:bg-gray-100 transition duration-200 ${
                selectedFolder === folder ? "bg-gray-200" : ""
              }`}
            >
              <Folder
                size={18}
                className="inline-block mr-2"
              />{" "}
              {folder}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Searchbar placeholder="Search photos..." />
          </div>
        </div>

        {selectedFolder ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedFolder}</h2>
            {/* Photo Upload Form */}
            <form className="mb-6">
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                  multiple
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
            {/* Photo Grid (placeholder) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 aspect-square rounded-md"
                ></div>
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
              <h2 className="text-xl font-bold">Create New Folder</h2>
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
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Create Folder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
