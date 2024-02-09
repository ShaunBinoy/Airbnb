import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:4000/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div>
      {places.length > 0 && places.map((place) => <div>{place.title}</div>)}
    </div>
  );
}
