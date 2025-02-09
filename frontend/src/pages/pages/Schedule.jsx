import React, { useState } from "react";

const ScheduleManager = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [officer, setOfficer] = useState("");
  const [shift, setShift] = useState("");

  const [officers, setOfficers] = useState([
    { id: 1, name: "Rajesh Kumar" },
    { id: 2, name: "Priya Sharma" },
    { id: 3, name: "Amit Verma" },
    { id: 4, name: "Neha Joshi" },
  ]);

  const [shifts, setShifts] = useState([
    { id: 1, name: "Morning Shift", timing: "6:00 AM - 2:00 PM" },
    { id: 2, name: "Afternoon Shift", timing: "2:00 PM - 10:00 PM" },
    { id: 3, name: "Night Shift", timing: "10:00 PM - 6:00 AM" },
  ]);

  const [schedule, setSchedule] = useState([
    {
      officer: "Rajesh Kumar",
      shift: "Morning Shift",
      date: "2025-02-08",
      status: "Assigned",
    },
    {
      officer: "Priya Sharma",
      shift: "Afternoon Shift",
      date: "2025-02-08",
      status: "Assigned",
    },
    {
      officer: "Amit Verma",
      shift: "Night Shift",
      date: "2025-02-08",
      status: "Assigned",
    },
  ]);

  const assignShift = () => {
    if (officer && shift && selectedDate) {
      const newShift = {
        officer,
        shift,
        date: selectedDate,
        status: "Assigned",
      };
      setSchedule([...schedule, newShift]);
      setOfficer("");
      setShift("");
      setSelectedDate("");
    }
  };

  return (
    <div className="p-8 max-w-full space-y-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
        Police Department Shift Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="p-8 rounded-xl shadow-xl bg-white">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Assign Shift
          </h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="date"
                className="block text-lg font-semibold text-gray-700"
              >
                Select Date
              </label>
              <input
                type="date"
                id="date"
                className="block w-full px-5 py-4 text-lg rounded-xl border-2 border-gray-300 bg-gray-50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="officer"
                className="block text-lg font-semibold text-gray-700"
              >
                Select Officer
              </label>
              <select
                id="officer"
                className="block w-full px-5 py-4 text-lg rounded-xl border-2 border-gray-300 bg-gray-50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
              >
                <option value="">Choose an officer</option>
                {officers.map((off) => (
                  <option key={off.id} value={off.name}>
                    {off.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="shift"
                className="block text-lg font-semibold text-gray-700"
              >
                Select Shift
              </label>
              <select
                id="shift"
                className="block w-full px-5 py-4 text-lg rounded-xl border-2 border-gray-300 bg-gray-50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              >
                <option value="">Choose a shift</option>
                {shifts.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.timing})
                  </option>
                ))}
              </select>
            </div>

            <button
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl text-xl font-semibold cursor-pointer hover:bg-purple-500 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/50 mt-6"
              onClick={assignShift}
            >
              Assign Shift
            </button>
          </div>
        </div>

        <div className="p-8 rounded-xl shadow-xl bg-white">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Current Schedule
          </h2>
          <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-6 py-5 text-left text-lg font-bold text-gray-800">
                    Officer
                  </th>
                  <th className="px-6 py-5 text-left text-lg font-bold text-gray-800">
                    Shift
                  </th>
                  <th className="px-6 py-5 text-left text-lg font-bold text-gray-800">
                    Date
                  </th>
                  <th className="px-6 py-5 text-left text-lg font-bold text-gray-800">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-5 text-lg">{item.officer}</td>
                    <td className="px-6 py-5 text-lg">{item.shift}</td>
                    <td className="px-6 py-5 text-lg">{item.date}</td>
                    <td className="px-6 py-5">
                      <span className="px-6 py-2 bg-green-500 text-white rounded-full text-base font-semibold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;
