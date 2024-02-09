// GMDEdB0lWPhz6N69
// new : 8W207qhHc43pERdz
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  function registerUser(ev) {
    ev.preventDefault();
    // axios.get("/test").then((value) => {
    //   console.log(value);
    // });
    // axios
    //   .post("/users/register", {
    axios
      .post("http://localhost:4000/users/register", {
        name,
        email,
        password,
      })
      .then((response) => {
        console.log(response.data.userDoc); // Log the response data
        localStorage.setItem("token", response.data.userDoc.name);
        alert("Registeration Successful. Now you can LogIn");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        // res
        //   .status(500)
        //   .json({ message: "Internal server error during registration" });
        alert("Registration failed. Please try again.");
      });
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="email"
            placeholder="your@gmail.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already have an account?{"  "}
            <Link className="underline text-black" to={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
