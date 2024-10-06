"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Background } from './components/Background';
import { useAuth } from './helper/auth_context';
import { HeroOneButton } from './components/HeroOneButton';
import { Section } from './layouts/Section';
import { NavbarTwoColumns } from './components/Navbar';
import { Logo } from './components/Logo';
import { VerticalFeatures } from './components/VerticalFeature';
import { Banner } from './components/banner/Banner';
import { Footer } from './components/Footer';
import Modal from './components/Modal';
import LoginPage from './components/Login';
import RegisterForm from './components/Register';
import './custom.css'

const Hero = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Keluar',
        text: 'Apakah Anda Yakin Akan Keluar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Keluar',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        Swal.fire("Anda Berhasil Keluar!", "", "success");
        await logout();
      }
    } catch (error) {
      console.error('Gagal melakukan Logout', error);
    }
  };

  useEffect(() => {
    
  }, [user]);

  return (
    <>
      <Background color="bg-[url('../images/bg.jpg')] bg-cover">
        <Section yPadding="py-6">
          <NavbarTwoColumns logo={<Logo xl />}>
            {user ? (
              <>
                <li>
                  <Link href="/maps" className='mx-4 text-white hover:text-blue-600'>
                   Map
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="px-2 mx-2 text-white hover:text-blue-600">
                    Keluar
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button onClick={() => setShowLoginModal(true)} className='mx-4 hover:text-blue-600'>Daftar</button>
                </li>
              </>
            )}
          </NavbarTwoColumns>
        </Section>
        {user ? (
          <Section yPadding="pt-20 pb-32">
            <HeroOneButton
              title={
                <>
                  {"Selamat Datang " + user.displayName + " \n"}
                </>
              }
              description="Ayo Mulai Pencarian Pantai di Kabupaten Badung!"
              button={
                <Link href="/maps" className='xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300  px-10 py-2 rounded-md '>
                   Mulai
                </Link>
              }
            />
          </Section>
        ) : (
          <Section yPadding="pt-20 pb-32">
            <HeroOneButton
              title={
                <>
                  {"JELAJAHI LOKASI WISATA PANTAI DI KABUPATEN BADUNG\n"}
                </>
              }
              button={
                <button onClick={() => setShowLoginModal(true)} className='xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 px-10 py-2 rounded-md cursor-pointer'>Mulai</button>
              }
            />
          </Section>
        )}
      </Background>
      <Modal show={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginPage onClose={() => setShowLoginModal(false)} />
      </Modal>

      {/* Modal Register */}
      <Modal show={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
        <RegisterForm onClose={() => setShowRegisterModal(false)} />
      </Modal>
      <VerticalFeatures />
      <Banner user={user} />
      <Footer />
    </>
  );
};

export default Hero;
