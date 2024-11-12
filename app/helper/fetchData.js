import { firestore } from '../config/firebase_config';
import { collection, getDocs } from "firebase/firestore";

export const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "pantai"));
    const data = {
      pantai: querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        
        // // Sanitasi ID: Ganti spasi dengan underscore dan hapus karakter selain alphanumeric dan dash
        // const docId = docData.nama
        //   .replace(/\s+/g, '_')  // Ganti spasi dengan _
        //   .replace(/[^\w\-]/g, '');  // Hapus karakter selain huruf, angka, dan dash
        
        return {
          id: doc.id,
          geometry: {
            type: "Point",
            coordinates: [
              docData.geometry.coordinates._long,  // Longitude (index 0)
              docData.geometry.coordinates._lat   // Latitude (index 1)
            ]
          },
          properties: {
            nama: docData.nama,
            alamat: docData.alamat,
            deskripsi: docData.deskripsi || "",  // Default ke string kosong jika tidak ada deskripsi
            fasilitas: docData.fasilitas || [],  // Default ke array kosong jika tidak ada fasilitas
            galeri: (docData.galeri || []).map(image => ({
              alt: image.alt || "Deskripsi gambar",  // Default alt text jika tidak ada
              url: image.url || ""  // Default URL kosong jika tidak ada
            })),
            image_thumb: docData.image_thumb || "",  // Default ke string kosong jika tidak ada thumbnail
            kecamatan: docData.kecamatan || "",  // Default ke string kosong jika tidak ada kecamatan
            rating: docData.rating || 0  // Default ke 0 jika tidak ada rating
          }
        };
      })
    };
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw new Error("Failed to fetch data");
  }
};
