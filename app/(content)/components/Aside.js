"use client";
import React, { useEffect, useState } from "react";
import { Logo } from "@/app/components/Logo";
import { NavbarTwoColumns } from "@/app/components/Navbar";
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useAuth } from '../../helper/auth_context';
import Link from 'next/link';
import { useRouter,useSearchParams } from 'next/navigation'
import "../../direction.css";

const Sidebar = () => {
  const [city, setCity] = useState('Loading...');
  const [weather, setWeather] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const geocodingClient = mbxGeocoding({ accessToken: process.env.NEXT_PUBLIC_MAPS_TOKEN });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  const [activeButton, setActiveButton] = useState(null);

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Keluar',
        text: 'Apakah Anda Yakin Akan Keluar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Keluar',
        cancelButtonText: 'Batal',
        customClass: {
          confirmButton: 'btn-confirm',
          cancelButton: 'btn-cancel'
        },
        buttonsStyling: false
      });

      if (result.isConfirmed) {
        Swal.fire("Anda Berhasil Keluar!", "", "success");
        router.push('/');
        await logout();
      }
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await geocodingClient.reverseGeocode({
            query: [longitude,latitude],
            limit: 1
          }).send();
          const place = response.body.features[0];
          const locality = place.context.find(c => c.id.includes('place'));
          const cityName = locality ? locality.text : 'Unknown Location';
          setCity(cityName);

          // Fetch weather data
          if (cityName !== 'Unknown Location') {
            try {
              const weatherResponse = await axios.get(`https://api.collectapi.com/weather/getWeather?data.lang=id&data.city=${cityName}`, {
                headers: {
                  authorization: `apikey 2LAYSVC3lp9gMmOn6ilbCX:7tjNXsXpYRUxxuBtCpsogX`
                }
              });
              const weatherData = weatherResponse.data.result[0];
              setWeather(weatherData);
            } catch (weatherError) {
              console.error('Error fetching weather data', weatherError);
              setWeather(null);
            }
          }
        } catch (error) {
          console.error('Error retrieving location', error);
          setCity(null);
        }
      });
    } else {
      setCity('Geolocation not supported');
    }

    const updateActiveButton = () => {
      const all = searchParams.get('all');
      const findNearest = searchParams.get('findNearest');
      const kecamatan = searchParams.get('kecamatan');


      if (all) {
        setActiveButton('all');
        setIsSidebarOpen(!isSidebarOpen)
      } else if (findNearest) {
        setActiveButton('findNearest');
        setIsSidebarOpen(!isSidebarOpen)
      } else if (kecamatan) {
        setActiveButton(kecamatan);
        setIsSidebarOpen(!isSidebarOpen)
      } else {
        setActiveButton(null);
      }
    };

    updateActiveButton();
  }, [searchParams]);

  return (
    <div className="flex flex-col md:min-h-screen h-full overflow-y-auto bg-gray-600">
      <div className="md:hidden bg-gray-600 p-4 fixed top-0 left-0 right-0 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} size="x" />
        </button>
      </div>
      <div className={`bg-gray-600 w-full h-screen md:w-64 p-4 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative fixed top-0 left-0 transition-transform duration-300 ease-in-out z-40 overflow-y-auto`}>
        <div className="md:mt-0 mt-16">
          <Logo md/>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex items-center mt-3 gap-4 text-lg ml-2">
            <FontAwesomeIcon icon={faLocationDot} className="text-blue-500 "/> 
            <p className="text-white">{city}</p>
          </div>
          {weather && (
            <div className="flex items-center mt-3 text-white">
                <img
                  src={weather.icon}
                  alt={weather.icon}
                  className="w-10 h-10 mr-2"
                />
              <p> {weather.description} ({weather.degree}°C)</p>
            </div>
          )}
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex flex-col mt-4">
            <Link href="/maps?all=true" 
            className={`mt-2 text-center w-full px-2 py-2 rounded-lg bg-[#4285F4]  text-white hover:bg-blue-700 transition-all duration-300 focus:outline-none  ${activeButton === 'all' ? 'bg-blue-700 ' : 'bg-[#4285F4]'}`}>
              Cari Semua Pantai
            </Link>
          </div>
          <div className="flex flex-col mt-3">
            <Link href="/maps?findNearest=true" className={`mt-2 text-center w-full rounded-lg bg-[#4285F4] px-2 py-2 text-white hover:bg-blue-700 transition-all duration-300 focus:outline-none  ${activeButton === 'findNearest' ? 'bg-blue-700' : 'bg-[#4285F4]'}`}>
              Cari Lokasi Terdekat Anda
            </Link>
          </div>
          <div className="flex flex-col mt-3 gap-3">
            <Link href="/maps?kecamatan=kuta utara" className={`mt-2 text-center w-full rounded-lg bg-[#4285F4] px-2 py-2 text-white hover:bg-blue-700 transition-all duration-300 focus:outline-none  ${activeButton === 'kuta utara' ? 'bg-blue-700' : 'bg-[#4285F4]'}`}>
              Kuta Utara
            </Link>
            <Link href="/maps?kecamatan=kuta" className={`mt-2 text-center w-full rounded-lg bg-[#4285F4] px-2 py-2 text-white hover:bg-blue-700 transition-all duration-300 focus:outline-none  ${activeButton === 'kuta' ? 'bg-blue-700' : 'bg-[#4285F4]'}`}>
              Kuta 
            </Link>
            <Link href="/maps?kecamatan=kuta selatan" className={`mt-2 text-center w-full rounded-lg bg-[#4285F4] px-2 py-2 text-white hover:bg-[#1967D2] transition-all duration-300 focus:outline-none  ${activeButton === 'kuta selatan' ? 'bg-blue-700' : 'bg-[#4285F4]'}`}>
              Kuta Selatan
            </Link>
            <Link href="/maps?kecamatan=mengwi" className={`mt-2 text-center w-full rounded-lg bg-[#4285F4] px-2 py-2 text-white hover:bg-blue-700 transition-all duration-300 focus:outline-none  ${activeButton === 'mengwi' ? 'bg-blue-700' : 'bg-[#4285F4]'}`}>
              Mengwi
            </Link>
            <Link href="/maps?kecamatan=abiansemal" className={`mt-2 text-center w-full rounded-lg bg-[#4285F4] px-2 py-2 text-white hover:bg-blue-700 transition-all duration-300 focus:outline-none  ${activeButton === 'abiansemal' ? 'bg-blue-700' : 'bg-[#4285F4]'}`}>
              Abiansemal
            </Link>
            <Link href="/maps?kecamatan=petang" className={`mt-2 text-center w-full rounded-lg bg-[#4285F4] px-2 py-2 text-white hover:bg-blue-700 transition-all duration-300 focus:outline-none ${activeButton === 'petang' ? 'bg-blue-700' : 'bg-[#4285F4]'}`}>
              Petang
            </Link>
            <Link href="" onClick={handleLogout} className="mt-2 text-center w-full rounded-lg bg-[#EA4D46] px-2 py-2 text-white hover:bg-[#EB3931] focus:outline-none focus:ring-2 focus:ring-[#EB0B01] transition-all duration-300">
                    Keluar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;