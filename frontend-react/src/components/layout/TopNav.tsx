import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from '../../components/ThemeSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-stone-700 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className={`text-2xl font-bold ${isScrolled ? 'text-green-800' : 'text-blue-600'}`}>
          <img src="../worldglobe.svg" alt="world logo" className='h-16 w-16' />
          </div>
        <ul className={`hidden md:flex space-x-6 ${isScrolled ? 'text-white' : 'text-green-500'}`}>
          <Link className="hover:text-blue-500 cursor-pointer" to="/">Home</Link>
          <Link className="hover:text-blue-500 cursor-pointer" to="/countries">Country</Link>
          <Link className="hover:text-blue-500 cursor-pointer" to="/cities">Cities</Link>
          <Link className="hover:text-blue-500 cursor-pointer" to="/country-languages">Country Languages</Link>
          <ThemeSwitcher />
        </ul>
      </div>
    </nav>
  );
}
