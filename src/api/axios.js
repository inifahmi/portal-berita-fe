// src/api/axios.js

import axios from 'axios';

// Membuat instance Axios dengan konfigurasi dasar
const api = axios.create({
    baseURL: 'http://localhost:5000/api' // URL dasar backend Anda
});

// Menambahkan interceptor untuk request
// Ini akan berjalan SEBELUM setiap request dikirim
api.interceptors.request.use(
    (config) => {
        // Ambil token dari localStorage
        const token = localStorage.getItem('token');

        // Jika token ada, tambahkan ke header Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Lakukan sesuatu jika ada error pada request
        return Promise.reject(error);
    }
);

export default api;