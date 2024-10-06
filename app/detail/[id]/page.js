"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { firestore } from '../../config/firebase_config';
import { doc, getDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../../helper/auth_context";
import Swal from 'sweetalert2';

const DetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const showNextImage = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % data?.properties?.galery?.length);
  };

  const showPreviousImage = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + data?.properties?.galery?.length) % data?.properties?.galery?.length);
  };

  const getDataById = async (id) => {
    try {
      const docRef = doc(firestore, 'wisata_pantai', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  };

  useEffect(() => {
    if (params.id) {
      const fetchData = async () => {
        const data = await getDataById(params.id);
        setData(data);
      };

      fetchData();
    }
  }, [params.id]);


  useEffect(() => {
    if (!loading && !user) {
      Swal.fire({
        icon: 'error',
        title: 'Belum Login',
        text: 'Pastikan Anda Login',
        confirmButtonText: 'oke'
      });
      router.push('/');
    }
  }, [loading, user, router]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (!data) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const selectedImage = selectedIndex !== null ? data.properties.galery[selectedIndex] : null;
  return (
    <div className="container mx-auto p-5">
      <nav className="bg-blue-600 shadow-md py-4 px-6 flex justify-between items-center w-full fixed top-0 left-0 right-0 z-10">
        <a className="text-2xl font-bold text-white" href="/">
          {data.properties.name}
        </a>
        <div className="flex space-x-4">
          <a href="/" className="text-white hover:text-gray-200">Home</a>
          <a href="/maps" className="text-white hover:text-gray-200">Maps</a>
        </div>
      </nav>

      <div className="pt-24">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{data.properties.name}</h1>
          <p className="text-gray-800 flex justify-center items-center mb-2">
            <FontAwesomeIcon icon={faLocationDot} className="text-blue-500 text-lg md:text-xl mr-1 md:mr-2"/>
            {data.properties.alamat}
          </p>
          <p className="text-gray-800 flex justify-center items-center">
            <FontAwesomeIcon icon={faStar} className="text-yellow-300 text-lg md:text-xl mr-1 md:mr-2"/>
            {data.properties.rating}
          </p>
        </div>

        <div className="mb-8 md:mb-32">
          <div className="flex justify-center md:px-24 px-6">
            <div className="w-full">
              <img className=" md-full w-full object-cover" src={data.properties.image_tumb} alt={data.properties.name} />
            </div>
          </div>
        </div>

        <section className='mb-8 md:mb-32'>
          <h2 className="font-bold text-xl md:text-2xl text-center text-gray-800 mb-6">Deskripsi</h2>
          <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-4">
            <section className="flex-1 bg-white overflow-hidden p-4 md:p-6 text-gray-800 text-justify mx-2 md:mx-20">
              <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: data.properties.deskripsi }} />
            </section>
          </div>
        </section>

        <section className='mb-32'>
          <h2 className="font-bold text-2xl text-center text-gray-800 mb-10">Fasilitas</h2>
          <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-8 justify-center">
            <section className="flex-1 bg-white overflow-hidden p-6 text-gray-800 text-justify mx-4 md:mx-20">
              <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2 p-4">
                {data.properties.fasilitas.map((item, index) => (
                  <div key={index} className="p-2 sm:w-1/2 w-full">
                    <div className="bg-white rounded flex p-4 h-full items-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        className="text-blue-600 w-6 h-6 flex-shrink-0 mr-4 md:mr-6"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                      <span className="font-medium text-sm md:text-base">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-xl md:text-2xl text-center text-gray-800 mb-4 md:mb-8">Galeri</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-6 xl:gap-8 mx-2 md:mx-20 mt-4">
            {data.properties.galery.map((item, index) => (
              <a
                key={index}
                className="group relative flex h-36 sm:h-48 md:h-64 items-end overflow-hidden bg-gray-100 shadow-lg cursor-pointer"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={item.url}
                  loading="lazy"
                  alt={item.alt || "Gallery Image"}
                  className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
              </a>
            ))}
          </div>

          {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-3">
              <div className="bg-white p-2 pb-12 md:p-4 md:pb-14 rounded-lg max-w-full md:max-w-3xl w-full relative md:h-4/6 h-3/6" >
                <button
                  className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white p-1 rounded-full"
                  onClick={closeModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt || "Detail Image"}
                  className="w-full h-full object-cover"
                />
                {selectedImage.alt && (
                  <p className="mt-2 text-center text-gray-700 md:text-sm text-xs h-fit">{selectedImage.alt}</p>
                )}
                <button
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-full"
                  onClick={showPreviousImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800  hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-full"
                  onClick={showNextImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DetailPage;
