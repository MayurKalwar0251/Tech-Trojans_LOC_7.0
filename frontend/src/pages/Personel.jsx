import React, { useState } from "react";

const personnelData = [
  {
    id: 1,
    name: "Arjun Kumar",
    rank: "Inspector",
    badgeNumber: "INSP9001",
    status: "On Duty",
    contact: "9876543210",
  },
  {
    id: 2,
    name: "Priya Sharma",
    rank: "Sub-Inspector",
    badgeNumber: "SIPT9002",
    status: "Off Duty",
    contact: "9123456789",
  },
  {
    id: 3,
    name: "Ravi Patel",
    rank: "Constable",
    badgeNumber: "CON9003",
    status: "On Leave",
    contact: "9234567890",
  },
  {
    id: 4,
    name: "Neha Reddy",
    rank: "Inspector",
    badgeNumber: "INSP9004",
    status: "On Duty",
    contact: "9345678901",
  },
  {
    id: 5,
    name: "Amit Verma",
    rank: "Constable",
    badgeNumber: "CON9005",
    status: "Off Duty",
    contact: "9456789012",
  },
];

export default function Personnel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [personnel, setPersonnel] = useState(personnelData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    name: "",
    rank: "Inspector",
    badgeNumber: "",
    status: "On Duty",
    contact: "",
  });

  const filteredPersonnel = personnel.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.badgeNumber.includes(searchTerm)
  );

  const handleAddOfficer = () => {
    if (
      !newOfficer.name ||
      !newOfficer.rank ||
      !newOfficer.badgeNumber ||
      !newOfficer.contact
    ) {
      alert("Please fill all fields");
      return;
    }

    const newOfficerData = {
      id: personnel.length + 1,
      ...newOfficer,
    };

    setPersonnel([...personnel, newOfficerData]);
    setIsDialogOpen(false);
    setNewOfficer({
      name: "",
      rank: "Inspector",
      badgeNumber: "",
      status: "On Duty",
      contact: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Personnel Management
        </h1>

        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search by name or badge number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
          />
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-500 transition-all text-lg"
          >
            Add New Officer
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-8 py-4 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-8 py-4 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Badge Number
                </th>
                <th className="px-8 py-4 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-4 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPersonnel.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-8 py-6 whitespace-nowrap text-lg font-medium text-gray-900">
                    {person.name}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-lg text-gray-500">
                    {person.rank}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-lg text-gray-500">
                    {person.badgeNumber}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-lg">
                    <span
                      className={`px-4 py-2 rounded-full text-base font-semibold ${
                        person.status === "On Duty"
                          ? "bg-green-100 text-green-800"
                          : person.status === "Off Duty"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-lg text-gray-500">
                    {person.contact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 w-1/3">
              <h2 className="text-2xl font-bold mb-6">Add New Officer</h2>
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Name"
                  value={newOfficer.name}
                  onChange={(e) =>
                    setNewOfficer({ ...newOfficer, name: e.target.value })
                  }
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <select
                  value={newOfficer.rank}
                  onChange={(e) =>
                    setNewOfficer({ ...newOfficer, rank: e.target.value })
                  }
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                  <option value="Inspector">Inspector</option>
                  <option value="Sub-Inspector">Sub-Inspector</option>
                  <option value="Constable">Constable</option>
                </select>
                <input
                  type="text"
                  placeholder="Badge Number"
                  value={newOfficer.badgeNumber}
                  onChange={(e) =>
                    setNewOfficer({
                      ...newOfficer,
                      badgeNumber: e.target.value,
                    })
                  }
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <select
                  value={newOfficer.status}
                  onChange={(e) =>
                    setNewOfficer({ ...newOfficer, status: e.target.value })
                  }
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                  <option value="On Duty">On Duty</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="On Leave">On Leave</option>
                </select>
                <input
                  type="text"
                  placeholder="Contact"
                  value={newOfficer.contact}
                  onChange={(e) =>
                    setNewOfficer({ ...newOfficer, contact: e.target.value })
                  }
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>
              <div className="mt-8 flex justify-end space-x-6">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOfficer}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all text-lg"
                >
                  Add Officer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
