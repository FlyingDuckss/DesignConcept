
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FileUploadCard = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition p-10 rounded-xl shadow-lg text-white text-center w-52 h-52 flex items-center justify-center text-lg font-semibold"
  >
    {label}
  </div>
);

const FileDropZone = ({
  onFileChange,
  accept,
  fileName
}: {
  onFileChange: (file: File) => void;
  accept: string;
  fileName?: string | null;
}) => (
  <div className="border-dashed border-2 border-gray-600 p-6 rounded-lg text-center text-white">
    <input
      type="file"
      accept={accept}
      onChange={(e) => e.target.files && onFileChange(e.target.files[0])}
      className="hidden"
      id="upload-zone"
    />
    <label htmlFor="upload-zone" className="cursor-pointer block">
      <p>{fileName ? `Selected File: ${fileName}` : "Drag and drop your file here, or click to browse"}</p>
    </label>
  </div>
);

const UserPage = () => {
  const [activeModal, setActiveModal] = useState<null | "url" | "email" | "html" | "chat">(null);
  const [file, setFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    setUploading(true);
    try {
      let response;

      if (activeModal === "url" && urlInput.trim()) {
        response = await axios.post("http://localhost:8000/api/scan/", {
          input_text: urlInput
        });
      } else if (file) {
        const formData = new FormData();
        formData.append("file", file);
        response = await axios.post(`http://localhost:8000/api/scan/${activeModal}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      if (response?.data?.data) {
        setResult(response.data.data);
      }

    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#101728] text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-10">Select Input Type</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-10 place-items-center">
        <FileUploadCard label="URLs" onClick={() => setActiveModal("url")} />
        <FileUploadCard label="Emails (.eml)" onClick={() => setActiveModal("email")} />
        <FileUploadCard label="HTML Files (.html)" onClick={() => setActiveModal("html")} />
        <FileUploadCard label="Chat Logs (.json)" onClick={() => setActiveModal("chat")} />
      </div>

      <Dialog open={!!activeModal} onClose={() => setActiveModal(null)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-[#1F2937] p-6 rounded-lg max-w-md w-full text-white">
            <Dialog.Title className="text-xl font-semibold mb-4">
              {activeModal === "url"
                ? "Enter URL"
                : `Upload ${activeModal === "email" ? ".eml" : activeModal === "html" ? ".html" : ".json"} File`}
            </Dialog.Title>

            {activeModal === "url" ? (
              <input
                type="text"
                placeholder="Paste your link here"
                className="w-full p-2 rounded bg-gray-900 text-white placeholder-gray-400"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            ) : (
              <FileDropZone
                accept={activeModal === "email" ? ".eml" : activeModal === "html" ? ".html" : ".json"}
                onFileChange={(f) => setFile(f)}
                fileName={file?.name || null}
              />
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpload}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                disabled={uploading || (activeModal === "url" ? !urlInput.trim() : !file)}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={!!result} onClose={() => setResult(null)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-[#1f2937] p-6 rounded-lg max-w-md w-full text-white border border-blue-600">
            <Dialog.Title className="text-xl font-semibold mb-4">Scan Result</Dialog.Title>
            <p><strong>Malicious:</strong> {result?.is_malicious ? "Yes" : "No"}</p>
            <p><strong>Threat Type:</strong> {result?.threat_type}</p>
            <p><strong>Confidence:</strong> {result?.threat_score}%</p>
            <p><strong>Binary Confidence:</strong> {result?.binary_score}%</p>
            <p><strong>Keywords:</strong> {result?.highlighted_tokens.join(", ")}</p>

            <div className="mt-4 text-right">
              <button onClick={() => setResult(null)} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserPage;
