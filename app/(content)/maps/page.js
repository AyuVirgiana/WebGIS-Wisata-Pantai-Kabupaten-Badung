"use client";

import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import RouteCard from "../../components/card/RouteCard";
import "../../direction.css";
import { fetchData } from "../../helper/fetchData.js";
import { useRouter, useSearchParams } from "next/navigation";
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import axios from 'axios';

const MapsPage = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [directions, setDirections] = useState(null);
  const destinationMarkerRefs = useRef([]);
  const [nearestBeaches, setNearestBeaches] = useState([]);
  const [beachData, setBeachData] = useState([]);
  const [city, setCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const geocodingClient = mbxGeocoding({ accessToken: process.env.NEXT_PUBLIC_MAPS_TOKEN });
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOnClose = () => {
    setSelectedPlace(null);
    setRoute(null);
  };

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setBeachData(result.pantai); // Access the 'pantai' array from the result
    };
    getData();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedPlace) return;

      const { geometry } = selectedPlace;
      const { coordinates } = geometry;
      const { _long, _lat } = coordinates;

      try {
        const response = await geocodingClient.reverseGeocode({
          query: [_long, _lat],
          limit: 1
        }).send();
        const place = response.body.features[0];
        const locality = place.context.find(c => c.id.includes('place'));
        const cityName = locality ? locality.text : 'Unknown Location';
        setCity(cityName);

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
    };

    fetchWeatherData();
  }, [selectedPlace]);

  useEffect(() => {
    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error("Error obtaining location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!beachData || !userLocation) return;

    const token = process.env.NEXT_PUBLIC_MAPS_TOKEN;
    const map = new mapboxgl.Map({
      accessToken: token,
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      zoom: 10,
      center: userLocation,
      attributionControl: false,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      trackUserLocation: true,
      showUserHeading: true,
      showUserLocation: true,
    });

    const navigation = new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
    });

    const userMarker = new mapboxgl.Marker({
      color: "#3366FF",
    })
      .setLngLat(userLocation)
      .addTo(map);

    const localGeocoder1 = (query) => {
      const matchingFeatures = [];
      beachData.forEach((item) => {
        if (item.properties.nama && item.properties.nama.toLowerCase().includes(query.toLowerCase())) {
          matchingFeatures.push({
            type: "Feature",
            geometry: item.geometry,
            properties: {
              id: item.id,
              name: item.properties.nama,
              image: item.properties.image_thumb,
              rating: item.properties.rating,
              kecamatan: item.properties.kecamatan,
              location: item.properties.alamat,
            },
            place_name: item.properties.nama,
            center: [
              item.geometry.coordinates[0], // Use _long
              item.geometry.coordinates[1], // Use _lat
            ],
            place_type: ["beach"],
          });
        }
      });
      return matchingFeatures;
    };

    const geocoder = new MapboxGeocoder({
      accessToken: token,
      localGeocoder: localGeocoder1,
      zoom: 14,
      placeholder: "Masukkan pencarian, contoh: Pantai",
      mapboxgl: mapboxgl,
      language: "id",
      trackProximity: false,
      limit: 15,
    });

    geocoder.on("results", (event) => {
      // Mengambil hasil lokal dari pencarian pengguna
      const localResults = localGeocoder1(event.query);
      
      // Jika ada hasil yang ditemukan, tambahkan ke dalam geocoder
      if (localResults?.length) {
        localResults.forEach((result) => {
          geocoder.addResult(result);
        });
      }
    });
    
    geocoder.on("result", (event) => {
      // Mengambil data fitur dari hasil pencarian yang dipilih
      const features = event.result;
    
      if (features) {
        // Set tempat yang dipilih dan bersihkan marker tujuan sebelumnya
        setSelectedPlace(features);
        clearDestinationMarkers();
    
        // Membuat marker tujuan berwarna merah di lokasi yang dipilih
        const destinationMarker = new mapboxgl.Marker({ color: "#FF0000" })
          // .setLngLat([beach.geometry.coordinates[0], beach.geometry.coordinates[1]])
          .setLngLat([features.geometry.coordinates[0], features.geometry.coordinates[1]])
          .addTo(map);
    
        // Ubah kursor menjadi pointer saat diarahkan ke marker tujuan
        destinationMarker.getElement().style.cursor = 'pointer';
    
        // Simpan marker tujuan ke dalam array referensi untuk pengelolaan lebih lanjut
        destinationMarkerRefs.current.push(destinationMarker);
    
        // Atur arah jika lokasi pengguna dan fitur directions tersedia
        if (userLocation && directions) {
          directions.setOrigin(userLocation); // Titik awal dari lokasi pengguna
          directions.setDestination([
            features.geometry.coordinates._long,
            features.geometry.coordinates._lat,
          ]);
          
        }
      } else {
        // Reset tempat yang dipilih jika tidak ada fitur ditemukan
        setSelectedPlace(null);
      }
    });
    
    map.addControl(geocoder, "top-right");
    map.addControl(geolocate, "bottom-right");
    map.addControl(navigation, "bottom-right");

    const directionsInstance = new MapboxDirections({
      accessToken: token,
      unit: "metric",
      profile: "mapbox/driving",
      controls: {
        inputs: true,
        instructions: true,
        profileSwitcher: true,
      },
      language: "id",
      interactive: false,
      clickToSetOrigin: false,
      clickToSetDestination: false,
      marker: false,
    });

    directionsInstance.on("route", (event) => {
      const route = event.route[0];
      setRoute(route);
    });

    setDirections(directionsInstance);
    map.addControl(directionsInstance, "top-left");

    if (searchParams.get("findNearest") === "true") {
      findNearestBeachesFromUserLocation(map);
    }
    if (searchParams.get("all") === "true") {
      findAll(map);
    }
    if (searchParams.get("kecamatan")) {
      const dataKecamatan = searchParams.get("kecamatan");
      findKecamatan(dataKecamatan, map);
    }
    return () => map.remove();
  }, [beachData, userLocation, searchParams]);

  const findAll = (map) => {
    try {
      clearDestinationMarkers();

      beachData.forEach((beach) => {
        const marker = new mapboxgl.Marker({
          color: "#36BA98",
        })
          .setLngLat([
            beach.geometry.coordinates[0],
            beach.geometry.coordinates[1],
          ])
          .addTo(map);

        marker.getElement().style.cursor = 'pointer';
        marker.getElement().addEventListener('mouseenter', () => {
          marker.getElement().style.cursor = 'pointer';
        });

        marker.getElement().addEventListener('mouseleave', () => {
          marker.getElement().style.cursor = '';
        });

        marker.getElement().addEventListener("click", () => {
          setSelectedPlace({
            geometry: {
              coordinates: {
                "_long": beach.geometry.coordinates[0],
                "_lat": beach.geometry.coordinates[1]
              },
            },
            properties: {
              id: beach.id,
              name: beach.properties.nama,
              image: beach.properties.image_thumb,
              rating: beach.properties.rating,
              kecamatan: beach.properties.kecamatan,
              alamat: beach.properties.alamat,
            }
          });
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  
  const findKecamatan = (kecamatan, map) => {
    try {
      const beachesInKecamatan = beachData.filter((beach) => {
        return beach.properties.kecamatan.toLowerCase() === kecamatan.toLowerCase();
      });

      clearDestinationMarkers();

      beachesInKecamatan.forEach((beach) => {
        const marker = new mapboxgl.Marker({
          color: "#36BA98",
        })
          .setLngLat([
            beach.geometry.coordinates[0],
            beach.geometry.coordinates[1],
          ])
          .addTo(map);
          marker.getElement().style.cursor = 'pointer';
          marker.getElement().addEventListener('mouseenter', () => {
            marker.getElement().style.cursor = 'pointer';
          });

          marker.getElement().addEventListener('mouseleave', () => {
            marker.getElement().style.cursor = '';
          });
        marker.getElement().addEventListener("click", () => {
          setSelectedPlace({
            geometry: {
              coordinates: {
                "_long": beach.geometry.coordinates[0],
                "_lat": beach.geometry.coordinates[1]
              },
            },
            properties: {
              id: beach.id,
              name: beach.properties.name,
              image: beach.properties.image_thumb,
              rating: beach.properties.rating,
              kecamatan: beach.properties.kecamatan,
              alamat: beach.properties.alamat,
            },
          });
        });

        destinationMarkerRefs.current.push(marker);
      });

      setNearestBeaches(beachesInKecamatan);
    } catch (error) {
      console.error("Error adding markers:", error);
    }
  };


  const clearDestinationMarkers = () => {
    destinationMarkerRefs.current.forEach(marker => marker.remove());
    destinationMarkerRefs.current = [];
  };

  const findNearestBeachesFromUserLocation = (map) => {
    if (!userLocation || !beachData) return;

    const sortedBeaches = [...beachData].map((beach) => {
      const [longitude, latitude] = beach.geometry.coordinates;
      const distance = calculateDistance(userLocation[1], userLocation[0], latitude, longitude);
      return {
        ...beach,
        distance,
      };
    }).sort((a, b) => a.distance - b.distance);

    const nearestBeaches = sortedBeaches.slice(0, 5);
    setNearestBeaches(nearestBeaches);

    nearestBeaches.forEach((beach) => {
      const marker = new mapboxgl.Marker({
        color: "#36BA98",
      })
        .setLngLat([beach.geometry.coordinates[0], beach.geometry.coordinates[1]])
        .addTo(map);

      marker.getElement().style.cursor = 'pointer';

      marker.getElement().addEventListener("click", () => {
        setSelectedPlace({
          geometry: {
            coordinates: {
              "_long": beach.geometry.coordinates[0],
              "_lat": beach.geometry.coordinates[1],
            },
          },
          properties: {
            id: beach.id,
            name: beach.properties.nama,
            image: beach.properties.image_thumb,
            rating: beach.properties.rating,
            kecamatan: beach.properties.kecamatan,
            alamat: beach.properties.alamat,
          },
        });
      });
    });
  };


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance / 1000;
  };

  // const handleRouteClick = (destination) => {
  //   if (userLocation && destination && directions) {
  //     directions.setOrigin(userLocation);
  //     // directions.setDestination([destination.geometry.coordinates[0], destination.geometry.coordinates[1]]);
  //     directions.setDestination([destination.geometry.coordinates._long, destination.geometry.coordinates._lat]);
  //   }
  // };

  // const handleRouteClick = (destination) => {
  //   if (userLocation && destination && directions) {
  //     directions.setOrigin(userLocation);
  //     directions.setDestination(destination);
  //   }
  // };
  
  const handleRouteClick = (selectedPlace) => {
    if (userLocation && selectedPlace && directions) {
      // Check if coordinates are in array format ([0], [1]) or in object format (_long, _lat)
      const destinationCoordinates = Array.isArray(selectedPlace.geometry.coordinates)
        ? selectedPlace.geometry.coordinates
        : [
            selectedPlace.geometry.coordinates._long,
            selectedPlace.geometry.coordinates._lat
          ];
  
      directions.setOrigin(userLocation);
      directions.setDestination(destinationCoordinates);
    }
  };
  

  const handleDetailClick = (id) => {

    router.push(`/detail/${id}`);
  };

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-screen">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
          </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:h-screen h-fit">
      <div
        className="flex-grow relative "
        id="map"
      >
{selectedPlace && (
  <div className="absolute bottom-5 left-5 w-56 max-h-fit bg-white p-3 shadow-lg z-10 rounded-lg text-black md:w-72 md:max-h-auto md:p-5">
    <button
      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 transition-all duration-300  text-white rounded-full w-6 h-6 flex items-center justify-center font-bold"
      onClick={handleOnClose}
    >
      X
    </button>
    {selectedPlace.properties.image && (
      <img
        src={selectedPlace.properties.image}
        alt={selectedPlace.properties.name}
        className="w-full h-24 object-cover mb-2 rounded-lg"
      />
    )}
    <p className="font-bold text-sm md:text-xs">{selectedPlace.properties.name}</p>
    {selectedPlace.properties.rating && (
      <p className="text-sm md:text-xs">Rating: {selectedPlace.properties.rating}</p>
    )}
    {selectedPlace.properties.kecamatan && (
      <p className="text-sm md:text-xs">Kecamatan: {selectedPlace.properties.kecamatan}</p>
    )}
    {weather && (
      <div className="flex items-center mt-1">
        <img
          src={weather.icon}
          alt="weather-icon"
          className="w-4 h-4 mr-2"
        />
        <p className="text-sm md:text-xs">{weather.description} ({weather.degree}°C)</p>
      </div>
    )}
    <div className="flex flex-col md:flex-row justify-between mt-4">
      <button
        className="bg-blue-500 text-white px-2 py-2 rounded-lg w-full md:w-28 m-1 md:m-2 hover:bg-blue-700 transition-all duration-300"
        onClick={() =>
          handleDetailClick(selectedPlace.properties.id)
        }
      >
        Detail
      </button>
      <button
      className="bg-green-500 text-white px-2 py-2 rounded-lg w-full md:w-28 m-1 md:m-2 hover:bg-green-600 transition-all duration-300"
      onClick={() => {
      console.log("Tombol diklik!"); // Debugging
      const profile = document.querySelector('.mapbox-directions-profile');
      console.log("Profile Element:", profile); // Pastikan elemen ditemukan

      if (profile) {
      profile.style.display = 'block';
      } else {
      console.error("Elemen .mapbox-directions-profile tidak ditemukan!");
      }
      
      handleRouteClick(selectedPlace);
      // handleRouteClick([
      // selectedPlace.geometry.coordinates._long,
      // selectedPlace.geometry.coordinates._lat,

      // selectedPlace.geometry.coordinates[0],
      // selectedPlace.geometry.coordinates[1],
      // ]);
      }}
      >
      Rute
      </button>

          </div>
        </div>
      )}



        <RouteCard route={route} onClose={() => setRoute(null)} />
      </div>
    </div>
  );
};

export default MapsPage;