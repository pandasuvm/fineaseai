import React from 'react';
import { LayoutDashboard, FileText, Cpu, DollarSign, HelpCircle } from 'lucide-react'; // Import specific icons
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation from react-router-dom

const Sidebar = ({ selected, setSelected }) => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/') {
      setSelected('/dashboard');
    } else {
      setSelected(location.pathname);
    }
  }, [location.pathname, setSelected]);

  return (
    <div className="sidebar w-64 bg-black text-[#5D6679] font-primary font-medium mt-4 min-h-[100vh] border-r border-gray-700 h-auto font-custom">
      <ul className="list-none p-0">
        <li
          className={`flex items-center p-3 rounded-xl cursor-pointer ml-3 mr-3 mb-3 ${
            selected === '/dashboard' ? 'bg-[#232223] text-white' : ''
          }`}
          onClick={() => setSelected('/dashboard')}
        >
          <Link to="/dashboard" className="flex items-center w-full">
            <LayoutDashboard className="size-6" />
            <span className="sidebar-text ml-2">Dashboard</span>
          </Link>
        </li>
        <li
          className={`flex items-center p-3 rounded-xl cursor-pointer ml-3 mr-3 mb-3 ${
            selected === '/loan-tracker' ? 'bg-[#232223] text-white' : ''
          }`}
          onClick={() => setSelected('/loan-tracker')}
        >
          <Link to="/loan-tracker" className="flex items-center w-full">
            <FileText className="size-6" />
            <span className="sidebar-text ml-2">Loan Tracker</span>
          </Link>
        </li>
        <li
          className={`flex items-center p-3 rounded-xl cursor-pointer ml-3 mr-3 mb-3 ${
            selected === '/ai-loan' ? 'bg-[#232223] text-white' : ''
          }`}
          onClick={() => setSelected('/ai-loan')}
        >
          <Link to="/ai-loan" className="flex items-center w-full">
            <Cpu className="size-6" />
            <span className="sidebar-text ml-2">AI Loan</span>
          </Link>
        </li>
        <li
          className={`flex items-center p-3 rounded-xl cursor-pointer ml-3 mr-3 mb-3 ${
            selected === '/expenses' ? 'bg-[#232223] text-white' : ''
          }`}
          onClick={() => setSelected('/expenses')}
        >
          <Link to="/expenses" className="flex items-center w-full">
            <DollarSign className="size-6" />
            <span className="sidebar-text ml-2">Expenses</span>
          </Link>
        </li>
        <li
          className={`flex items-center p-3 rounded-xl cursor-pointer ml-3 mr-3 mb-3 ${
            selected === '/support' ? 'bg-[#232223] text-white' : ''
          }`}
          onClick={() => setSelected('/support')}
        >
          <Link to="/support" className="flex items-center w-full">
            <HelpCircle className="size-6" />
            <span className="sidebar-text ml-2">Support</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;