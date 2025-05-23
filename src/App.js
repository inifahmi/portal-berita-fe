import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; 
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import HomeUser from "./components/HomeUser";
import NewsDetail from "./components/NewsDetail";
import CategoryPage from "./components/KategoriPage";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="edit/:id" element={<EditUser />} /> */}
        <Route path="login" element={<Login />} /> 
        <Route path="register" element={<Register />} /> 
        <Route path="navbar" element={<Navbar />} />
        <Route path="homeuser" element={<HomeUser />} />
        <Route path="newsdetail/:id" element={<NewsDetail />} />
        <Route path="category/:id" element={<CategoryPage />} />
        <Route path="admindashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
