import Link from 'next/link';
import { Background } from './Background';
import { Section } from './Section';
import { Logo } from './Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'; // Regular icon for email
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; // Brands icon for WhatsApp

const Footer = () => (
  <Background color="bg-gray-700">
    <Section>
      <div className="flex flex-col items-center text-white py-10">
        <div className="mb-6">
          <Logo />
        </div>
        <div className="flex space-x-6 mb-6">
          <a href="https://wa.me/6285792554820" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} className="hover:text-green-500 transition-colors duration-200" />
          </a>
          <a href="mailto:ayuvirgiana10@gmail.com" aria-label="Email" target="_blank">
            <FontAwesomeIcon icon={faEnvelope} className="hover:text-blue-500 transition-colors duration-200" />
          </a>
        </div>
        <ul className="flex space-x-6 text-gray-400 mb-6">
          <li className="hover:text-gray-600 transition-colors duration-200">
            <Link href="/">Home</Link>
          </li>
        </ul>
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} WebGIS Pencarian Wisata Pantai di Kabupaten Badung. Semua hak dilindungi.
        </p>
      </div>
    </Section>
  </Background>
);

export { Footer };
