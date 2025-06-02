import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import HomeUser from "./components/HomeUser";
import NewsDetail from "./components/NewsDetail";
import CategoryPage from "./components/KategoriPage";
import AdminDashboard from "./components/AdminDashboard";

// --- Komponen Baru yang ditambahkan ---
import CreateArticle from "./components/CreateArticle"; // Komponen untuk membuat artikel baru
import ManageUsers from "./components/ManageUsers";   // Komponen untuk mengelola pengguna
import ManageCategories from "./components/ManageCategories"; // Komponen untuk mengelola kategori
import SearchResultsPage from "./components/SearchResultsPage"; // Komponen untuk hasil pencarian
// import UserProfile from "./components/UserProfile"; // Jika Anda membuat komponen profil user

// Fungsi untuk mendapatkan peran pengguna dari localStorage
// Ini adalah cara sederhana untuk simulasi di frontend.
// Di aplikasi nyata, Anda mungkin memiliki state manajemen global (Redux/Context)
// atau mengambilnya dari token JWT setelah didekode.
const getCurrentUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.role : null;
};

// Komponen Pembungkus (Wrapper Component) untuk melindungi rute
const PrivateRoute = ({ children, allowedRoles }) => {
  const userRole = getCurrentUserRole();

  // Jika tidak ada peran (belum login), arahkan ke halaman login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Jika peran pengguna tidak termasuk dalam allowedRoles, arahkan ke halaman utama atau 403 Forbidden
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Anda bisa membuat halaman "Access Denied" atau 403
    return <Navigate to="/" replace />;
  }

  // Jika sudah login dan perannya diizinkan, render komponen anak
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik (tidak memerlukan login) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute yang Memerlukan Autentikasi (dilindungi oleh PrivateRoute) */}
        {/* Rute utama setelah login, arahkan ke HomeUser */}
        <Route
          path="/"
          element={
            <PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca']}>
              <Navbar /> {/* Navbar selalu tampil setelah login */}
              <HomeUser />
            </PrivateRoute>
          }
        />

        {/* Rute Detail Berita */}
        <Route
          path="/newsdetail/:id"
          element={
            <PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca']}>
              <Navbar />
              <NewsDetail />
            </PrivateRoute>
          }
        />

        {/* Rute Halaman Kategori */}
        <Route
          path="/category/:name" // Menggunakan :name sesuai ERD kategori
          element={
            <PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca']}>
              <Navbar />
              <CategoryPage />
            </PrivateRoute>
          }
        />

        {/* Rute Khusus Admin/Jurnalis (dilindungi lebih ketat) */}
        {/* Dashboard Admin: Hanya untuk admin_utama dan admin_biasa */}
        <Route
          path="/admindashboard"
          element={
            <PrivateRoute allowedRoles={['admin_utama', 'admin_biasa']}>
              <Navbar />
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Buat Artikel: Untuk admin_utama, admin_biasa, dan jurnalis */}
        <Route
          path="/create-article"
          element={
            <PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis']}>
              <Navbar />
              <CreateArticle />
            </PrivateRoute>
          }
        />

        {/* Kelola Pengguna: Hanya untuk admin_utama */}
        <Route
          path="/manage-users"
          element={
            <PrivateRoute allowedRoles={['admin_utama']}>
              <Navbar />
              <ManageUsers />
            </PrivateRoute>
          }
        />

        {/* Kelola Kategori: Untuk admin_utama dan admin_biasa */}
        <Route
          path="/manage-categories"
          element={
            <PrivateRoute allowedRoles={['admin_utama', 'admin_biasa']}>
              <Navbar />
              <ManageCategories />
            </PrivateRoute>
          }
        />

        {/* Rute untuk hasil pencarian */}
        <Route
          path="/search"
          element={
            <PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca']}>
              <Navbar />
              <SearchResultsPage />
            </PrivateRoute>
          }
        />

        {/* Rute Halaman Profil Pengguna (jika ada) */}
        {/* <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca']}>
              <Navbar />
              <UserProfile />
            </PrivateRoute>
          }
        /> */}

        {/* Catch-all route untuk halaman tidak ditemukan (404) */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Halaman Tidak Ditemukan</h1>
            <p>Maaf, halaman yang Anda cari tidak ada.</p>
            <Link to="/">Kembali ke Beranda</Link>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;