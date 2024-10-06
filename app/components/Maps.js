import React, { ReactNode } from "react";
import Script from 'next/script';

const MapsLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <Script src="https://kit.fontawesome.com/fbadad80a0.js" strategy="lazyOnload" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};

export default MapsLayout;
