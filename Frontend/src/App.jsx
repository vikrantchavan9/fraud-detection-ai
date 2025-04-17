import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";
const initialForm = {
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
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await axios.post(API_URL + "/predict", form);
      if (res.data.status === "success") setData(res.data);
      else setError(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg flex overflow-hidden w-full max-w-6xl">
        {/* Sidebar */}
        <div className="w-1/3 bg-slate-900 text-white p-8">
          <h2 className="text-3xl font-bold mb-4">AI-Powered Fraud Detection</h2>
          <p className="text-sm leading-relaxed">
            Detect Fraud. Prevent Losses. Stay Secure.
            <br /><br />
            Our AI solution analyzes transaction patterns, detects anomalies, and helps prevent fraudulent activities in real time.
          </p>
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-8">
          <h3 className="text-xl font-semibold mb-6">Transaction Details</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
            {Object.keys(form).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium capitalize mb-1">{key.replace(/_/g, ' ')}</label>
                <input
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={key === 'amount' ? 'Transaction amount' :
                    key === 'time' ? '24-hour format (0-23)' :
                    key === 'category' ? 'Credit, Debit, Bank Transfer' :
                    key === 'location' ? 'Eg. Los Angeles' :
                    key === 'merchant' ? 'Eg. Store A' :
                    key === 'day_of_week' ? 'Eg. Monday' :
                    key === 'transaction_type' ? 'Online/In-store' :
                    key === 'user_age' ? "Enter user's age" :
                    key === 'user_income' ? "Enter user's income" :
                    key === 'device_used' ? 'Mobile/Desktop' :
                    key === 'previous_frauds' ? '0-3' : '' }
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            ))}
            <div className="col-span-2 text-right">
              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-slate-900 text-white py-2 px-6 rounded-md hover:bg-slate-800 transition"
              >{loading ? 'Predicting...' : 'Predict Fraud'}</button>
            </div>
          </form>

          {error && <p className="text-red-600 mt-4">{error}</p>}

          {data && (
            <div className="mt-8">
              <div className={
                'p-4 rounded text-center font-semibold ' +
                (data.prediction === 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')
              }>
                {data.prediction === 1 ? '⚠️ Transaction Predicted as FRAUDULENT' : '✅ Transaction is LEGITIMATE'}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div><span className="font-semibold">Probability:</span> {(data.probability * 100).toFixed(2)}%</div>
                <div><span className="font-semibold">Risk Level:</span> {data.risk_level}</div>
                <div><span className="font-semibold">Timestamp:</span> {new Date(data.timestamp).toLocaleString()}</div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Top 5 Feature Impacts</h4>
                <div className="space-y-3">
                  {data.explanation.feature_importances.map((feat, i) => (
                    <div key={i} className={
                      'p-3 rounded border ' +
                      (feat.impact > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200')
                    }>
                      <p className="font-medium">{feat.feature}</p>
                      <p>Value: <span className="font-mono">{feat.value}</span></p>
                      <p>Impact: <span className="font-mono">{feat.impact > 0 ? '+' : ''}{feat.impact.toFixed(4)}</span> ({feat.direction})</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500">Base value: {data.explanation.base_value.toFixed(4)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
