import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function SinglePlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`http://localhost:4000/places/${id}`).then((response) => {
      //   console.log(response.data);
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";

  return (
    <div className="mt-8 py-9">
      <h1 className="text-3xl font-semibold">{place.title}</h1>

      <AddressLink>{place.address}</AddressLink>

      <PlaceGallery place={place} />
      
      <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="text-2xl font-semibold">Description</h2>
            {place.description}
          </div>
          Check-In : {place.checkIn} <br />
          Check-Out : {place.checkOut} <br />
          Maximum No. of Guests : {place.maxGuest}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <h2 className="text-2xl font-semibold mt-4">Extra Info</h2>
      <div className="mt-2 text-gray-800">{place.extraInfo}</div>
    </div>
  );
}
