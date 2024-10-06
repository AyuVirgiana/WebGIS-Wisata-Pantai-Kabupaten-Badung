import { firestore } from '../config/firebase_config';
import { collection, getDocs } from "firebase/firestore";
export const fetchData = async () => {
  const querySnapshot = await getDocs(collection(firestore, "wisata_pantai"));
  const data = querySnapshot.docs.map((doc) => (
    { id: doc.id, ...doc.data() }
  ));
  return data;
};