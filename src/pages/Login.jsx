import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Mengirim request login ke backend
      const response = await api.post(`/login`, { username, password });
      
      // PENTING: Simpan keduanya agar sistem interceptor di api.js bisa bekerja
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      
      navigate("/home");
    } catch (err) {
      // Menangkap error dari backend
      setError(err.response?.data?.message || "Username atau password salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="container-fluid d-flex align-items-center justify-content-center position-relative overflow-hidden" 
      style={{ minHeight: "100vh", backgroundColor: "#FFF8F8" }}
    >
      {/* Ornamen Estetik */}
      <div className="position-absolute" style={{ width: "400px", height: "400px", background: "radial-gradient(circle, rgba(216,167,177,0.2) 0%, rgba(255,248,248,0) 70%)", top: "-10%", left: "-10%" }} />
      <div className="position-absolute" style={{ width: "500px", height: "500px", background: "radial-gradient(circle, rgba(216,167,177,0.25) 0%, rgba(255,248,248,0) 70%)", bottom: "-15%", right: "-10%" }} />

      <div className="card border-0 shadow p-4 p-md-5 bg-white position-relative" style={{ borderRadius: "24px", maxWidth: "450px", width: "100%", zIndex: 2 }}>
        
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: "#D8A7B1", letterSpacing: "0.5px" }}>
            ✨ SweetGlow
          </h2>
          <p className="text-muted small">Masuk untuk mengelola produk & transaksi premium skincare</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 small text-center py-2" style={{ borderRadius: "10px", backgroundColor: "#FFF0F0", color: "#D15B5B" }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0 text-muted" style={{ borderRadius: "12px 0 0 12px" }}>
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-0 py-2.5"
                placeholder="Masukkan username"
                style={{ borderRadius: "0 12px 12px 0", fontSize: "14px" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-0 text-muted" style={{ borderRadius: "12px 0 0 12px" }}>
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bg-light border-0 py-2.5"
                placeholder="••••••••"
                style={{ borderRadius: "0 12px 12px 0", fontSize: "14px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 text-white py-2.5 fw-bold shadow-sm rounded-pill mt-2 d-flex align-items-center justify-content-center gap-2"
            style={{ backgroundColor: "#D8A7B1", border: "none", fontSize: "15px", transition: "all 0.3s ease" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Memverifikasi...
              </>
            ) : (
              <>
                Masuk Ke Akun <i className="bi bi-arrow-right-short fs-5"></i>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-2 border-top" style={{ borderColor: "#FDF0F0" }}>
          <span className="text-muted small" style={{ fontSize: "11px" }}>
            &copy; 2026 SweetGlow Admin System Panel
          </span>
        </div>
      </div>
    </div>
  );
}