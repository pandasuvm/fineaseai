import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Client } from "@gradio/client";
import GradioComponent from "../components/GradioComponent";


const AiLoan = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const questions = [
    "What's your annual income?",
    "How much loan amount are you looking for?",
    "What is the loan tenure you prefer?",
    "What is your credit score?",
    "Do you have any outstanding loans?",
    "What type of loan do you need? (Personal, Home, Car, etc.)",
    "What is your employment status?",
    "Are you a taxpayer?",
  ];

  const handleAnswer = () => {
    if (currentAnswer.trim() === "") return;

    const updatedAnswers = { ...answers, [questions[currentQuestion]]: currentAnswer };
    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      generateLoanRecommendation(updatedAnswers);
    }
  };

  const generateLoanRecommendation = async (answers) => {
    const prompt = `Based on the following information, suggest loan options:
      Annual Income: ${answers[questions[0]]}
      Loan Amount: ${answers[questions[1]]}
      Tenure: ${answers[questions[2]]}
      Credit Score: ${answers[questions[3]]}
      Outstanding Loans: ${answers[questions[4]]}
      Loan Type: ${answers[questions[5]]}
      Employment: ${answers[questions[6]]}
      Taxpayer: ${answers[questions[7]]}`;

    try {
      const response = await fetch("https://your-gradio-url-here", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [prompt],
        }),
      });
      
      const result = await response.json();
      const generatedRecommendation = result.data[0];

      setRecommendations({
        loans: [
          { name: "Personal Loan", percentage: 85 },
          { name: "Home Loan", percentage: 75 },
        ],
        schemes: [
          { name: "Mudra Loan", percentage: 90 },
          { name: "PMAY", percentage: 80 },
        ],
      });

      setGeneratedText(generatedRecommendation);
    } catch (error) {
      console.error("Error generating recommendation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAnswer();
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
      <h2 className="text-4xl font-semibold mb-6">AI Loan Recommendation</h2>
      <GradioComponent/>

      {/* First Section: Asking Questions */}
      {!isLoading && !recommendations ? (
        <div className="w-full max-w-xl p-6 bg-white shadow-lg rounded-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{questions[currentQuestion]}</h3>
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your answer"
              className="py-2 px-4 border border-gray-300 rounded-lg text-xl w-full mb-6"
            />
            <button
              onClick={handleAnswer}
              className="flex justify-center items-center text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 mt-2 mx-auto"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p>Generating recommendations...</p>
        </div>
      ) : (
        <div className="w-full max-w-xl p-6 bg-white shadow-lg rounded-lg">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">AI Recommendations:</h3>
            <div className="mb-6">
              <h4 className="font-bold">Recommended Loans:</h4>
              {recommendations?.loans?.map((loan, index) => (
                <p key={index} className="text-xl">
                  {loan.name} - {loan.percentage}% match
                </p>
              ))}
            </div>
            <div className="mb-6">
              <h4 className="font-bold">Matching Government Schemes:</h4>
              {recommendations?.schemes?.map((scheme, index) => (
                <p key={index} className="text-xl">
                  {scheme.name} - {scheme.percentage}% match
                </p>
              ))}
            </div>
            <div className="mt-6">
              <h4 className="font-bold">AI Generated Recommendation:</h4>
              <p className="text-lg mt-2">{generatedText}</p>
            </div>
          </div>
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
