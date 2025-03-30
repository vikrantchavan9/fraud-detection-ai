import React, { useState } from "react";

const FraudDetection = () => {
  const [formData, setFormData] = useState({
    amount: "",
    time: "",
    category: "",
    merchant: "",
    transaction_type: "",
    user_income: "",
    previous_fraud_history: "",
    location: "",
    day_of_week: "",
    user_age: "",
    device_used: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full flex">
        {/* Left Section */}
        <div className="w-1/2 bg-gray-900 text-white p-8 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">
            AI-Powered Fraud Detection
          </h1>
          <p className="text-gray-400 mb-4">
            Detect Fraud. Prevent Losses. Stay Secure.
          </p>
          <p className="text-gray-400">
            Our AI-powered fraud detection system analyzes transaction patterns,
            detects anomalies, and helps prevent fraudulent activities in real
            time. Simply enter transaction details, and let our intelligent
            system determine whether it’s legitimate or fraudulent.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-1/2 p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {Object.keys(formData).map((key, index) => (
              <input
                key={index}
                type="text"
                name={key}
                placeholder={key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                value={formData[key]}
                onChange={handleChange}
                className="border-b border-gray-400 p-2 focus:outline-none focus:border-gray-600"
              />
            ))}
            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
              >
                Predict Fraud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FraudDetection;
