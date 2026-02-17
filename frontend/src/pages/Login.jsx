import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");       // ✅ error state
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError("");       // clear previous error
    setLoading(true);

    try {
      const res = await axios.post(
        "https://localhost:7130/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      const decoded = jwtDecode(res.data.token);
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (err) {
      setError("Invalid email or password");   // ✅ show inside form
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
