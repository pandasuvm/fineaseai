import React, { useState } from "react";

const GradioComponent = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputPrompt) {
      return;
    }

    setLoading(true);  // Set loading state while waiting for the result
    try {
      // Make the API call to the Gradio endpoint
      const response = await fetch("https://8b61258ad1f34ddfdb.gradio.live/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputPrompt }),  // Send the prompt as the request body
      });

      // Parse the response and update the state with the result
      const data = await response.json();
      setOutput(data.data);  // Assuming `data.data` contains the model's response
    } catch (error) {
      console.error("Error fetching from Gradio:", error);
      setOutput("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradio-model-container">
      <h2>Gradio Model Integration</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Type your prompt here"
          rows="4"
          cols="50"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      <div>
        <h3>Model Output:</h3>
        <p>{output}</p>
      </div>
    </div>
  );
};

export default GradioComponent;
