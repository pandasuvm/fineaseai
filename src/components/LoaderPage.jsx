import React, { useState, useEffect } from 'react';
import HashLoader from 'react-spinners/HashLoader'; // Import the HashLoader component

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching or some async task
    setTimeout(() => {
      setLoading(false); // Hide the loader after 3 seconds
    }, 4000);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      {loading ? (
        <HashLoader color="#36d7b7" size={50} />
      ) : (
        <div className="text-center text-2xl font-bold">Content Loaded!</div>
      )}
    </div>
  );
};

export default Loader;
