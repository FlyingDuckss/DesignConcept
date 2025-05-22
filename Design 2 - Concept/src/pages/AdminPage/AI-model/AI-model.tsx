import React, { useEffect, useState } from "react";
import axios from "axios";

const modes = ["hybrid", "binary-only", "multi-only"];

const MetricCard = ({ title, value }: { title: string; value: number | string }) => (
  <div className="bg-[#1a1f2c] p-4 rounded shadow w-full">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const ModelStats = ({ type, metrics }: { type: string; metrics: any }) => (
  <div className="bg-[#2e333f] p-6 rounded-lg shadow w-full md:w-1/3">
    <h2 className="text-lg font-semibold mb-4 capitalize">{type} Model Stats</h2>
    <div className="grid grid-cols-2 gap-4">
      <MetricCard title="Accuracy" value={metrics?.accuracy ?? "—"} />
      <MetricCard title="Precision" value={metrics?.precision ?? "—"} />
      <MetricCard title="Recall" value={metrics?.recall ?? "—"} />
      <MetricCard title="F1 Score" value={metrics?.f1_score ?? "—"} />
    </div>
  </div>
);

const AIModelTuning: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState("hybrid");
  const [status, setStatus] = useState<any>(null);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [trainingStats, setTrainingStats] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [retrainBinary, setRetrainBinary] = useState(false);
  const [retrainMulti, setRetrainMulti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/model/status");
        setStatus(res.data);
        setSelectedMode(res.data.mode);
      } catch (err) {
        console.error("Failed to load model status", err);
      }
    };

    const fetchDatasets = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/datasets/");
        setDatasets(res.data.map((d: any) => d.filename));
      } catch (err) {
        console.error("Failed to load datasets", err);
      }
    };

    const fetchTrainingStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/training_stats.json");
        setTrainingStats(res.data);
      } catch (err) {
        console.warn("Training stats not found");
      }
    };

    fetchStatus();
    fetchDatasets();
    fetchTrainingStats();
  }, []);

  const switchMode = async (mode: string) => {
    try {
      await axios.post("http://localhost:8000/api/model/switch", { mode });
      setSelectedMode(mode);
    } catch (err) {
      console.error("Failed to switch mode", err);
    }
  };

  const triggerRetrain = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8000/api/model/retrain", {
        dataset: selectedDataset,
        retrain_binary: retrainBinary,
        retrain_multi: retrainMulti,
      });
      setMessage("✅ Retraining successful!");
      setShowModal(false);
      setTrainingStats(response.data.metrics);
    } catch (err) {
      setMessage("❌ Retraining failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#101728] min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-6">AI Model Tuning</h1>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
  {modes.map((mode) => (
    <div
      key={mode}
      className={`p-6 rounded-lg cursor-pointer transition ${
        selectedMode === mode ? "bg-blue-600" : "bg-[#2e333f] hover:bg-[#3c4455]"
      }`}
      onClick={() => switchMode(mode)}
    >
      <h2 className="text-lg font-semibold capitalize">{mode.replace("-", " ")}</h2>
      <p className="text-sm mt-2">
        {mode === "hybrid"
          ? "Uses both binary and multi-class models for more accurate predictions."
          : mode === "binary-only"
          ? "Only the binary classifier (safe vs malicious) is used."
          : "Only the multi-class model is used for detecting specific threat types."}
      </p>
    </div>
  ))}
</div>


      {/* Model Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#2e333f] p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Binary Model</h2>
          <p className="text-sm text-gray-300">Name: {status?.binary_model?.name}</p>
          <p className="text-sm text-gray-300">Last Trained: {status?.binary_model?.last_updated}</p>
          <p className="text-sm text-gray-300">Dataset: {status?.binary_model?.trained_on}</p>
        </div>
        <div className="bg-[#2e333f] p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Multi-Class Model</h2>
          <p className="text-sm text-gray-300">Name: {status?.multi_model?.name}</p>
          <p className="text-sm text-gray-300">Last Trained: {status?.multi_model?.last_updated}</p>
          <p className="text-sm text-gray-300">Dataset: {status?.multi_model?.trained_on}</p>
        </div>
      </div>

      {/* Metrics */}
      {trainingStats && (
        <div className="flex flex-wrap gap-6 mb-10">
          {trainingStats.binary_model && <ModelStats type="binary" metrics={trainingStats.binary_model} />}
          {trainingStats.multi_model && <ModelStats type="multi" metrics={trainingStats.multi_model} />}
        </div>
      )}

      {/* Retrain Panel */}
      <div className="bg-[#2e333f] p-6 rounded-lg shadow w-full md:w-1/3">
        <h3 className="text-lg font-semibold mb-4">Retrain Models</h3>
        <p className="text-sm text-gray-400 mb-4">
          Upload new datasets in Dataset Management and trigger retraining to improve accuracy.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Retrain
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#1f2937] p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Select Dataset and Model</h3>

            <label className="block mb-2 text-sm">Dataset:</label>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="w-full mb-4 p-2 bg-[#0d1117] border border-gray-600 rounded text-white"
            >
              <option value="">Select dataset</option>
              {datasets.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>

            <label className="block mb-1 text-sm">Models to Retrain:</label>
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm">
                <input type="checkbox" checked={retrainBinary} onChange={(e) => setRetrainBinary(e.target.checked)} className="mr-1" />
                Binary
              </label>
              <label className="text-sm">
                <input type="checkbox" checked={retrainMulti} onChange={(e) => setRetrainMulti(e.target.checked)} className="mr-1" />
                Multi-class
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white">
                Cancel
              </button>
              <button
                onClick={triggerRetrain}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
                disabled={loading || !selectedDataset || (!retrainBinary && !retrainMulti)}
              >
                {loading ? "Retraining..." : "Start Retrain"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModelTuning;