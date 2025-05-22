import React, { useEffect, useState } from "react";
import axios from "axios";

interface ScanEntry {
  id: number;
  input_type: string;
  raw_name: string;
  threat_type: string;
  is_malicious: boolean;
  created_at: string;
}

const ThreatBadge: React.FC<{ threat: string }> = ({ threat }) => {
  const colors: Record<string, string> = {
    phishing: "bg-red-500",
    malicious: "bg-pink-600",
    spam: "bg-purple-700",
    safe: "bg-green-600"
  };

  return (
    <span className={`text-white text-xs px-2 py-1 rounded ${colors[threat.toLowerCase()] || "bg-gray-500"}`}>
      {threat}
    </span>
  );
};

const ActivityMonitoring: React.FC = () => {
  const [scans, setScans] = useState<ScanEntry[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/scans/");
        setScans(response.data);
      } catch (error) {
        console.error("Failed to fetch scans", error);
      }
    };
    fetchScans();
  }, []);

  const filteredScans = filter
    ? scans.filter((s) => s.threat_type.toLowerCase() === filter.toLowerCase())
    : scans;

  return (
    <div className="bg-[#101728] text-white min-h-screen flex">
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">Activity Monitoring</h2>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <select
            className="bg-[#161b22] border border-gray-600 text-white p-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Threat Types</option>
            <option value="Phishing">Phishing</option>
            <option value="Malicious">Malicious</option>
            <option value="Spam">Spam</option>
          </select>
        </div>

        {/* Table */}
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2 px-4">Timestamp</th>
              <th className="py-2 px-4">Input Name</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Threat</th>
            </tr>
          </thead>
          <tbody>
            {filteredScans.map((entry) => (
              <tr key={entry.id} className="bg-[#161b22]">
                <td className="py-2 px-4">{new Date(entry.created_at).toLocaleString()}</td>
                <td className="py-2 px-4">{entry.raw_name}</td>
                <td className="py-2 px-4">{entry.input_type.toUpperCase()}</td>
                <td className="py-2 px-4">
                  <ThreatBadge threat={entry.threat_type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ActivityMonitoring;