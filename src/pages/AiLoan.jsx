import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';

function AiLoan() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const questions = [
    "What's your annual income?",
    "How much loan amount are you looking for?",
    "What is the loan tenure you prefer?",
    "What is your credit score?",
    "Do you have any outstanding loans?",
    "What type of loan do you need? (Personal, Home, Car, etc.)",
    "What is your employment status?",
    "Are you a taxpayer?"
  ];

  const handleAnswer = () => {
    if (currentAnswer.trim() === '') return;
    
    // Store the latest answer properly
    const updatedAnswers = { ...answers, [questions[currentQuestion]]: currentAnswer };
    setAnswers(updatedAnswers);
    setCurrentAnswer('');
  
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
  
      // Simulate AI response (MOCK DATA)
      setTimeout(() => {
        setRecommendations({
          loans: [
            { name: "Personal Loan", percentage: 85 },
            { name: "Home Loan", percentage: 75 }
          ],
          schemes: [
            { name: "Mudra Loan", percentage: 90 },
            { name: "PMAY", percentage: 80 }
          ]
        });
        setIsLoading(false);
      }, 2000); // Simulate 2 sec delay
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnswer();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
      <h2 className="text-4xl font-semibold mb-6">AI Loan Recommendation</h2>
      {!isLoading && !recommendations ? (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">{questions[currentQuestion]}</h3>
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your answer"
            className="py-2 px-4 border border-gray-300 rounded-lg text-xl w-80 mb-6"
          />
          <button
            onClick={handleAnswer}
            className="flex justify-center items-center text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 mt-2"
          >
            <FaArrowRight size={20} />
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">AI Recommendations:</h3>
          <div className="mb-6">
            <h4 className="font-bold">Recommended Loans:</h4>
            {recommendations?.loans?.map((loan, index) => (
              <p key={index} className="text-xl">{loan.name} - {loan.percentage}% match</p>
            ))}
          </div>
          <div>
            <h4 className="font-bold">Matching Government Schemes:</h4>
            {recommendations?.schemes?.map((scheme, index) => (
              <p key={index} className="text-xl">{scheme.name} - {scheme.percentage}% match</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AiLoan;
