import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios
import api from "../api/axios.js"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    pendingReviews: 0,
    todayActivity: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State untuk error
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate(); // Inisialisasi useNavigate

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        // Ganti URL dengan endpoint API Anda untuk mengambil statistik
        // Endpoint ini perlu dibuat di backend untuk menghitung data dari tabel
        const response = await api.get("/admin/stats"); // Contoh endpoint

        setStats(response.data); // Asumsi response.data langsung berisi objek stats
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err.response ? err.response.data : err.message);
        setError("Gagal memuat statistik dashboard.");
        setLoading(false);
      }
    };

    fetchStats();

    // Update waktu setiap detik
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
    // Implementasi navigasi ke halaman manajemen yang sesuai
    switch (action) {
      case 'profile':
        navigate('/profile'); // Arahkan ke halaman profil admin
        break;
      case 'logout':
        // Logic logout yang sama dengan Navbar
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        break;
      case 'create-user':
        navigate('/register'); // Arahkan ke halaman register atau form buat user khusus admin
        break;
      case 'manage-roles':
        navigate('/manage-users'); // Arahkan ke halaman manajemen pengguna untuk mengubah peran
        break;
      case 'suspend-users':
        navigate('/manage-users'); // Arahkan ke halaman manajemen pengguna untuk suspend
        break;
      case 'review-articles':
        navigate('/review-articles'); // Arahkan ke halaman daftar artikel menunggu
        break;
      case 'takedown-content':
        navigate('/takedown-content'); // Arahkan ke daftar artikel diterbitkan untuk aksi take down
        break;
      case 'manage-categories':
        navigate('/manage-categories'); // Arahkan ke halaman manajemen kategori
        break;
      case 'website-settings':
        alert('Fitur Pengaturan Website belum diimplementasikan.');
        // navigate('/admin/settings');
        break;
      case 'backup-data':
        alert('Fitur Backup Data belum diimplementasikan.');
        // Membutuhkan endpoint backend dan logika download
        break;
      case 'system-logs':
        alert('Fitur View System Logs belum diimplementasikan.');
        // navigate('/admin/logs'); // Arahkan ke halaman tampilan admin_logs
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="box">
              <p className="title is-4">Memuat dashboard...</p>
              <progress className="progress is-primary" max="100">60%</progress>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="box">
              <p className="title is-4 has-text-danger">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container">

          {/* Header Section */}
          <div className="columns is-centered mb-5">
            <div className="column is-four-fifths">
              <div className="box">
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <div>
                        <h1 className="title is-4 mb-2">
                          Selamat Datang, Admin Utama {/* Perlu diganti dengan nama user dari state */}
                        </h1>
                        <p className="subtitle is-6 has-text-grey">
                          {formatDateTime(currentTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item">
                      <div className="buttons">
                        <button
                          className="button is-small"
                          onClick={() => handleQuickAction('profile')}
                        >
                          Profile
                        </button>
                        <button
                          className="button is-small"
                          style={{ backgroundColor: "#343a40", color: "white" }}
                          onClick={() => handleQuickAction('logout')}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="columns is-centered mb-5">
            <div className="column is-four-fifths">
              <div className="columns">

                <div className="column">
                  <div className="box has-text-centered">
                    <p className="title is-1 has-text-primary">
                      {stats.totalUsers.toLocaleString()}
                    </p>
                    <p className="subtitle is-5">Total Users</p>
                    <p className="has-text-grey is-size-7">
                      Semua pengguna terdaftar
                    </p>
                  </div>
                </div>

                <div className="column">
                  <div className="box has-text-centered">
                    <p className="title is-1 has-text-info">
                      {stats.totalArticles.toLocaleString()}
                    </p>
                    <p className="subtitle is-5">Total Articles</p>
                    <p className="has-text-grey is-size-7">
                      Semua artikel di sistem
                    </p>
                  </div>
                </div>

                <div className="column">
                  <div className="box has-text-centered">
                    <p className="title is-1 has-text-warning">
                      {stats.pendingReviews}
                    </p>
                    <p className="subtitle is-5">Pending Reviews</p>
                    <p className="has-text-grey is-size-7">
                      Artikel menunggu persetujuan
                    </p>
                  </div>
                </div>

                {/* <div className="column">
                  <div className="box has-text-centered">
                    <p className="title is-1 has-text-success">
                      {stats.todayActivity}
                    </p>
                    <p className="subtitle is-5">Aktivitas Hari Ini</p>
                    <p className="has-text-grey is-size-7">
                      Aktivitas pengguna/admin hari ini
                    </p>
                  </div>
                </div> */}

              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="columns is-centered">
            <div className="column is-four-fifths">
              <div className="box">
                <h2 className="title is-5 mb-4">Quick Actions</h2>

                <div className="columns">

                  <div className="column">
                    <div className="box" style={{ backgroundColor: "#f8f9fa" }}>
                      <h3 className="subtitle is-6 mb-3">👥 User Management</h3>
                      <div className="buttons are-small">
                        <button
                          className="button is-fullwidth mb-2"
                          style={{ backgroundColor: "#343a40", color: "white" }}
                          onClick={() => handleQuickAction('create-user')}
                        >
                          Create User
                        </button>
                        <button
                          className="button is-fullwidth mb-2"
                          onClick={() => handleQuickAction('manage-roles')}
                        >
                          Manage Roles
                        </button>
                        <button
                          className="button is-fullwidth"
                          onClick={() => handleQuickAction('suspend-users')}
                        >
                          Suspend Users
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="box" style={{ backgroundColor: "#f8f9fa" }}>
                      <h3 className="subtitle is-6 mb-3">📝 Content Control</h3>
                      <div className="buttons are-small">
                        <button
                          className="button is-fullwidth mb-2"
                          style={{ backgroundColor: "#343a40", color: "white" }}
                          onClick={() => handleQuickAction('review-articles')}
                        >
                          Review Pending Articles
                        </button>
                        <button
                          className="button is-fullwidth mb-2"
                          onClick={() => handleQuickAction('takedown-content')}
                        >
                          Take Down Content
                        </button>
                        <button
                          className="button is-fullwidth"
                          onClick={() => handleQuickAction('manage-categories')}
                        >
                          Manage Categories
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* <div className="column">
                    <div className="box" style={{ backgroundColor: "#f8f9fa" }}>
                      <h3 className="subtitle is-6 mb-3">⚙️ System Control</h3>
                      <div className="buttons are-small">
                        <button
                          className="button is-fullwidth mb-2"
                          style={{ backgroundColor: "#343a40", color: "white" }}
                          onClick={() => handleQuickAction('website-settings')}
                        >
                          Website Settings
                        </button>
                        <button
                          className="button is-fullwidth mb-2"
                          onClick={() => handleQuickAction('backup-data')}
                        >
                          Backup Data
                        </button>
                        <button
                          className="button is-fullwidth"
                          onClick={() => handleQuickAction('system-logs')}
                        >
                          View System Logs
                        </button>
                      </div>
                    </div>
                  </div> */}

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;