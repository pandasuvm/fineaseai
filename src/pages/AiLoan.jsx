import React, { useState } from "react";
import { Client } from "@gradio/client";

const AiLoan = () => {
  const [formData, setFormData] = useState({
    loanPurpose: "",
    age: "",
    income: "",
    cibilScore: "",
    experience: "",
    loanAmt: "",
    loanTenure: "",
    assets: "",
    propertyValue: "",
    vehicleCost: "",
  });

  const [response, setResponse] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Prepare the loan data in CSV format (10 values)
    let loanDetails = `${formData.loanPurpose},${formData.age},${formData.income},${formData.cibilScore},${formData.experience},${formData.loanAmt},${formData.loanTenure},${formData.assets}`;

    // Always include property value and vehicle cost, set to 0 if not applicable
    const propertyValue = formData.loanPurpose === "home" ? formData.propertyValue : 0;
    const vehicleCost = formData.loanPurpose === "vehicle" ? formData.vehicleCost : 0;

    // Add the values to make sure there are exactly 10 values
    loanDetails += `,${propertyValue},${vehicleCost}`;

    setLoading(true);
    try {
      const client = await Client.connect("https://edc0d3f231d6a13c86.gradio.live/");
      const result = await client.predict("/predict", { loan_details: loanDetails });

      setResponse(result.data);
    } catch (error) {
      console.error("Error:", error);
      setResponse("There was an error with the request.");
    } finally {
      setLoading(false);
    }
  };

  const renderResponse = (data) => {
    if (!data) return null;

    const { scheme, explanation, loan_details } = data[0];

    return (
      <div style={{ marginTop: "20px" }}>
        <h3>Response from Model:</h3>
        <div>
          <p><strong>Loan Scheme:</strong> {scheme}</p>
          <p><strong>Explanation:</strong> {explanation}</p>
          <h4>Loan Details:</h4>
          <div>
            <p><strong>Loan Amount:</strong> ₹{loan_details.loan_amount}</p>
            <p><strong>Loan Tenure:</strong> {loan_details.loan_tenure} years</p>
            <p><strong>Interest Rate:</strong> {loan_details.interest_rate}</p>
            <p><strong>EMI:</strong> ₹{loan_details.emi}</p>
            <p><strong>Total Interest:</strong> ₹{loan_details.total_interest}</p>
            <p><strong>Total Amount:</strong> ₹{loan_details.total_amount}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-white p-5">
      <h2 className="text-3xl font-bold text-white font-wide mb-6">Loan Application</h2>

      {/* Glassmorphism Form */}
      <div className="bg-white/10 border border-gray-500 backdrop-blur-md p-8 rounded-xl shadow-lg max-w-4xl mx-auto space-y-6">
        {/* First Row: Loan Purpose and Asset Valuation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-400 font-wide text-sm">Loan Purpose:</label>
            <select
              name="loanPurpose"
              onChange={handleChange}
              value={formData.loanPurpose}
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            >
              <option value="" className="text-black bg-gray-500 hover:bg-gray-600">Select Loan Purpose</option>
              <option value="education" className="text-black bg-gray-500 hover:bg-gray-600">Education Loan</option>
              <option value="marriage" className="text-black bg-gray-500 hover:bg-gray-600">Marriage Loan</option>
              <option value="personal" className="text-black bg-gray-500 hover:bg-gray-600">Personal Loan</option>
              <option value="home" className="text-black bg-gray-500">Home Loan</option>
              <option value="vehicle" className="text-black bg-gray-500">Vehicle Loan</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-400 font-wide text-sm">Assets Valuation:</label>
            <input
              type="number"
              name="assets"
              value={formData.assets}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            />
          </div>
        </div>

        {/* Second Row: Age, Annual Income, and Employment Experience */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-400 font-wide text-sm">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-400 font-wide text-sm">Annual Income:</label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-400 font-wide text-sm">Employment Experience (years):</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            />
          </div>
        </div>

        {/* Third Row: Cibil Score, Loan Amount, and Loan Tenure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-400 font-wide text-sm">CIBIL Score:</label>
            <input
              type="number"
              name="cibilScore"
              value={formData.cibilScore}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-400 font-wide text-sm">Loan Amount:</label>
            <input
              type="number"
              name="loanAmt"
              value={formData.loanAmt}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-400 font-wide text-sm">Loan Tenure (years):</label>
            <input
              type="number"
              name="loanTenure"
              value={formData.loanTenure}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            />
          </div>
        </div>

        {/* Conditional Input Fields based on Loan Purpose */}
        {formData.loanPurpose === "home" && (
          <div>
            <label className="block mb-2 font-medium text-gray-400 font-wide text-sm">Property Value:</label>
            <input
              type="number"
              name="propertyValue"
              value={formData.propertyValue}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            />
          </div>
        )}

        {formData.loanPurpose === "vehicle" && (
          <div>
            <label className="text-lg font-medium text-gray-400 font-wide mb-2">Vehicle Cost:</label>
            <input
              type="number"
              name="vehicleCost"
              value={formData.vehicleCost}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg border-2 border-[#5b5b5b] focus:border-2 focus:border-[#8c8c8c] focus:outline-none focus:ring-2 font-wide bg-[#212121] backdrop-blur-lg text-white"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 mt-6 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Display the Response from the Model */}
      {renderResponse(response)}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default AiLoan;
