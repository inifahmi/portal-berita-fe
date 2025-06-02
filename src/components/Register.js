import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios"; // Import axios

const Register = () => {
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState(""); // Mengganti nama state dari 'nama' menjadi 'namaLengkap' sesuai ERD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pembaca");
  const [error, setError] = useState(""); // State untuk pesan error
  const [success, setSuccess] = useState(""); // State untuk pesan sukses
  const navigate = useNavigate();

  const handleRegister = async (e) => { // Menjadi async function
    e.preventDefault();
    setError(""); // Reset error message
    setSuccess(""); // Reset success message

    try {
      // Ganti URL dengan endpoint API register Anda
      const response = await axios.post("http://localhost:5000/api/register", { // Asumsi API berjalan di port 5000
        username,
        nama_lengkap: namaLengkap, // Kirim sebagai nama_lengkap sesuai ERD
        email,
        password,
        role,
      });

      setSuccess("Pendaftaran berhasil! Silakan login."); // Pesan sukses
      // Setelah register berhasil, arahkan ke login
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Tunda 2 detik sebelum redirect

    } catch (err) {
      console.error("Registration failed:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Pendaftaran gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-one-third">
              <div className="box">
                <h1 className="title has-text-centered is-4">User Register</h1>
                <p className="has-text-centered is-size-6 has-text-grey mb-4">
                  Portal Berita User Registration
                </p>

                <form onSubmit={handleRegister}>
                  <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Nama Lengkap</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input
                        type="email"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
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
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Role</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          {/* Pembaca sebagai default untuk pendaftaran self-service */}
                          <option value="pembaca">Pembaca</option>
                          {/* Admin dan Jurnalis biasanya ditambahkan oleh admin utama */}
                          {/* <option value="admin_biasa">Admin Biasa</option>
                          <option value="jurnalis">Jurnalis</option> */}
                        </select>
                      </div>
                    </div>
                  </div>

                  {error && <p className="help is-danger">{error}</p>}
                  {success && <p className="help is-success">{success}</p>}

                  <div className="field mt-5">
                    <button
                      className="button is-fullwidth"
                      type="submit"
                      style={{ backgroundColor: "#343a40", color: "white" }}
                    >
                      Register
                    </button>
                  </div>
                  <p className="has-text-centered mt-3">
                    Sudah punya akun? <Link to="/login">Login di sini</Link>
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

export default Register;