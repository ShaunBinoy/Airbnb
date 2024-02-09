import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../userContext";
import { useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [name, setName] = useState("");

  const { setUser, user } = useContext(UserContext);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await axios.get("/profile").then((data) => {
  //         setName(data.name);
  //         console.log(data);
  //       });
  //     } catch {
  //       console.log("Error while fetching");
  //     }
  //   };
  //   fetchData();
  // }, [name]);

  // async function handleLoginSubmit(ev) {
  //   ev.preventDefault();
  //   try {
  //     await axios.post("/login", { email, password });
  //     alert("Login Successful");
  //   } catch {
  //     alert("Login Failed");
  //   }
  // }

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/users/login", { email, password });
      // console.log("Login response:", response.data); // Log the response data
      // Store token in local storage
      // localStorage.setItem("token", data.token);
      setUser(data);
      alert("Login Successful");
      console.log(data.name);

      // Store name in local storage
      localStorage.setItem("name", data.name);

      setRedirect(true);
    } catch (error) {
      console.error("Login error:", error); // Log the error
      alert("Login Failed");
    }
  }

  useEffect(() => {
    // Retrieve user details from local storage
    const token = localStorage.getItem("token");
    // Retrieve user details from local storage
    const storedName = localStorage.getItem("name");
    if (token && !user) {
      axios
        .get("/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          setUser(data);
          // Set the name from local storage
          setName(storedName);
        })
        .catch((error) => {
          console.error("Profile retrieval error:", error);
        });
    }
  }, [user, setUser]);

  if (redirect) {
    return <Navigate to={"/"}></Navigate>;
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="your@gmail.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{"  "}
            <Link className="underline text-black" to={"/register"}>
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
