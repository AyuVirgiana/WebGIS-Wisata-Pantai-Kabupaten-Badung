import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

import { Section } from '../components/Section';
import { useAuth } from "../helper/auth_context";

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const AboutUs = () => {
  const { user } = useAuth();
  const [position, setPosition] = useState([null, null]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setPosition([51.505, -0.09]);
        }
      );
    }
  }, []);

  return (
    <>
      <Section
        title="Map"
        description="Here is a simple map view."
      >
        <div className="w-full h-96">
          {position && position[0] !== null && position[1] !== null ? (
            <MapContainer
              center={position}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                
              />
              <Marker position={position}>
                <Popup>
                  You are here!
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      </Section>
      <Section
        title="About Maps"
        description="Maps are essential tools for navigation, understanding geography, and analyzing spatial information. They provide a visual representation of the world around us and can be used for a variety of purposes, from planning trips to tracking environmental changes."
      >
        <p>
          Maps have been used for centuries to help people navigate and make sense of the world. They can range from simple hand-drawn sketches to complex digital representations. In today digital age, maps are more accessible than ever, thanks to technologies like GPS and online mapping services.
        </p>
      </Section>
    </>
  );
};

export default AboutUs;
