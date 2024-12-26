import { Outlet } from '@remix-run/react';
import { useState } from 'react';
import Navbar from '~/components/Navbar';
import Footer from '../components/Footer';
import { useDarkMode } from '~/context/DarkModeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
      />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}