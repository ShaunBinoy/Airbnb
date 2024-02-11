import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import PhotoUploader from "../PhotoUploader";
import axios from "axios";
import AccountNav from "../AccountNav";
import { useEffect } from "react";

export default function PlacesFormPage() {
  const { id } = useParams();
  // console.log({ id });
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [title, setTitle] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuest, setMaxGuest] = useState("");
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  //Update
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("http://localhost:4000/places/" + id).then((response) => {
      const { data } = response;
      setEmail(data.email);
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuest(data.maxGuest);
      setPrice(data.price);
    });
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      email,
      address,
      title,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest,
      price,
    };
    // console.log(placeData.addedPhotos);

    //--------------------------------------------------------------Update places create-----------------=-----------------------------------------------------------------------------------
    if (id) {
      try {
        const response = await axios.put("http://localhost:4000/places", {
          id,
          ...placeData,
        });
        console.log(placeData.addedPhotos);
        // console.log(response);
        setRedirect(true);
      } catch (error) {
        console.error("Error submitting data:", error);
        // Handle error (e.g., display error message to user)
      }
    }

    //---------------------------------------------------------------new place create---------------------------------------------------------------------------------------------------------
    else {
      try {
        const response = await axios.post("http://localhost:4000/places", {
          ...placeData,
        });
        // console.log(response);
        setRedirect(true);
      } catch (error) {
        console.error("Error submitting data:", error);
        // Handle error (e.g., display error message to user)
      }
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        <h2 className="text-xl mt-4">Email</h2>
        <input
          type="text"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="Your Email"
        />

        <h2 className="text-xl mt-4">Title</h2>
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Title for your Property"
        />

        <h2 className="text-xl mt-4">Address</h2>
        <input
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          type="text"
          placeholder="Address to this Place"
        />

        <h2 className="text-xl mt-4">Photos</h2>
        <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        <div>
          <h2 className="text-xl mt-4">Description</h2>
          <p className="text-gray-500 text-sm">Detailed Description</p>
          <textarea
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />

          <h2 className="text-xl mt-4">Perks</h2>
          <p className="text-gray-500 text-sm">Select all the Perks</p>
          <div className="grid  gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks} />
          </div>
        </div>

        <h2 className="text-xl mt-4">Extra Info</h2>
        <p className="text-gray-500 text-sm">
          Extra inforation about the Property (House rules, etc...)
        </p>
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        <h2 className="text-xl mt-4">Check-In & Check-Out Time</h2>
        <p className="text-gray-500 text-sm">
          Add the Check-In & Check-Out time.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div>
            <h3 className="mt-2 px-1">Check-In Time</h3>
            <input
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              type="text"
              placeholder="12:00 PM"
            />
          </div>
          <div>
            <h3 className="mt-2 px-1">Check-Out Time</h3>
            <input
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              type="text"
              placeholder="11:00 AM"
            />
          </div>
          <div>
            <h3 className="mt-2 px-1">Max Number of Guests</h3>
            <input
              value={maxGuest}
              onChange={(ev) => setMaxGuest(ev.target.value)}
              type="number"
              placeholder="8 Person"
            />
          </div>
          <div>
            <h3 className="mt-2 px-1">Price Per Night</h3>
            <input
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              type="number"
              placeholder="8 Person"
            />
          </div>
        </div>
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
}
