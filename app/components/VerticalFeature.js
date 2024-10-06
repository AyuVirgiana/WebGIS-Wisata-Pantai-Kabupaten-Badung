import React, { useState } from 'react';
import { VerticalFeatureRow } from './feature/VerticalFeatureRow';
import { Section } from './Section';
import { useAuth } from '../helper/auth_context'; 
import Modal from '../components/Modal';
import LoginPage from '../components/Login';

const VerticalFeatures = () => {
  const { user } = useAuth(); 
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleStartClick = () => {
    if (user) {
      window.location.href = '/maps'; 
    } else {
      setShowLoginModal(true); 
    }
  };

  return (
    <>
      <Section
        title="Apa Itu Go-Beach??"
        description="Go-beach merupakan sebuah aplikasi map interaktif yang memberikan informasi terperinci terkait wisata pantai di Kabupaten Badung, mulai dari lokasi, rute, deskripsi pantai, fasilitas, galeri, prakiraan cuaca yang membantu Anda merencanakan perjalanan wisata Anda."
      >
        <VerticalFeatureRow
          type="default"
          title="Informasi Terperinci"
          description={
            <>
              Pernahkah Anda kesulitan mendapatkan informasi fasilitas dari wisata pantai karena sumber-sumber online yang Anda kunjungi tidak menampilkan informasi fasilitas secara khusus? 
              <br /><br />
              Pernahkah Anda merasa penat karena scrolling ulasan pengguna untuk mendapatkan informasi fasilitas di suatu wisata pantai?
              <br /><br />
              Go-beach hadir untuk membantu Anda!
              {/* Button Coba Sekarang */}
              <div className="text-center mt-7">
                <button
                  onClick={handleStartClick}
                  className='xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 px-10 py-2 rounded-md cursor-pointer'
                >
                  Coba Sekarang
                </button>
              </div>
            </>
          }
          image="mockup.png"
          imageAlt="Go-beach Mockup"
        />
        <VerticalFeatureRow
          type="multi-row"
          row1={[
            { image: "icon-signin", title: "Login Mudah", description: "Login Mudah dan cepat dengan akun Google Anda." },
            { image: "icon-map", title: "Map Interaktif", description: "Menampilkan map yang interaktif." },
            { image: "icon-location", title: "Deteksi Lokasi Pengguna", description: "Mendeteksi lokasi terkini Anda." },
          ]}
          row2={[
            { image: "icon-compass", title: "Rekomendasi Terdekat", description: "Merekomendasikan wisata pantai di Kabupaten Badung yang terdekat dari lokasi Anda." },
            { image: "icon-search", title: "Menu Pencarian", description: "Anda dapat menggunakan kotak pencarian, menu untuk menampilkan semua pantai, serta menu pencarian berdasarkan kecamatan di Kabupaten Badung." },
          ]}
          row3={[
            { image: "icon-route", title: "Rute", description: "Informasi jarak, waktu tempuh, dan rute berdasarkan kemacetan (traffic), kendaraan bermotor (driving), sepeda (cycling), pejalan kaki (walking)." },
            { image: "icon-weather", title: "Informasi Cuaca", description: "Memberikan informasi prakiraan cuaca di lokasi Anda dan wisata pantai yang ingin Anda kunjungi." },
          ]}
        />
      </Section>
      <Modal show={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginPage onClose={() => setShowLoginModal(false)} />
      </Modal>
    </>
  );
};

export { VerticalFeatures };
