import { BrowserRouter, Routes, Route, Navigate, Link, Outlet, useLocation } from "react-router-dom";

// Import semua komponen halaman Anda
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import HomeUser from "./components/HomeUser";
import NewsDetail from "./components/NewsDetail";
import CategoryPage from "./components/KategoriPage";
import AdminDashboard from "./components/AdminDashboard";
import CreateArticle from "./components/CreateArticle";
import EditArticle from "./components/EditArticle";
import ManageUsers from "./components/ManageUsers";
import ManageCategories from "./components/ManageCategories";
import SearchResultsPage from "./components/SearchResultsPage";
import ReviewArticles from './components/ReviewArticles';
import TakedownContent from './components/TakedownContent';
import MyArticles from './components/MyArticles';

// Fungsi helper untuk mendapatkan peran pengguna dari localStorage
const getCurrentUserRole = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user ? user.role : null;
    } catch (e) {
        return null;
    }
};

// Komponen Pembungkus untuk melindungi rute
const PrivateRoute = ({ children, allowedRoles }) => {
    const userRole = getCurrentUserRole();
    const location = useLocation();

    if (!userRole) {
        // Simpan lokasi asal sebelum redirect ke login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Jika peran tidak sesuai, kembalikan ke halaman utama
        return <Navigate to="/" replace />;
    }
    return children;
};

// Komponen Layout untuk Halaman yang Dilindungi (memiliki Navbar)
const ProtectedLayout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet /> {/* Ini akan merender komponen anak dari rute */}
            </main>
        </>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rute Publik (di luar layout utama) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rute yang Dilindungi (menggunakan layout dengan Navbar) */}
                <Route element={<ProtectedLayout />}>
                    <Route path="/" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca']}><HomeUser /></PrivateRoute>} />
                    <Route path="/newsdetail/:id" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca']}><NewsDetail /></PrivateRoute>} />
                    <Route path="/category/:name" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca']}><CategoryPage /></PrivateRoute>} />
                    <Route path="/search" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca']}><SearchResultsPage /></PrivateRoute>} />
                    
                    {/* Rute Jurnalis & Admin */}
                    <Route path="/my-articles" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis']}><MyArticles /></PrivateRoute>} />
                    <Route path="/create-article" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis']}><CreateArticle /></PrivateRoute>} />
                    <Route path="/edit-article/:id" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa', 'jurnalis']}><EditArticle /></PrivateRoute>} />

                    {/* Rute Khusus Admin */}
                    <Route path="/admindashboard" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa']}><AdminDashboard /></PrivateRoute>} />
                    <Route path="/manage-categories" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa']}><ManageCategories /></PrivateRoute>} />
                    <Route path="/review-articles" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa']}><ReviewArticles /></PrivateRoute>} />
                    <Route path="/takedown-content" element={<PrivateRoute allowedRoles={['admin_utama', 'admin_biasa']}><TakedownContent /></PrivateRoute>} />
                    
                    {/* Rute Khusus Admin Utama */}
                    <Route path="/manage-users" element={<PrivateRoute allowedRoles={['admin_utama']}><ManageUsers /></PrivateRoute>} />
                </Route>

                {/* Rute untuk halaman tidak ditemukan (404) */}
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
