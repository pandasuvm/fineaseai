import React, { useState } from "react";

const faqs = [
  {
    question: "How can I contact support?",
    answer: "You can reach our support team via email at support@example.com or call us at +1234567890."
  },
  {
    question: "What are your support hours?",
    answer: "Our support team is available 24/7 to assist you with any issues."
  },
  {
    question: "How long does it take to get a response?",
    answer: "We typically respond within 24 hours. Urgent queries are prioritized."
  },
  {
    question: "Do you offer live chat support?",
    answer: "Yes, live chat support is available from 9 AM to 6 PM (IST)."
  }
];

const Support = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-10 px-4">
      <h1 className="text-5xl font-bold mb-6 text-white">Support</h1>
      <p className="text-lg text-gray-300 mb-8">If you need help, please contact our support team.</p>

      <div className="w-full max-w-3xl">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full text-left px-4 py-3 bg-white/10 backdrop-blur-lg border-2 border-gray-600 rounded-lg text-white font-semibold flex justify-between items-center ${openIndex === index ? 'border-b-0' : ''}`}
            >
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <div className="px-4 py-3 bg-white text-gray-800 border-t">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
