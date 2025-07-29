import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../common/ThemeToggle";

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-neutral-800 shadow-sm dark:shadow-neutral-800/20 z-10 md:hidden">
        <div className="h-full px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center">
              <span className="text-white font-playwrite font-bold">M</span>
            </div>
            <h1 className="text-xl font-playwrite font-bold text-neutral-800 dark:text-white">
              MindJournal
            </h1>
          </Link>

          <div className="flex items-center space-x-2">
            <ThemeToggle />

            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && <MobileMenu onClose={toggleMenu} />}
    </>
  );
};

export default MobileHeader;
