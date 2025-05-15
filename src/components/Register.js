import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pembaca");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    console.log({ username, nama, email, password, role });
    navigate("/login"); // Setelah register, arahkan ke login
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
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
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
                          <option value="admin_biasa">Admin</option>
                          <option value="jurnalis">Jurnalis</option>
                          <option value="pembaca">Pembaca</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="field mt-5">
                    <button 
                      className="button is-fullwidth" 
                      type="submit"
                      style={{ backgroundColor: "#343a40", color: "white" }}
                    >
                      Register
                    </button>
                  </div>
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