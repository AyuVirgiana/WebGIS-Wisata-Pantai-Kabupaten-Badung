import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase_config';
import Swal from 'sweetalert2';

const LoginPage = ({ onClose }) => {

  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: 'Anda Sudah berhasil melakukan login',
        confirmButtonText: 'Oke'
      });
      router.push('/maps');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Anda gagal melakukan login!',
        confirmButtonText: 'oke'
      });
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
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
        <h2 className="mb-6 text-center text-2xl font-bold text-[#222831]">
          Login
        </h2>
        <button
          onClick={handleGoogleSignIn}
          className="mt-2 w-full rounded-lg bg-[#4285F4] px-4 py-2 font-bold text-white hover:bg-[#1967D2] focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
        >
          <i className="fab fa-google mr-2"></i> Daftar dengan Google
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;