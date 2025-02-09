import React, { useState } from "react";

export default function MultiStepCaseForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    caseNumber: "",
    title: "",
    description: "",
    policeStation: "",
    assignedInspector: "",
    crimeDate: "",
    crimeLocation: "",
    crimeCoordinates: "",
    casePriority: "",
    name: "",
    age: "",
    address: "",
    gender: "",
    aadharNo: "",
    fileType: "",
    file: null,
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const Progress = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {['Case Details', 'Suspect Details', 'Evidence'].map((label, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 
              ${idx + 1 === step ? 'border-emerald-400 text-emerald-400 shadow-lg shadow-emerald-100' : 
                idx + 1 < step ? 'border-emerald-500 bg-emerald-500 text-white' : 
                'border-gray-300 text-gray-300'}`}>
              {idx + 1 < step ? '✓' : idx + 1}
            </div>
            <span className={`text-sm font-medium ${idx + 1 === step ? 'text-emerald-500' : 'text-gray-500'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
        <div 
          className="h-full bg-emerald-500 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
      </div>
    </div>
  );

  const InputField = ({ name, type = "text", placeholder, options = [] }) => {
    const baseClasses = "w-full p-4 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-800/5 border border-gray-700/10 text-gray-800 placeholder-gray-500";
    
    if (type === "select") {
      return (
        <select name={name} onChange={handleChange} className={baseClasses}>
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }
    if (type === "textarea") {
      return (
        <textarea
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          className={`${baseClasses} min-h-[120px]`}
        />
      );
    }
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        className={baseClasses}
      />
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-emerald-100">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 rounded-3xl pointer-events-none"></div>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Case Registration
        </h2>
        <p className="text-center text-gray-600 mb-8">Complete all steps to register a new case</p>
        
        <Progress />

        <div className="space-y-6 relative">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-2 text-sm">1</span>
                Case Details
              </h3>
              <InputField name="caseNumber" placeholder="Case Number" />
              <InputField name="title" placeholder="Case Title" />
              <InputField name="description" type="textarea" placeholder="Case Description" />
              <div className="grid grid-cols-2 gap-4">
                <InputField name="policeStation" placeholder="Police Station" />
                <InputField name="assignedInspector" placeholder="Assigned Inspector" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField name="crimeDate" type="date" />
                <InputField name="crimeLocation" placeholder="Crime Location" />
              </div>
              <InputField name="crimeCoordinates" placeholder="Crime Coordinates" />
              <InputField
                name="casePriority"
                type="select"
                placeholder="Select Priority"
                options={[
                  { value: "low", label: "Low Priority" },
                  { value: "medium", label: "Medium Priority" },
                  { value: "high", label: "High Priority" },
                ]}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-2 text-sm">2</span>
                Suspect Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField name="name" placeholder="Full Name" />
                <InputField name="age" type="number" placeholder="Age" />
              </div>
              <InputField name="address" type="textarea" placeholder="Complete Address" />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="gender"
                  type="select"
                  placeholder="Select Gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <InputField name="aadharNo" placeholder="Aadhar Number" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-2 text-sm">3</span>
                Upload Evidence
              </h3>
              <InputField
                name="fileType"
                type="select"
                placeholder="Select File Type"
                options={[
                  { value: "jpg", label: "JPG Image" },
                  { value: "png", label: "PNG Image" },
                ]}
              />
              <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 text-center bg-emerald-50/50 hover:bg-emerald-50 transition-colors duration-200">
                <input
                  type="file"
                  name="file"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Click to upload or drag and drop</span>
                  <span className="text-sm text-gray-500">JPG or PNG (max. 10MB)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
              onClick={handleBack}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          )}
          {step < 3 ? (
            <button
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 ml-auto flex items-center space-x-2 shadow-lg shadow-emerald-200"
              onClick={handleNext}
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 ml-auto flex items-center space-x-2 shadow-lg shadow-emerald-200"
            >
              <span>Submit Case</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}