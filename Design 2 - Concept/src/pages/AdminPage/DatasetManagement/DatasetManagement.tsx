import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Dataset {
  filename: string;
  uploaded_at: string;
}

const DatasetManagement: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const fetchDatasets = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/datasets/");
      setDatasets(res.data);
    } catch (error) {
      console.error("Failed to fetch datasets", error);
    }
  };

  const uploadDataset = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:8000/api/datasets/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFile(null);
      fetchDatasets();  // Refresh list
    } catch (error) {
      console.error("Failed to upload dataset", error);
    }
  };

  const deleteDataset = async (filename: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/datasets/${filename}`);
      fetchDatasets();  // Refresh list
    } catch (error) {
      console.error("Failed to delete dataset", error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <div className="bg-[#101728] text-white min-h-screen flex">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dataset Management</h1>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm bg-[#1c1f26] text-white border border-gray-700 p-1 rounded"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={uploadDataset}
              disabled={!file}
            >
              Upload Dataset
            </button>
          </div>
        </div>

        <div className="bg-[#161b22] rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="text-gray-400 text-sm border-b border-gray-700">
              <tr>
                <th className="px-4 py-3">Dataset Name</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-[#1a1e26] transition-colors">
                  <td className="px-4 py-3">{dataset.filename}</td>
                  <td className="px-4 py-3">{new Date(dataset.uploaded_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button
                      className="text-red-400 px-3 py-1 text-sm rounded"
                      onClick={() => deleteDataset(dataset.filename)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {datasets.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-4">
                    No datasets uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DatasetManagement;