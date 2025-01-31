import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import routing components
import Sidebar from './pages/Sidebar'; // Assuming Sidebar component is in the same directory
import Dashboard from './pages/Dashboard'; // Import Dashboard component
import LoanTracker from './pages/LoanTracker'; // Import LoanTracker component
import AiLoan from './pages/AiLoan'; // Import AiLoan component
import Expenses from './pages/Expenses'; // Import Expenses component
import Support from './pages/Support'; // Import Support component

const App = () => {
  const [selected, setSelected] = useState('/dashboard'); // Default selected sidebar option

  return (
    <Router>
      <div className="flex">
        <Sidebar selected={selected} setSelected={setSelected} /> {/* Render the sidebar */}
        <div className="main-content flex-grow p-4">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/loan-tracker" element={<LoanTracker />} />
            <Route path="/ai-loan" element={<AiLoan />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/support" element={<Support />} />
            {/* Add a default route or a fallback route if needed */}
            <Route path="*" element={<Dashboard />} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;