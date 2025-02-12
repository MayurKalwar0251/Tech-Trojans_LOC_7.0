import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "..//context/userContext";
import { FileText, Film, Filter, X } from "lucide-react";

export default function PoliceDashboard({ policeStationId }) {
  const [cases, setCases] = useState([]);
  const [sortedCases, setSortedCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dateFrom: "",
    dateTo: "",
    location: "",
    caseType: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchCases() {
      if (!user?.policeStation) return;

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

    fetchCases();
  }, [user?.policeStation]);

  // Enhanced filtering method
  useEffect(() => {
    let filteredCases = cases.filter((case_) => {
      // Search term filtering
      const matchesSearch =
        !searchTerm ||
        case_.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.crimeLocation.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filtering
      const matchesStatus =
        !filters.status ||
        case_.status.toLowerCase() === filters.status.toLowerCase();

      // Priority filtering
      const matchesPriority =
        !filters.priority ||
        case_.casePriority.toLowerCase() === filters.priority.toLowerCase();

      // Date range filtering
      const caseDate = new Date(case_.crimeDate);
      const matchesDateFrom =
        !filters.dateFrom || caseDate >= new Date(filters.dateFrom);

      const matchesDateTo =
        !filters.dateTo || caseDate <= new Date(filters.dateTo);

      // Location filtering
      const matchesLocation =
        !filters.location ||
        case_.crimeLocation
          .toLowerCase()
          .includes(filters.location.toLowerCase());

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesLocation
      );
    });

    // Sort cases with open cases first
    filteredCases.sort((a, b) =>
      a.status.toLowerCase() === "open"
        ? -1
        : b.status.toLowerCase() === "open"
        ? 1
        : 0
    );

    setSortedCases(filteredCases);
  }, [searchTerm, cases, filters]);

  // Filter reset method
  const resetFilters = () => {
    setFilters({
      status: "",
      priority: "",
      dateFrom: "",
      dateTo: "",
      location: "",
      caseType: "",
    });
  };

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

  const renderEvidenceItem = (evid, index) => {
    switch (evid.fileType) {
      case "image":
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedEvidence(evid)}
          >
            <img
              src={evid.url}
              alt={evid.filename}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm truncate px-2">
                {evid.filename}
              </p>
            </div>
          </div>
        );

      case "video":
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedEvidence(evid)}
          >
            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
              <Film className="w-8 h-8 text-gray-500" />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm truncate px-2">
                {evid.filename}
              </p>
            </div>
          </div>
        );

      case "document":
        return (
          <a
            key={index}
            href={evid.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm truncate px-2">
                {evid.filename}
              </p>
            </div>
          </a>
        );

      default:
        return null;
    }
  };

  const renderSuspectCard = (suspect) => {
    return (
      <div
        key={suspect._id}
        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
      >
        <div className="flex items-start gap-3">
          <div className="bg-gray-200 rounded-full p-2">
            <img
              src="https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-875.jpg?semt=ais_hybrid"
              alt=""
              srcset=""
              className="w-5 h-5 text-gray-600"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{suspect.name}</h4>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>Age: {suspect.age}</p>
              <p>Gender: {suspect.gender}</p>
              <p>Address: {suspect.address}</p>
              <p>Aadhar: {suspect.aadharNo}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Case Management</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <Filter className="mr-2" /> Filters
        </button>
      </div>

      {/* Advanced Filtering Section */}
      {showFilters && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 grid md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="under_investigation">Under Investigation</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="p-2 border rounded"
          />

          <div className="flex items-center space-x-2">
            <label>From:</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
              className="p-2 border rounded"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label>To:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
              className="p-2 border rounded"
            />
          </div>

          <button
            onClick={resetFilters}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset Filters
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Search cases..."
        className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg mb-4"
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

      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full p-4 lg:p-8 max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Case header */}
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

              {/* Case details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-2xl text-gray-500">
                      Police Station
                    </label>
                    <p className="font-medium text-gray-800">
                      {selectedCase.policeStation.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedCase.policeStation.location}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xl text-gray-500">Priority</label>
                    <p className="font-medium text-gray-800">
                      {selectedCase.casePriority}
                    </p>
                  </div>
                  <div>
                    <label className="text-xl text-gray-500">Location</label>
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

              {/* Witness Section */}
              {selectedCase.witnesses && selectedCase.witnesses.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Witnesses
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCase.witnesses.map((witness, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">
                          {witness.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Statement: {witness.statement}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suspects Section */}
              {selectedCase.suspects && selectedCase.suspects.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Suspects
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCase.suspects.map((suspect) =>
                      renderSuspectCard(suspect)
                    )}
                  </div>
                </div>
              )}

              {/* Evidence Section */}
              {selectedCase?.evidence && selectedCase.evidence.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Evidence
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedCase.evidence.map((evid, index) =>
                      renderEvidenceItem(evid, index)
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Preview Modal remains the same */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedEvidence(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedEvidence.fileType === "image" && (
              <img
                src={selectedEvidence.url}
                alt={selectedEvidence.filename}
                className="max-h-[80vh] w-full object-contain"
              />
            )}

            {selectedEvidence.fileType === "video" && (
              <video
                src={selectedEvidence.url}
                controls
                className="max-h-[80vh] w-full"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
