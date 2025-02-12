import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle2,
  FileQuestion,
  FileText,
  PlusCircle,
  Upload,
  UserPlus,
} from "lucide-react"; // Icon for adding suspects/evidence

export default function MultiStepCaseForm() {
  const [step, setStep] = useState(1);
  const [caseId, setCaseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    caseNumber: "",
    title: "",
    description: "",
    status: "open",
    casePriority: "medium",
    policeStation: "",
    assignedInspector: "",
    crimeDate: "",
    crimeLocation: "",
    crimeCoordinates: { lat: "121", lng: "121" },
    suspects: [],
    evidence: [],
    witnesses: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      crimeCoordinates: { ...prev.crimeCoordinates, [name]: value },
    }));
  };

  const handleSuspectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSuspects = [...formData.suspects];
    updatedSuspects[index][name] = value;
    setFormData((prev) => ({ ...prev, suspects: updatedSuspects }));
  };

  const handleEvidenceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEvidence = [...formData.evidence];
    updatedEvidence[index][name] = value;
    setFormData((prev) => ({ ...prev, evidence: updatedEvidence }));
  };

  const handleFileChange = (index, e) => {
    const updatedEvidence = [...formData.evidence];
    updatedEvidence[index].file = e.target.files[0];
    setFormData((prev) => ({ ...prev, evidence: updatedEvidence }));
  };

  const addSuspect = () => {
    setFormData((prev) => ({
      ...prev,
      suspects: [
        ...prev.suspects,
        { name: "", age: "", address: "", gender: "", aadharNo: "" },
      ],
    }));
  };

  const addEvidence = () => {
    setFormData((prev) => ({
      ...prev,
      evidence: [...prev.evidence, { type: "image", file: null }],
    }));
  };

  const createCase = async () => {
    setLoading(true);
    try {
      console.log(formData);

      const response = await axios.post(
        "http://localhost:3000/api/v1/police-case/create",
        {
          ...formData,
          crimeCoordinates: {
            lat: formData.crimeCoordinates.lat,
            lng: formData.crimeCoordinates.lng,
          },
        }
      );

      if (response.data && response.data.case._id) {
        setCaseId(response.data.case._id);
        setStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error creating case:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitSuspects = async () => {
    if (!caseId) return alert("Case ID is missing!");
    setLoading(true);

    try {
      for (const suspect of formData.suspects) {
        await axios.post(
          `http://localhost:3000/api/v1/police-case/add_suspect/${caseId}`,
          suspect
        );
      }
      setStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding suspects:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitEvidence = async () => {
    if (!caseId) return alert("Case ID is missing!");
    setLoading(true);

    try {
      for (const evidenceItem of formData.evidence) {
        const formDataObj = new FormData();
        formDataObj.append("file", evidenceItem.file);
        formDataObj.append("type", evidenceItem.type);

        await axios.post(
          `http://localhost:3000/api/v1/police-case/upload_evidence/${caseId}`,
          formDataObj,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error uploading evidence:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCaseId(null);
    setFormData({
      caseNumber: "",
      title: "",
      description: "",
      status: "open",
      casePriority: "medium",
      policeStation: "",
      assignedInspector: "",
      crimeDate: "",
      crimeLocation: "",
      crimeCoordinates: { lat: "", lng: "" },
      suspects: [],
      evidence: [],
    });
  };

  useEffect(() => {
    console.log("Status updated:", formData.status);
  }, [formData.status]);

  const handleWitnessChange = (index, e) => {
    const { name, value } = e.target;
    const updatedWitnesses = [...formData.witnesses];
    updatedWitnesses[index][name] = value;
    setFormData((prev) => ({ ...prev, witnesses: updatedWitnesses }));
  };

  const addWitness = () => {
    setFormData((prev) => ({
      ...prev,
      witnesses: [...prev.witnesses, { name: "", statement: "" }],
    }));
  };

  const submitWitnesses = async () => {
    if (!caseId) return alert("Case ID is missing!");
    setLoading(true);

    try {
      for (const witness of formData.witnesses) {
        await axios.post(
          `http://localhost:3000/api/v1/police-case/add_witness/${caseId}`,
          witness
        );
      }
      alert("Case submitted successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding witnesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) await createCase();
    else if (step === 2) await submitSuspects();
    else if (step === 3) await submitEvidence();
    else if (step === 4) await submitWitnesses();
  };

  // Progress bar component
  const StepProgressBar = () => {
    const steps = [
      { icon: <FileText />, title: "Case Details" },
      { icon: <UserPlus />, title: "Suspects" },
      { icon: <Upload />, title: "Evidence" },
      { icon: <FileQuestion />, title: "Witnesses" },
    ];

    return (
      <div className="flex justify-between items-center mb-6">
        {steps.map((s, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              step > index
                ? "text-green-500"
                : step === index + 1
                ? "text-blue-500"
                : "text-gray-300"
            }`}
          >
            {s.icon}
            <span className="text-xs mt-1">{s.title}</span>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-1 mx-2 mt-2 ${
                  step > index + 1 ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Multi-Step Case Form
      </h2>

      <StepProgressBar />

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="caseNumber"
              placeholder="Case Number"
              onChange={handleChange}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="under_investigation">Under Investigation</option>
            </select>
            <input
              type="date"
              name="crimeDate"
              onChange={handleChange}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="policeStation"
              placeholder="Police Station"
              onChange={handleChange}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="assignedInspector"
              placeholder="Assigned Inspector"
              onChange={handleChange}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="crimeLocation"
              placeholder="Crime Location"
              onChange={handleChange}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="crimeCoordinates.lat"
              placeholder="Latitude"
              onChange={handleCoordinateChange}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="crimeCoordinates.lng"
              placeholder="Longitude"
              onChange={handleCoordinateChange}
              className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {formData.suspects.map((_, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={(e) => handleSuspectChange(index, e)}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  onChange={(e) => handleSuspectChange(index, e)}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  onChange={(e) => handleSuspectChange(index, e)}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <select
                  name="gender"
                  onChange={(e) => handleSuspectChange(index, e)}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input
                type="text"
                name="aadharNo"
                placeholder="Aadhar Number"
                onChange={(e) => handleSuspectChange(index, e)}
                className="mt-4 p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          ))}
          <button
            onClick={addSuspect}
            className="p-3 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600 transition"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Add Suspect
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {formData.evidence.map((_, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
              <input
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                className="w-full p-3 border rounded-lg file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 hover:file:bg-blue-100"
              />
            </div>
          ))}
          <button
            onClick={addEvidence}
            className="p-3 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600 transition"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Add Evidence
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          {formData.witnesses.map((_, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
              <input
                type="text"
                name="name"
                placeholder="Witness Name"
                onChange={(e) => handleWitnessChange(index, e)}
                className="mb-4 p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <textarea
                name="statement"
                placeholder="Witness Statement"
                onChange={(e) => handleWitnessChange(index, e)}
                className="p-3 border rounded-lg w-full h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          ))}
          <button
            onClick={addWitness}
            className="p-3 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600 transition"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Add Witness
          </button>
        </div>
      )}
      <button
        onClick={handleNext}
        disabled={loading}
        className="p-2 bg-blue-500 text-white rounded-lg"
      >
        {loading ? "Processing..." : step < 3 ? "Next" : "Submit"}
      </button>
    </div>
  );
}

// import React, { useState } from "react";
// import axios from "axios";

// export default function MultiStepCaseForm() {
//   const [step, setStep] = useState(1);
//   const [caseId, setCaseId] = useState(null); // Stores case ID from first API response
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     caseNumber: "",
//     title: "",
//     description: "",
//     policeStation: "",
//     assignedInspector: "",
//     crimeDate: "",
//     crimeLocation: "",
//     crimeCoordinates: { lat: "1212", lng: "2121" },
//     name: "",
//     age: "",
//     address: "",
//     gender: "",
//     aadharNo: "",
//     fileType: "image",
//     file: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, file: e.target.files[0] });
//   };

//   const handleNext = async () => {
//     if (step === 1) {
//       await createCase();
//     } else if (step === 2) {
//       await addSuspect();
//     } else if (step === 3) {
//       await uploadEvidence();
//     }
//   };

//   const createCase = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/v1/police-case/create",
//         {
//           caseNumber: formData.caseNumber,
//           title: formData.title,
//           description: formData.description,
//           policeStation: formData.policeStation,
//           assignedInspector: formData.assignedInspector,
//           crimeDate: formData.crimeDate,
//           crimeLocation: formData.crimeLocation,
//           crimeCoordinates: {
//             lat: formData.crimeCoordinates.lat,
//             lng: formData.crimeCoordinates.lng,
//           },
//         }
//       );

//       if (response.data && response.data.case._id) {
//         setCaseId(response.data.case._id);
//         setStep((prevStep) => prevStep + 1); // ✅ Functional update
//       }
//     } catch (error) {
//       console.error("Error creating case:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addSuspect = async () => {
//     if (!caseId) return alert("Case ID is missing!");

//     setLoading(true);
//     try {
//       await axios.post(
//         `http://localhost:3000/api/v1/police-case/add_suspect/${caseId}`,
//         {
//           name: formData.name,
//           age: formData.age,
//           address: formData.address,
//           gender: formData.gender,
//           aadharNo: formData.aadharNo,
//         }
//       );

//       setStep((prevStep) => prevStep + 1); // ✅ Functional update
//     } catch (error) {
//       console.error("Error adding suspect:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const uploadEvidence = async () => {
//     if (!caseId) return alert("Case ID is missing!");

//     setLoading(true);
//     try {
//       const formDataObj = new FormData();
//       formDataObj.append("file", formData.file);
//       formDataObj.append("type", formData.fileType);

//       await axios.post(
//         `http://localhost:3000/api/v1/police-case/upload_evidence/${caseId}`,
//         formDataObj,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       alert("Case submitted successfully!");
//       setStep(1);
//       setCaseId(null);
//       setFormData({
//         caseNumber: "",
//         title: "",
//         description: "",
//         policeStation: "",
//         assignedInspector: "",
//         crimeDate: "",
//         crimeLocation: "",
//         crimeCoordinates: { lat: "", lng: "" },
//         name: "",
//         age: "",
//         address: "",
//         gender: "",
//         aadharNo: "",
//         fileType: "image",
//         file: null,
//       });
//     } catch (error) {
//       console.error("Error uploading evidence:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-4">Multi-Step Case Form</h2>

//       {/* Step Progress */}
//       <div className="mb-8">
//         <div className="flex justify-between mb-2">
//           {["Case Details", "Suspect Details", "Evidence"].map((label, idx) => (
//             <div key={idx} className="flex flex-col items-center">
//               <div
//                 className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2
//                 ${
//                   idx + 1 === step
//                     ? "border-blue-500 text-blue-500 shadow-lg shadow-blue-200"
//                     : idx + 1 < step
//                     ? "border-blue-500 bg-blue-500 text-white"
//                     : "border-gray-300 text-gray-300"
//                 }`}
//               >
//                 {idx + 1 < step ? "✓" : idx + 1}
//               </div>
//               <span
//                 className={`text-sm font-medium ${
//                   idx + 1 === step ? "text-blue-500" : "text-gray-500"
//                 }`}
//               >
//                 {label}
//               </span>
//             </div>
//           ))}
//         </div>
//         <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
//           <div
//             className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
//             style={{ width: `${((step - 1) / 2) * 100}%` }}
//           />
//         </div>
//       </div>

//       {/* Step Forms */}
//       {step === 1 && (
//         <>
//           <input
//             type="text"
//             name="caseNumber"
//             placeholder="Case Number"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//           <input
//             type="text"
//             name="title"
//             placeholder="Title"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//           <input
//             type="text"
//             name="policeStation"
//             placeholder="Police Station ID"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//           <input
//             type="text"
//             name="assignedInspector"
//             placeholder="Assigned Inspector ID"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//           <input
//             type="date"
//             name="crimeDate"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//           <input
//             type="text"
//             name="crimeLocation"
//             placeholder="Crime Location"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//         </>
//       )}

//       {step === 2 && (
//         <>
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//           <input
//             type="number"
//             name="age"
//             placeholder="Age"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//           <input
//             type="text"
//             name="address"
//             placeholder="Address"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//           <select
//             name="gender"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           >
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//           <input
//             type="text"
//             name="aadharNo"
//             placeholder="Aadhar Number"
//             onChange={handleChange}
//             className="mb-3 p-2 border w-full"
//           />
//         </>
//       )}

//       {step === 3 && (
//         <input
//           type="file"
//           onChange={handleFileChange}
//           className="mb-3 p-2 border w-full"
//         />
//       )}

//       <button
//         onClick={handleNext}
//         disabled={loading}
//         className="p-2 bg-blue-500 text-white rounded-lg"
//       >
//         {loading ? "Processing..." : step < 3 ? "Next" : "Submit"}
//       </button>
//     </div>
//   );
// }
