import React, { useState, useEffect } from "react";

const cases = [
  {
    id: 1,
    caseNumber: "C001",
    description: "Theft",
    status: "Pending",
    location: "Downtown Market",
    assignedOfficer: "John Doe",
    reportedDate: "2025-02-01",
    priority: "High",
    evidence: [{ type: "image", url: "/api/placeholder/150/150" }],
  },
  {
    id: 2,
    caseNumber: "C002",
    description: "Assault",
    status: "Solved",
    location: "Park Street",
    assignedOfficer: "Jane Smith",
    reportedDate: "2025-01-28",
    priority: "Medium",
    evidence: [{ type: "image", url: "/api/placeholder/150/150" }],
  },
  {
    id: 3,
    caseNumber: "C003",
    description: "Burglary",
    status: "Pending",
    location: "Sector 12",
    assignedOfficer: "Mike Johnson",
    reportedDate: "2025-01-15",
    priority: "High",
    evidence: [{ type: "image", url: "/api/placeholder/150/150" }],
  },
];

const teamMembers = [
  { id: 1, name: "John Doe", role: "Senior Inspector", status: "Active" },
  { id: 2, name: "Jane Smith", role: "Detective", status: "On Case" },
  { id: 3, name: "Mike Johnson", role: "Officer", status: "Available" },
  { id: 4, name: "Sarah Wilson", role: "Detective", status: "On Leave" },
];

export default function PoliceDashboard() {
  const [sortedCases, setSortedCases] = useState(cases);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const filtered = cases
      .filter(case_ => 
        case_.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.assignedOfficer.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (a.status === "Pending" ? -1 : 1));
    
    setSortedCases(filtered);
  }, [searchTerm]);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    return status.toLowerCase() === 'pending' 
      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
      : 'bg-green-100 text-green-700 border-green-200';
  };

  const getTeamMemberStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'on case':
        return 'bg-blue-100 text-blue-700';
      case 'on leave':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col lg:flex-row p-4 lg:p-6 gap-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Case Management</h2>
            <div className="relative w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="Search cases..." 
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-600">Case Number</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-600">Priority</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCases.map((case_) => (
                    <tr 
                      key={case_.id} 
                      onClick={() => setSelectedCase(case_)}
                      className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 lg:px-6 py-4">
                        <span className="font-medium text-gray-700">{case_.caseNumber}</span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-gray-600">{case_.description}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(case_.priority)}`}>
                          {case_.priority}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(case_.status)}`}>
                          {case_.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="w-full lg:w-96">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Team Members</h2>
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${!sidebarOpen && 'hidden lg:block'}`}>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTeamMemberStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800">{selectedCase.description}</h2>
                  <p className="text-gray-500">Case Number: {selectedCase.caseNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCase.status)}`}>
                  {selectedCase.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Priority</label>
                    <p className="font-medium text-gray-800">{selectedCase.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <p className="font-medium text-gray-800">{selectedCase.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Assigned Officer</label>
                    <p className="font-medium text-gray-800">{selectedCase.assignedOfficer}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Reported Date</label>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedCase.reportedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Evidence</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedCase.evidence.map((evid, index) => (
                    evid.type === "image" && (
                      <div key={index} className="group relative overflow-hidden rounded-lg border border-gray-200">
                        <img src={evid.url} alt="Evidence" className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a
                            href={evid.url}
                            download
                            className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}