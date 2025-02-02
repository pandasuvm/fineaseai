import React, { useState } from "react";
import { Client } from "@gradio/client";

const AiLoan = () => {
  const [formData, setFormData] = useState({
    loanPurpose: "", // This will now be both Loan Type and Loan Purpose
    age: "",
    income: "",
    cibilScore: "",
    experience: "",
    loanAmt: "", // Loan amount
    loanTenure: "", // Loan tenure
    assets: "", // Assets valuation
    propertyValue: "", // Only for home loan
    vehicleCost: "", // Only for vehicle loan
  });

  const [response, setResponse] = useState(""); // State to hold the API response
  const [loading, setLoading] = useState(false); // Loading state for async requests

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Apply conditional logic based on the selected loan purpose
    const loanData = [
      formData.loanPurpose, // Loan purpose
      formData.age, // Age
      formData.income, // Annual income
      formData.cibilScore, // Cibil score
      formData.experience, // Employment experience
      formData.loanAmt, // Loan amount
      formData.loanTenure, // Loan tenure
      formData.assets, // Assets valuation
      formData.loanPurpose === "home" ? formData.propertyValue : "", // Property value (for home loan)
      formData.loanPurpose === "vehicle" ? formData.vehicleCost : "", // Vehicle cost (for vehicle loan)
    ];

    // Filter out empty strings (optional)
    const filteredLoanData = loanData.filter((data) => data !== "");

    setLoading(true);
    try {
      // Connect to Gradio API
      const client = await Client.connect("https://8b61258ad1f34ddfdb.gradio.live/");

      // Send the loan data array to the Gradio model
      const result = await client.predict("/predict", {
        prompt: filteredLoanData, // Pass the filtered loan data array to the model
      });

      // Set the response in the state
      setResponse(result.data);
    } catch (error) {
      console.error("Error:", error);
      setResponse("There was an error with the request.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateText = async () => {
    if (!prompt.trim()) return;
  
    setIsGenerating(true);
    try {
      // Constructing the request body with the prompt
      const requestBody = {
        data: [prompt], // Wrap the prompt in an array if required by your API
      };
  
      const response = await fetch("https://52319001eba86f2ee5.gradio.live", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // Make sure the content type is set to JSON
        },
        body: JSON.stringify(requestBody), // Sending the body as a JSON string
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result?.data && result.data[0]) {
        setGeneratedText(result.data[0]);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error generating text:", error);
      setGeneratedText("Sorry, there was an error generating the text.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  

  return (
    <div>
      <h2>Loan Application</h2>

      {/* Loan Purpose Selection */}
      <label>
        Loan Purpose:
        <select
          name="loanPurpose"
          onChange={handleChange}
          value={formData.loanPurpose}
        >
          <option value="">Select Loan Purpose</option>
          <option value="education">Education Loan</option>
          <option value="marriage">Marriage Loan</option>
          <option value="personal">Personal Loan</option>
          <option value="home">Home Loan</option>
          <option value="vehicle">Vehicle Loan</option>
        </select>
      </label>
      <br />

      {/* Common Form Fields */}
      <label>
        Age:
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Annual Income:
        <input
          type="number"
          name="income"
          value={formData.income}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Cibil Score:
        <input
          type="number"
          name="cibilScore"
          value={formData.cibilScore}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Employment Experience (years):
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Loan Amount:
        <input
          type="number"
          name="loanAmt"
          value={formData.loanAmt}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Loan Tenure (years):
        <input
          type="number"
          name="loanTenure"
          value={formData.loanTenure}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Assets Valuation:
        <input
          type="number"
          name="assets"
          value={formData.assets}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      {/* Conditional Input Fields based on Loan Purpose */}
      {formData.loanPurpose === "home" && (
        <label>
          Property Value:
          <input
            type="number"
            name="propertyValue"
            value={formData.propertyValue}
            onChange={handleChange}
            required
          />
        </label>
      )}

      {formData.loanPurpose === "vehicle" && (
        <label>
          Vehicle Cost:
          <input
            type="number"
            name="vehicleCost"
            value={formData.vehicleCost}
            onChange={handleChange}
            required
          />
        </label>
      )}

      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </button>

      {/* Display the Response from the Model */}
      {response && (
        <div style={{ marginTop: "20px" }}>
          <h3>Response from Model:</h3>
          <p>{response}</p>
        </div>
      )}

      {/* Second Section: Generate Custom Text */}
      <div className="w-full max-w-xl mt-10 p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">Generate Custom Text</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg text-lg mb-4"
          />
          <button
            onClick={handleGenerateText}
            disabled={isGenerating}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate Text"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiLoan;
