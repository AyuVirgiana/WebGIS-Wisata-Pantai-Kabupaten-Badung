"use client"
import React,{useEffect,useState } from "react";
import { useRouter } from 'next/navigation'
import { useAuth } from "../helper/auth_context";
import Sidebar from "./components/Aside";
import Swal from 'sweetalert2';
export default function MapsLayout({ children }) {
  
  const { user, loading } = useAuth();
  const router = useRouter();

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
  }, [ loading, user, router]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="flex flex-col md:flex-row ">
      <Sidebar />
      <div className="flex-grow ">
        <div className="mt-16 md:mt-0">{children}</div>
      </div>
    </div>
  );
}
