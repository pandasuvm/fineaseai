import React from 'react';
import { LogOut, Bell } from 'lucide-react'; // Icons from lucide-react
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { confirmAlert } from 'react-confirm-alert'; // For confirmation dialog
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import styles for the confirmation dialog

const Navbar = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleLogoutWithConfirmation = () => {
    confirmAlert({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          label: 'Yes',
          onClick: handleLogout,
        },
        {
          label: 'No',
          onClick: () => console.log('Logout cancelled'),
        },
      ],
    });
  };

  return (
    <nav className="navbar bg-[#111111] h-full p-4 flex justify-between border-b border-gray-700 items-center shadow-lg z-10 sticky top-0 w-full">
      <div className="font-bold text-2xl ml-3 font-wider text-gray-200">Fin<span className='text-[#C4FC82]'>Ease</span></div>
      <div className="flex items-center gap-4">
        <Bell 
          className="w-6 h-6 text-gray-200 cursor-pointer hover:text-black" 
          onClick={() => navigate('/notifications')} 
        />
        <LogOut 
          className="w-6 h-6 text-gray-200 cursor-pointer hover:text-black" 
          onClick={handleLogoutWithConfirmation} 
        />
      </div>
    </nav>
  );
};

export default Navbar;
