'use client';
import { useState } from 'react';
import Link from 'next/link';

const NavbarTwoColumns = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-4 ">
      <div className="flex-shrink-0">
        {typeof props.logo === 'string' ? (
          <Link href="/">{props.logo}</Link>
        ) : (
          props.logo
        )}
      </div>
      <div className="block md:hidden">
        <button
          onClick={toggleMenu}
          className="flex items-center px-3 py-2 border rounded text-white border-white hover:text-blue-400 hover:border-blue-400"
        >
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <nav className={`w-full block md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'} mt-4 lg:mt-0`}>
        <ul className="navbar flex flex-col md:flex-row md:items-center md:ml-auto text-xl font-medium text-white ml-auto">
          {props.children}
        </ul>
      </nav>

      <style jsx>
        {`
          .navbar :global(li:not(:first-child)) {
            @apply mt-4 lg:mt-0;
          }

          .navbar :global(li:not(:last-child)) {
            @apply lg:mr-5;
          }
        `}
      </style>
    </div>
  );
};

export { NavbarTwoColumns };
