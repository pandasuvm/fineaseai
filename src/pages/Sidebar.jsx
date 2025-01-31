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
    <div className="sidebar w-64 bg-white text-[#5D6679] font-primary font-medium mt-4 h-full min-h-[100vh] font-custom">
      <ul className="list-none p-0">
        <li
          className={`flex items-center p-3 rounded-xl cursor-pointer ml-3 mr-3 mb-3 ${
            selected === '/dashboard' ? 'bg-[#D5D6E9] text-[#605ED8]' : ''
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
            selected === '/loan-tracker' ? 'bg-[#D5D6E9] text-[#605ED8]' : ''
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
            selected === '/ai-loan' ? 'bg-[#D5D6E9] text-[#605ED8]' : ''
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
            selected === '/expenses' ? 'bg-[#D5D6E9] text-[#605ED8]' : ''
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
            selected === '/support' ? 'bg-[#D5D6E9] text-[#605ED8]' : ''
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