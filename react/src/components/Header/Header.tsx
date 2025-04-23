import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/authService';
import { useLocation as useLocationService } from '../../services/location/locationService';
import { useProfile } from '../../services/profile/profileService';
import { DashboardIcon, GiftIcon, HistoryIcon, HotelIcon, CasinoIcon, OpenInNewIcon } from '../Icons';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [logoError, setLogoError] = useState(false);
  // const { selectedLocation } = useLocationService();
  const { profile } = useProfile();

  const handleExternalLink = (path: string) => {
    window.open(path, '_blank');
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white text-gray-900 border-b border-gray-200 p-5 w-full z-50 fixed top-0 shadow-sm">
      <nav className="flex justify-center items-center h-[70px]">
        <div className="w-[1440px] flex items-center mx-auto px-5">
          {/* Left Section - Logo */}
          <div className="flex-[0_0_15%] flex items-center">
            {logoError ? (
              <div 
                className="w-[75px] h-10 bg-gray-50 rounded flex items-center justify-center font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => navigate('/')}
              >
                BCLC
              </div>
            ) : (
              <img 
                src="/assets/bclc-logo.png" 
                alt="BCLC Logo"
                className="w-[75px] h-auto cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
                onError={handleLogoError}
              />
            )}
          </div>
          
          {/* Middle Section - Navigation */}
          <div className="flex-[0_0_55%] flex items-center">
            <div className="flex items-center justify-center text-center">
              <div 
                className={`flex flex-col items-center justify-end gap-1 px-6 py-2 cursor-pointer border-b-2 border-white transition-all ${
                  location.pathname === '/dashboard' 
                    ? 'bg-orange-50 border-b-3 border-orange-500 text-orange-500' 
                    : 'hover:bg-orange-50 hover:border-b-3 hover:border-orange-500 hover:text-orange-500'
                }`}
                onClick={() => navigate('/dashboard')}
              >
                <DashboardIcon />
                <label className="cursor-pointer text-sm text-gray-500 transition-colors">
                  Dashboard
                </label>
              </div>
              
              <div 
                className={`flex flex-col items-center justify-end gap-1 px-6 py-2 cursor-pointer border-b-2 border-white transition-all ${
                  location.pathname === '/rewards' 
                    ? 'bg-orange-50 border-b-3 border-orange-500 text-orange-500' 
                    : 'hover:bg-orange-50 hover:border-b-3 hover:border-orange-500 hover:text-orange-500'
                }`}
                onClick={() => navigate('/rewards')}
              >
                <GiftIcon />
                <label className="cursor-pointer text-sm text-gray-500 transition-colors">
                  Rewards
                </label>
              </div>
              
              <div 
                className={`flex flex-col items-center justify-end gap-1 px-6 py-2 cursor-pointer border-b-2 border-white transition-all ${
                  location.pathname === '/purchase-history' 
                    ? 'bg-orange-50 border-b-3 border-orange-500 text-orange-500' 
                    : 'hover:bg-orange-50 hover:border-b-3 hover:border-orange-500 hover:text-orange-500'
                }`}
                onClick={() => navigate('/purchase-history')}
              >
                <HistoryIcon />
                <label className="cursor-pointer text-sm text-gray-500 transition-colors">
                  Activity History
                </label>
              </div>
              
              <div 
                className="flex flex-col items-center justify-end gap-1 px-6 py-2 cursor-pointer border-b-2 border-white transition-all hover:bg-orange-50 hover:border-b-3 hover:border-orange-500 hover:text-orange-500"
                onClick={() => handleExternalLink('/hotel-booking')}
              >
                <HotelIcon />
                <label className="cursor-pointer text-sm text-gray-500 transition-colors">
                  Hotel Booking <OpenInNewIcon className="text-xs w-3 h-3 align-middle text-gray-500" />
                </label>
              </div>
              
              <div 
                className="flex flex-col items-center justify-end gap-1 px-6 py-2 cursor-pointer border-b-2 border-white transition-all hover:bg-orange-50 hover:border-b-3 hover:border-orange-500 hover:text-orange-500"
                onClick={() => handleExternalLink('/casino')}
              >
                <CasinoIcon />
                <label className="cursor-pointer text-sm text-gray-500 transition-colors">
                  Casino <OpenInNewIcon className="text-xs w-3 h-3 align-middle text-gray-500" />
                </label>
              </div>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex-[0_0_30%]">
            <div className="flex justify-between items-center gap-10">
              {/* Location and Profile components will be added here */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}; 