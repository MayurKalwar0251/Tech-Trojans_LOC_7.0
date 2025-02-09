import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { MapPin, Users, Shield, File } from 'lucide-react';

const PoliceCaseDashboard = () => {
  const [cases, setCases] = useState([]);
  const [policeMembers, setPoliceMembers] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fill states with dummy data
    const dummyCases = [
      {
        caseNumber: "C001",
        status: "open",
        casePriority: "high",
        crimeDate: "2024-02-01",
        suspects: [{ name: "John Doe", age: 30, gender: "male", aadharNo: 123456789012 }],
        witnesses: [{ name: "Jane Doe", statement: "Saw the suspect at the scene." }],
        evidence: [{ type: "image", url: "https://example.com/image1.jpg" }],
        policeStation: "PS001",
        assignedInspector: "I001",
        crimeLocation: "Downtown",
        crimeCoordinates: { lat: "12.34", lng: "56.78" }
      },
      {
        caseNumber: "C002",
        status: "closed",
        casePriority: "medium",
        crimeDate: "2024-02-02",
        suspects: [{ name: "Jane Smith", age: 25, gender: "female", aadharNo: 987654321098 }],
        witnesses: [{ name: "Mike Johnson", statement: "Heard a loud noise." }],
        evidence: [{ type: "document", url: "https://example.com/doc1.pdf" }],
        policeStation: "PS002",
        assignedInspector: "I002",
        crimeLocation: "Uptown",
        crimeCoordinates: { lat: "23.45", lng: "67.89" }
      },
      {
        caseNumber: "C003",
        status: "under_investigation",
        casePriority: "low",
        crimeDate: "2024-02-03",
        suspects: [{ name: "Robert Brown", age: 40, gender: "male", aadharNo: 456789012345 }],
        witnesses: [{ name: "Sarah Williams", statement: "Saw the suspect fleeing." }],
        evidence: [{ type: "video", url: "https://example.com/video1.mp4" }],
        policeStation: "PS001",
        assignedInspector: "I001",
        crimeLocation: "Suburb",
        crimeCoordinates: { lat: "34.56", lng: "78.90" }
      },
    ];

    const dummyPoliceMembers = [
      { 
        name: "Inspector Smith", 
        badgeNumber: "I001", 
        role: "inspector", 
        policeStation: "PS001", 
        contactNumber: "123-456-7890", 
        email: "smith@police.com", 
        password: "password123" 
      },
      { 
        name: "Inspector Jane", 
        badgeNumber: "I002", 
        role: "inspector", 
        policeStation: "PS002", 
        contactNumber: "234-567-8901", 
        email: "jane@police.com", 
        password: "password456" 
      },
      { 
        name: "Constable Johnson", 
        badgeNumber: "I003", 
        role: "constable", 
        policeStation: "PS001", 
        contactNumber: "345-678-9012", 
        email: "johnson@police.com", 
        password: "password789" 
      },
    ];

    const dummyPoliceStations = [
      { 
        name: "Central Station", 
        location: "Downtown", 
        longitude: "12.34", 
        latitude: "56.78", 
        contactNumber: "111-222-3333", 
        inCharge: "I001", 
        policeMembers: ["I001", "I003"], 
        email: "central@police.com", 
        password: "station123" 
      },
      { 
        name: "North Station", 
        location: "Uptown", 
        longitude: "23.45", 
        latitude: "67.89", 
        contactNumber: "444-555-6666", 
        inCharge: "I002", 
        policeMembers: ["I002"], 
        email: "north@police.com", 
        password: "station456" 
      },
    ];

    setCases(dummyCases);
    setPoliceMembers(dummyPoliceMembers);
    setPoliceStations(dummyPoliceStations);
    setLoading(false);
  }, []);

  const COLORS = {
    primary: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    status: {
      open: '#ef4444',
      closed: '#22c55e',
      under_investigation: '#f59e0b'
    },
    priority: {
      high: '#dc2626',
      medium: '#f59e0b',
      low: '#22c55e'
    }
  };

  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`p-4 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  const CaseStatusDonut = () => {
    const statusData = [
      { name: 'Open', value: cases.filter(caseItem => caseItem.status === "open").length },
      { name: 'Closed', value: cases.filter(caseItem => caseItem.status === "closed").length }
    ];

    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Case Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS.status)[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const CasePriorityBar = () => {
    const priorityData = [
      { name: 'High', value: cases.filter(caseItem => caseItem.casePriority === "high").length },
      { name: 'Medium', value: cases.filter(caseItem => caseItem.casePriority === "medium").length },
      { name: 'Low', value: cases.filter(caseItem => caseItem.casePriority === "low").length }
    ];

    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Case Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS.priority)[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const CasesByPoliceStation = () => {
    const stationData = policeStations.map(station => ({
      name: station.name,
      cases: cases.filter(caseItem => caseItem.policeStation === station.id).length
    }));

    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Cases by Police Station</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stationData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cases" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const CasesByAssignedInspector = () => {
    const inspectorData = policeMembers
      .filter(member => member.role === "inspector")
      .map(inspector => ({
        name: inspector.name,
        cases: cases.filter(caseItem => caseItem.assignedInspector === inspector.badgeNumber).length
      }));

    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Cases by Assigned Inspector</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inspectorData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cases" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Police Department Analytics</h1>
          <p className="mt-2 text-gray-600">Comprehensive view of case management and department statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Cases" value={cases.length} icon={File} color="blue" />
          <StatsCard title="Active Inspectors" value={policeMembers.filter(member => member.role === "inspector").length} icon={Shield} color="green" />
          <StatsCard title="Total Suspects" value={cases.reduce((acc, caseItem) => acc + caseItem.suspects.length, 0)} icon={Users} color="red" />
          <StatsCard title="Police Stations" value={policeStations.length} icon={MapPin} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CaseStatusDonut />
          <CasePriorityBar />
          <CasesByPoliceStation />
          <CasesByAssignedInspector />
        </div>
      </div>
    </div>
  );
};

export default PoliceCaseDashboard;