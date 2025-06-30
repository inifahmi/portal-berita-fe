import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Import axios
import api from "../api/axios.js"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State untuk pesan error
  const navigate = useNavigate();

  const handleLogin = async (e) => { // Menjadi async function
    e.preventDefault();
    setError(""); // Reset error message

    try {
      // Ganti URL dengan endpoint API login Anda
      const response = await api.post("/login", { // Asumsi API berjalan di port 5000
        username,
        password,
      });

      // Asumsi backend mengembalikan objek user dengan role dan token
      const { token, user } = response.data;

      // Simpan token dan data user (termasuk role) di localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Simpan seluruh objek user

      // Arahkan berdasarkan role
      if (user.role === "admin_utama" || user.role === "admin_biasa") {
        navigate("/admindashboard");
      } else {
        navigate("/"); // Arahkan ke halaman utama user biasa
      }

    } catch (err) {
      console.error("Login failed:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Login gagal. Periksa kembali username dan password Anda.");
    }
  };

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-one-third">
              <div className="box">
                <h1 className="title has-text-centered is-4">User Login</h1>
                <p className="has-text-centered is-size-6 has-text-grey mb-4">Portal Berita User Login</p>

                <form onSubmit={handleLogin}>
                  <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input
                        type="password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="help is-danger">{error}</p>} {/* Tampilkan pesan error */}

                  <div className="field mt-5">
                    <button
                      className="button is-fullwidth"
                      type="submit"
                      style={{ backgroundColor: "#343a40", color: "white" }}
                    >
                      Login
                    </button>
                  </div>
                  <p className="has-text-centered mt-3">
                    Belum punya akun? <Link to="/register">Daftar di sini</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;