import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "..//context/userContext";

export default function PoliceDashboard({ policeStationId }) {
  const [cases, setCases] = useState([]);
  const [sortedCases, setSortedCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { user } = useContext(UserContext);

  // const policeStationId = user.policeStation;
  useEffect(() => {
    async function fetchCases() {
      if (!user?.policeStation) return; // Ensure policeStation exists

      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/station/${user.policeStation}`
        );

        console.log(response);

        setCases(response.data.cases || []);
        setSortedCases(response.data.cases || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cases:", error);
        setLoading(false);
      }
    }

    fetchCases(); // Call the function
  }, [user?.policeStation]); // Correct dependency

  useEffect(() => {
    const filtered = cases
      .filter(
        (case_) =>
          case_.caseNumber.includes(searchTerm.toLowerCase()) ||
          case_.description.includes(searchTerm.toLowerCase()) ||
          case_.crimeLocation.includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (a.status === "open" ? -1 : 1));

    setSortedCases(filtered);
  }, [searchTerm, cases]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    return status.toLowerCase() === "open"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-green-100 text-green-700 border-green-200";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Case Management</h2>

      <input
        type="text"
        placeholder="Search cases..."
        className="w-full sm:w-64 pl-3 pr-4 py-2 border border-gray-300 rounded-lg mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading cases...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Case Number</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Priority</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedCases.map((case_) => (
                <tr
                  key={case_._id}
                  onClick={() => setSelectedCase(case_)}
                  className="cursor-pointer hover:bg-gray-200 transition"
                >
                  <td className="p-2">{case_.caseNumber}</td>
                  <td className="p-2">{case_.description}</td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                        case_.casePriority
                      )}`}
                    >
                      {case_.casePriority}
                    </span>
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        case_.status
                      )}`}
                    >
                      {case_.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full p-4 lg:p-8">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                    {selectedCase.description}
                  </h2>
                  <p className="text-gray-500">
                    Case Number: {selectedCase.caseNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedCase.status
                  )}`}
                >
                  {selectedCase.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Priority</label>
                    <p className="font-medium text-gray-800">
                      {selectedCase.casePriority}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <p className="font-medium text-gray-800">
                      {selectedCase.crimeLocation}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedCase.assignedInspector && (
                    <div>
                      <label className="text-sm text-gray-500">
                        Assigned Officer
                      </label>
                      <p className="font-medium text-gray-800">
                        {selectedCase.assignedInspector.name}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500">Crime Date</label>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedCase.crimeDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {selectedCase?.evidence && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Evidence
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedCase?.evidence?.map(
                      (evid, index) =>
                        evid.type === "image" && (
                          <div
                            key={index}
                            className="group relative overflow-hidden rounded-lg border border-gray-200"
                          >
                            <img
                              src={evid.url}
                              alt="Evidence"
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
