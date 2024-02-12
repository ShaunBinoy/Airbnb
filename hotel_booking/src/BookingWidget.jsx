import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function BookingWidget(place) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuest, setNumberOfGuest] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const realPlace = place.place;
  const [redirect, setRedirect] = useState("");
  

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
    // console.log(numberOfNights);
  }

  async function bookThisPlace() {
    // const data = {
    //   place: realPlace._id,
    //   checkIn,
    //   checkOut,
    //   numberOfGuest,
    //   name,
    //   phone,
    //   price: numberOfNights * realPlace.price,
    // };
    // console.log(data);

    const response = await axios.post("http://localhost:4000/bookings", {
      place: realPlace._id,
      checkIn,
      checkOut,
      numberOfGuest,
      name,
      phone,
      price: numberOfNights * realPlace.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  //   console.log(play.price)
  //   console.log(place.price);

  return (
    <div className="bg-gray-100 shadow-md py-4 px-3 rounded-2xl ">
      <div className="text-lg font-semibold text-center">
        Price : ${realPlace.price} / Per Night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-2 text-sm">
            <label>Check-In : </label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-2 border-l text-sm">
            <label>Check-Out : </label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-2 border-t text-sm">
          <label>Number of Guests : </label>
          <input
            type="number"
            value={numberOfGuest}
            onChange={(ev) => setNumberOfGuest(ev.target.value)}
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-2 border-t text-sm">
            <label>Your Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book This Place
        {numberOfNights > 0 && (
          <span> ${numberOfNights * realPlace.price}</span>
        )}
      </button>
    </div>
  );
}
