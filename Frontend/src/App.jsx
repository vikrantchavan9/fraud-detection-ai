import React, { useState } from "react";

const App = () => {
  const [formData, setFormData] = useState({
    amount: "",
    time: "",
    category: "",
    location: "",
    merchant: "",
    day_of_week: "",
    transaction_type: "",
    user_age: "",
    user_income: "",
    device_used: "",
    previous_frauds: "",
  });
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending data:", formData); // Log the data being sent
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setPrediction(result.fraud);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 flex">
        {/* Left Section */}
        <div className="w-2/6 bg-gray-900 text-white p-8 rounded-lg">
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
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Transaction Details
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              {
                name: "amount",
                title: "Amount",
                placeholder: "Transaction amount",
              },
              {
                name: "time",
                title: "Time",
                placeholder: "24-hour format (0-23)",
              },
              {
                name: "category",
                title: "Category",
                placeholder: "Credit , Debit , Bank Transfer",
              },
              {
                name: "location",
                title: "Location",
                placeholder: "Eg. Los Angeles",
              },
              {
                name: "merchant",
                title: "Merchant",
                placeholder: "Eg. Store A",
              },
              {
                name: "day_of_week",
                title: "Day of Week",
                placeholder: "Eg. Monday",
              },
              {
                name: "transaction_type",
                title: "Transaction Type",
                placeholder: "Online/In-store",
              },
              {
                name: "user_age",
                title: "User Age",
                placeholder: "Enter user's age",
              },
              {
                name: "user_income",
                title: "User Income",
                placeholder: "Enter user's income",
              },
              {
                name: "device_used",
                title: "Device Used",
                placeholder: "Mobile/Desktop",
              },
              {
                name: "previous_frauds",
                title: "Previous Fraud History",
                placeholder: "0-3",
              },
            ].map(({ name, title, placeholder }, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-1">
                  {title}
                </label>
                <input
                  type="text"
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className="border-b border-gray-400 p-2 focus:outline-none focus:border-gray-600 w-full"
                />
              </div>
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
          {/* Prediction Result */}
          {prediction !== null && (
            <div
              className="mt-6 p-4 rounded-lg text-center font-semibold text-lg"
              style={{
                backgroundColor: prediction === 1 ? "#ffcccc" : "#ccffcc",
                color: prediction === 1 ? "#cc0000" : "#008000",
              }}
            >
              {prediction === 1
                ? "This transaction appears to be fraudulent!"
                : "This transaction seems legitimate and secure."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
