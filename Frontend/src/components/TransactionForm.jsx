import React, { useState } from "react";

const TransactionForm = () => {
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
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* Time */}
        <input
          type="number"
          name="time"
          placeholder="Time (0-24)"
          value={formData.time}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* Category */}
        <input
          type="number"
          name="category"
          placeholder="Category (1-5)"
          value={formData.category}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* Merchant */}
        <input
          type="text"
          name="merchant"
          placeholder="Merchant"
          value={formData.merchant}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* Day of Week */}
        <input
          type="text"
          name="day_of_week"
          placeholder="Day of Week"
          value={formData.day_of_week}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* Transaction Type */}
        <input
          type="text"
          name="transaction_type"
          placeholder="Transaction Type (online/in-store)"
          value={formData.transaction_type}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* User Age */}
        <input
          type="number"
          name="user_age"
          placeholder="User Age"
          value={formData.user_age}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* User Income */}
        <input
          type="number"
          name="user_income"
          placeholder="User Income"
          value={formData.user_income}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* Device Used */}
        <input
          type="text"
          name="device_used"
          placeholder="Device Used (mobile/desktop)"
          value={formData.device_used}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* Previous Frauds */}
        <input
          type="number"
          name="previous_frauds"
          placeholder="Previous Frauds"
          value={formData.previous_frauds}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        {/* Submit Button */}
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Predict Fraud
        </button>
      </form>
      {/* Prediction Result */}
      {prediction !== null && (
        <div className="mt-4">
          <p className="text-lg">
            {prediction === 1
              ? "Fraudulent Transaction"
              : "Legitimate Transaction"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
