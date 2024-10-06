import React from "react";
import "./globals.css";
import { AuthProvider } from "./helper/auth_context";
import Script from 'next/script';

const Layout = ({ children }) => {
 return (
  <html lang="en">
   <head>
    <Script src="https://kit.fontawesome.com/fbadad80a0.js" strategy="lazyOnload" />
   </head>
   <body>
    <AuthProvider>
    {children}
    </AuthProvider>
   </body>
  </html>
 );
};

export default Layout;
