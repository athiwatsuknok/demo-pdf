"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [uploadLink, setUploadLink] = useState("");
  const [file, setFile] = useState(null);

  const getUploadLink = async () => {
    if (fileName) {
      try {
        const body = {
          containerName: "arise-bucket-1",
          fileName: fileName,
        };
        const response = await axios.post("http://localhost:8080/signed-url-upload", body);
        console.log(response.data.sasURL);
        setUploadLink(response.data.sasURL);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const uploadFile = async () => {
    if (!uploadLink || !file) {
      console.error("Upload link or file is missing");
      return;
    }

    try {
      const response = await axios.put(uploadLink, file, {
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type, // Ensure the content type is set to the file's type
        },
      });
      console.log("File uploaded successfully", response);
    } catch (err) {
      console.error("Error uploading file", err);
    }
  };

  useEffect(() => {
    getUploadLink();
  }, [fileName]);

  return (
    <div className="bg-black h-screen w-screen flex flex-col gap-10 justify-center items-center py-10 text-white">
      <div className="text-3xl font-bold text-center">Upload File to Azure</div>
      <div className="text-center flex flex-col gap-4">
        <input
          type="file"
          accept=".png"
          className="border border-white rounded p-2 bg-black"
          onChange={(e) => {
            setFileName(e.target.files[0].name);
            setFile(e.target.files[0]);
          }}
        />
        <button
          className="border border-white rounded p-2 bg-black hover:bg-white hover:text-black duration-150"
          onClick={uploadFile}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
