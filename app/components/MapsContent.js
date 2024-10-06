import React, { useState } from "react";
import Link from "next/link";
import { Background } from "./Background";
import { NavbarTwoColumns } from "./Navbar";
import { Logo } from "./Logo";
import { Section } from "./Section";
import { FaSearch } from "react-icons/fa";

const MapsContent = () => {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  // Function to close search sidebar
  const closeSearch = () => {
    setShowSearch(false);
  };

  return (
    <Background color="bg-gradient-to-b from-blue-400 to-blue-900">
      <Section yPadding="py-6">
        <NavbarTwoColumns logo={<Logo xl />}>
          <li>
            <Link href="" className="mx-4 text-white">
              About
            </Link>
          </li>
          <li>
            <button onClick={toggleSearch} className="mx-4 text-white">
              Search
            </button>
          </li>
        </NavbarTwoColumns>
      </Section>

      <Section yPadding="pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            The modern landing page for
          </h1>
          <p className="text-lg text-white mb-8">
            The easiest way to build a React landing page in seconds.
          </p>
          <Link href="">
            {/* <Button size="xl" color="blue">
              Get Started
            </Button> */}
          </Link>
        </div>
      </Section>

      {showSearch && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 bg-blue-900 bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeSearch}
        >
          <div className="bg-white p-8 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              Search Nearby Locations
            </h2>
            {/* Your search form components can go here */}
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter your location"
                className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-500 text-white rounded-r-lg px-4 py-2 flex items-center">
                <FaSearch className="mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </Background>
  );
};

export default MapsContent;
