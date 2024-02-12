import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import BookingDate from "../BookingDate";

export default function BookingPage() {
  const [booking, setBooking] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      axios.get("http://localhost:4000/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        // console.log(foundBooking);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }
  return (
    <div>
      <div className="my-8">
        <h1 className="text-2xl font-semibold">{booking.place.title}</h1>
        <AddressLink className="my-2 block">
          {booking.place.address}
        </AddressLink>
        <div className="bg-gray-200 p-4 mb-4 rounded-2xl">
          <h2 className="text-xl font-medium">Your Booking Informations</h2>
          <BookingDate booking={booking} className="p-8" />
        </div>
        <PlaceGallery place={booking.place} />
      </div>
    </div>
  );
}
