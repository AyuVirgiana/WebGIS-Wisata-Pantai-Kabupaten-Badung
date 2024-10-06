import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase_config';
import Swal from 'sweetalert2';

const RegisterForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const register = await createUserWithEmailAndPassword(auth, email, password);
      if (register) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You have successfully registered!',
          confirmButtonText: 'Oke'
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Failed to register!',
          confirmButtonText: 'Login'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Failed to register!',
        confirmButtonText: 'Login'
      });
      console.error(error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You have successfully registered!',
        confirmButtonText: 'Oke'
      });
      router.push('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Failed to register!',
        confirmButtonText: 'Login'
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
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 w-full rounded-lg border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00adb5]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 w-full rounded-lg border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00adb5]"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="mb-4 w-full rounded-lg border px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#00adb5]"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-[#00adb5] px-4 py-2 font-bold text-white hover:bg-[#00a3a7] focus:outline-none focus:ring-2 focus:ring-[#00adb5]"
          >
            Sign up
          </button>
        </form>
        <button
          onClick={handleGoogleSignUp}
          className="mt-2 w-full rounded-lg bg-[#4285F4] px-4 py-2 font-bold text-white hover:bg-[#1967D2] focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
        >
          <i className="fab fa-google mr-2"></i> Sign up with Google
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default RegisterForm;
