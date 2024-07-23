"use client";

import axios from "axios";
import { useState } from "react";

const initFile = {
  fileName: "",
  file: null,
  fileURL: "",
};

const Modal = ({ fileURL, onClose }) => {
  return (
    <div className="fixed mx-[15%] inset-0 top-16 rounded-3xl bg-[#323639] bg-opacity-70 flex justify-center items-center">
      <div className="w-full h-full flex justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full flex items-center justify-center  border-2 text-white w-8 h-8 p-0"
        >
          x
        </button>
        <div className="relative w-full h-full top-16  max-w-5xl max-h-full bg-white">
          <iframe className="w-full h-full" src={fileURL}></iframe>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [file, setFile] = useState(initFile);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getUploadLink = async () => {
    if (file.fileName) {
      try {
        const body = {
          containerName: "arise-bucket-1",
          fileName: file.fileName,
        };
        const response = await axios.post(
          "http://localhost:8080/signed-url-upload",
          body
        );
        return response.data.sasURL;
      } catch (err) {
        console.log(err);
      }
    }
  };

  const uploadFile = async () => {
    if (!file.fileName) {
      console.error("Upload link or file is missing");
      return;
    }

    try {
      const uploadLink = await getUploadLink();
      await axios.put(uploadLink, file.file, {
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.file.type, // Ensure the content type is set to the file's type
        },
      });
      console.log("File uploaded successfully");
    } catch (err) {
      console.error("Error uploading file", err);
    }
  };

  const handleDeleteFile = () => {
    setFile(initFile);
  };

  return (
    <div className="bg-black h-screen w-screen flex flex-col gap-10 justify-center items-center py-10 text-white">
      <div className="text-3xl font-bold text-center">Upload File to Azure</div>
      <div className="text-center flex flex-col gap-4">
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            className="border border-white rounded p-2 bg-black"
            onChange={(e) => {
              console.log(e.target.files[0]);
              setFile({
                fileName: e.target.files[0].name,
                file: e.target.files[0],
                fileURL: URL.createObjectURL(e.target.files[0]),
              });
            }}
          />
          {/* {file.fileURL && (
            <button
              onClick={handleDeleteFile}
              className="absolute top-3 right-2 bg-red-600 text-white w-6 h-6 p-0 rounded-full flex items-center justify-center"
            >
              X
            </button>
          )} */}
        </div>
        {file.fileURL && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-white rounded p-2 bg-black  hover:bg-white hover:text-black duration-150"
          >
            View PDF
          </button>
        )}
        <button
          className="border border-white rounded p-2 bg-black hover:bg-white hover:text-black duration-150"
          onClick={uploadFile}
        >
          Submit
        </button>
      </div>

      {isModalOpen && (
        <Modal fileURL={file.fileURL} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
