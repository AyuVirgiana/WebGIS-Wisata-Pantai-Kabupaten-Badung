import React from 'react';
import { AppConfig } from '../../utils/AppConfig';

const FooterCopyright = () => (
  <div className="footer-copyright text-gray-400">
    © Copyright {new Date().getFullYear()} {AppConfig.title}.
    <style jsx>
      {`
        .footer-copyright :global(a) {
          @apply text-primary-500;
        }

        .footer-copyright :global(a:hover) {
          @apply underline;
        }
      `}
    </style>
  </div>
);

export { FooterCopyright };
