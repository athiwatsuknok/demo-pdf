"use client";

import axios from "axios";
import { useState } from "react";

const initFile = {
  fileName: "",
  file: null,
  fileURL: "",
  contentType: "",
};
export default function Home() {
  const [file, setFile] = useState(initFile);

  const getUploadLink = async () => {
    if (file.fileName) {
      try {
        const body = {
          contentType: file.contentType,
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
      const response = await axios.put(uploadLink, file.file, {
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.file.type, // Ensure the content type is set to the file's type
        },
      });
      console.log("File uploaded successfully", response);
    } catch (err) {
      console.error("Error uploading file", err);
    }
  };

  return (
    <div className="bg-black h-screen w-screen flex flex-col gap-10 justify-center items-center py-10 text-white">
      <div className="text-3xl font-bold text-center">Upload File to Azure</div>
      <div className="text-center flex flex-col gap-4">
        <input
          type="file"
          // accept=".png"
          className="border border-white rounded p-2 bg-black"
          onChange={(e) => {
            console.log(e.target.files[0]);
            setFile({
              fileName: e.target.files[0].name,
              file: e.target.files[0],
              fileURL: URL.createObjectURL(e.target.files[0]),
              contentType: e.target.files[0].type
            });
          }}
        />
        {file.fileURL && <iframe src={file.fileURL} width={500} height={500}></iframe>}
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
