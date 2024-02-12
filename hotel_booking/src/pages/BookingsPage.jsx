import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { format } from "date-fns";

export default function BookingsPage() {
  const [bookings, setBookings] = useState("");
  useEffect(() => {
    axios.get("http://localhost:4000/bookings").then((response) => {
      // console.log(response.data[0]);
      setBookings(response.data);
      // const day = response.data[0];
      // console.log(day.checkIn);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <div className="flex gap-4 bg-gray-200 mt-3 rounded-2xl overflow-hidden">
              <div className="w-48">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3">
                <div className="text-lg font-serif">
                 Name : {booking.name}
                </div>
                <h2 className="text-lg font-semibold">{booking.place.title}</h2>
                <div>
                  {format(new Date(booking.checkIn), "dd-MM-yyyy")} To{" "}
                  {format(new Date(booking.checkOut), "dd-MM-yyyy")}
                </div>
                <div className="font-medium">
                  Amount : ${booking.price}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
