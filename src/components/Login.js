import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Untuk saat ini kosongkan proses autentikasi
    console.log("Username:", username, "Password:", password);
    navigate("/"); // Setelah login sukses arahkan ke halaman Home/UserList
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

                  <div className="field mt-5">
                    <button 
                      className="button is-fullwidth" 
                      type="submit"
                      style={{ backgroundColor: "#343a40", color: "white" }}
                    >
                      Login
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

export default Login;