import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  //   const storedName = localStorage.getItem("name");
  const navigate = useNavigate();

  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "profile";
  }
  //   console.log(subpage);
  //   const { setUser, user } = useContext(UserContext);
  //   console.log(user);
  const { setUser } = useContext(UserContext);
  const [name, setName] = useState("");

  useEffect(() => {
    // Retrieve 'name' from local storage
    const storedName = localStorage.getItem("name");

    // Update state with the retrieved name
    if (storedName) {
      setName(storedName);
    }
  }, []);

  function handleLogout() {
    // Clear local storage
    localStorage.clear();

    // Clear user context (if you are using useContext)
    setUser(null);

    // Redirect the user to the login page or any other appropriate page
    navigate("/");
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {name} <br />
          <button className="primary max-w-sm mt-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && (
        // <div>Places</div>
        <PlacesPage />
      )}
    </div>
  );
}
