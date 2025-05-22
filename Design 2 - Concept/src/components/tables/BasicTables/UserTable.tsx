import React from "react";

// 1. Define allowed statuses
type FileStatus = "Malicious" | "Clean";

// 2. Define the file data structure
interface FileEntry {
  name: string;
  status: FileStatus;
  riskScore: number;
  uploadTime: string;
}

// 3. Typed color map
const statusColors: Record<
  FileStatus,
  { bg: string; text: string; bar: string }
> = {
  Malicious: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    bar: "bg-red-500",
  },
  Clean: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    bar: "bg-green-500",
  },
};

const fileData: FileEntry[] = [
  {
    name: "invoice.eml",
    status: "Malicious",
    riskScore: 85,
    uploadTime: "2 hours ago",
  },
  {
    name: "report.pdf",
    status: "Clean",
    riskScore: 12,
    uploadTime: "5 hours ago",
  },
  {
    name: "contract.eml",
    status: "Clean",
    riskScore: 8,
    uploadTime: "1 day ago",
  },
  {
    name: "presentation.pptx",
    status: "Malicious",
    riskScore: 92,
    uploadTime: "2 days ago",
  },
  {
    name: "meeting_notes.eml",
    status: "Clean",
    riskScore: 15,
    uploadTime: "3 days ago",
  },
];

export default function FileTable() {
  return (
    <div className="bg-black/30 rounded-2xl p-6 border border-white/10 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 border-b border-white/10">
            <th className="pb-4">File Name</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Risk Score</th>
            <th className="pb-4">Upload Date</th>
            <th className="pb-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fileData.map((file, index) => {
            const color = statusColors[file.status]; // ✅ now safely typed
            return (
              <tr key={index} className="text-white border-b border-white/10">
                <td className="py-4 flex items-center gap-2">
                  {/* file icon */}
                  <svg
                    className="text-blue-400"
                    width="1em"
                    height="1em"
                    viewBox="0 0 384 512"
                    fill="currentColor"
                  >
                    <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
                  </svg>
                  <span>{file.name}</span>
                </td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${color.bg} ${color.text}`}
                  >
                    {file.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full">
                      <div
                        className={`h-full rounded-full ${color.bar}`}
                        style={{ width: `${file.riskScore}%` }}
                      />
                    </div>
                    <span>{file.riskScore.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="py-4 flex items-center gap-2 text-gray-400">
                  <svg
                    className="text-sm"
                    width="1em"
                    height="1em"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z" />
                  </svg>
                  <span>{file.uploadTime}</span>
                </td>
                <td className="py-4">
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
