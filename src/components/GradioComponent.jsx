import React, { useState, useEffect } from "react";
import { Client } from "@gradio/client";

const GradioComponent = () => {
  // State to manage the result and loading state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to connect to Gradio and make the prediction
  const fetchGradioPrediction = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      const client = await Client.connect("https://dfb6888cdaba183b72.gradio.live/");

      const response = await client.predict("/predict", {
        prompt: "Hello!!", // Adjust this as per your requirement
      });

      setResult(response.data); // Set the result in state
    } catch (err) {
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchGradioPrediction when the component is mounted
  useEffect(() => {
    fetchGradioPrediction();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
      <h2 className="text-4xl font-semibold mb-6">Gradio Prediction</h2>

      {/* Display loading state */}
      {loading && <p>Loading...</p>}

      {/* Display error if there is one */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display result if available */}
      {result && (
        <div className="w-full max-w-xl p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">Gradio Prediction Result:</h3>
          <p className="text-lg">{result}</p>
        </div>
      )}
    </div>
  );
};

export default GradioComponent;
