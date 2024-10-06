import React, { useState } from 'react';
import Link from 'next/link';
import { Section } from '../Section';
import { useAuth } from '../../helper/auth_context'; // Import useAuth for checking login status
import Modal from '../Modal';
import LoginPage from '../Login';

const Banner = () => {
  const { user } = useAuth(); // Use auth context to get user status
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGetStartedClick = () => {
    if (user) {
      window.location.href = '/maps'; // Redirect to /maps if user is logged in
    } else {
      setShowLoginModal(true); // Show login modal if user is not logged in
    }
  };

  return (
    <>
      {user ? (
        <Section>
          <div className="relative flex items-center justify-center h-96 bg-cover bg-center" style={{ backgroundImage: 'url(background.jpg)' }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 text-center text-white">
              <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Temukan Tujuan Wisata Pantai di Kabupaten Badung</h1>
              <p className="mt-4 text-lg md:text-xl lg:text-2xl">Mulai pencarian pantai Anda dengan Go-Beach dan nikmati pengalaman wisata yang luar biasa!</p>
              <Link href="/maps" className='inline-block mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300'>
                Maps
              </Link>
            </div>
          </div>
        </Section>
      ) : (
        <Section>
          <div className="relative flex items-center justify-center h-96 bg-cover bg-center" style={{ backgroundImage: 'url(background.jpg)' }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 text-center text-white">
              <h1 className="text-4xl font-bold md:text-5xl lg:text-4xl">Temukan Tujuan Wisata Pantai di Kabupaten Badung</h1>
              <p className="mt-4 text-lg md:text-xl lg:text-xl">Mulai pencarian pantai Anda dengan Go-Beach dan nikmati pengalaman wisata yang luar biasa!</p>
              <button onClick={handleGetStartedClick} className='inline-block mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300'>
                Mulai Sekarang
              </button>
            </div>
          </div>
        </Section>
      )}
      <Modal show={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginPage onClose={() => setShowLoginModal(false)} />
      </Modal>
    </>
  );
};

export { Banner };
