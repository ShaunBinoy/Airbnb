import { Link, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:4000/user-places")
      .then(({ data }) => {
        // console.log(typeof data);
        // console.log(data.userDetails);
        setPlaces(data.userDetails);
        // console.log(places);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
      });
  }, []);
  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          to={"/account/places/new"}
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add New Places
        </Link>
      </div>
      <div className="mt-4 ">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              to={"/account/places/" + place._id}
              className="flex cursor-pointer gap-4 bg-gray-100 p-3 rounded-2xl items-center mb-2"
            >
              <div className="flex h-32 w-32 bg-gray-300 grow shrink-0">
                {/* {place.photos.length > 0 && (
                  <img
                    className="object-cover"
                    src={"http://localhost:4000/uploads/" + place.photos[0]}
                    alt=""
                  />
                )} */}
                <PlaceImg place={place} />
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl font-semibold">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
