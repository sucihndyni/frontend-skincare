import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Hapus token dan data user dari localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Jika ada menyimpan data user
    
    // 2. Redirect paksa ke halaman login
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top border-bottom" style={{ borderColor: "#F2E5E5", padding: "15px 0" }}>
      <div className="container">
        
        {/* BRAND / LOGO (Tetap di Kiri) */}
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/home" style={{ color: "#D8A7B1", fontSize: "22px", letterSpacing: "0.5px" }}>
          <span>✨</span> SweetGlow
        </Link>

        {/* TOGGLE MOBIL */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV MENU & LOGOUT (Didorong ke Kanan menggunakan ms-auto) */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 ms-auto w-100 justify-content-end">
            
            <ul className="navbar-nav gap-2 flex-row justify-content-center justify-content-lg-start my-2 my-lg-0">
              <li className="nav-item">
                <Link className="nav-link fw-semibold px-2 text-secondary custom-nav-link" to="/home">
                  Dashboard Display
                </Link>
              </li>

              {/* DROPDOWN ADMIN PANEL */}
              <li className="nav-item dropdown">
                <a 
                  className="nav-link fw-semibold px-2 dropdown-toggle text-secondary custom-nav-link" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  Admin Panel
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm p-2" style={{ borderRadius: "12px", minWidth: "200px" }}>
                  <li>
                    <Link className="dropdown-item py-2 px-3 rounded-3 custom-dropdown-item" to="/products">
                      <i className="bi bi-box-seam me-2"></i> Kelola Produk
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 px-3 rounded-3 custom-dropdown-item" to="/categories">
                      <i className="bi bi-tags me-2"></i> Kelola Kategori
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-2" style={{ borderColor: "#F2E5E5" }} />
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 px-3 rounded-3 custom-dropdown-item" to="/orders">
                      <i className="bi bi-receipt me-2"></i> Riwayat Transaksi
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 px-3 rounded-3 custom-dropdown-item" to="/statistics">
                      <i className="bi bi-graph-up-arrow me-2"></i> Statistics
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            {/* TOMBOL LOGOUT */}
            <button 
              onClick={handleLogout}
              className="btn btn-sm px-4 py-2 fw-semibold rounded-pill text-white shadow-sm d-flex align-items-center gap-2 mx-auto mx-lg-0" 
              style={{ backgroundColor: "#D8A7B1", border: "none", fontSize: "13px", transition: "all 0.3s ease" }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#C5939D"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#D8A7B1"}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>

          </div>
        </div>
      </div>

      <style>{`
        .custom-nav-link {
          transition: color 0.2s ease;
        }
        .custom-nav-link:hover {
          color: #D8A7B1 !important;
        }
        .custom-dropdown-item {
          color: #555555;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .custom-dropdown-item:hover, 
        .custom-dropdown-item:focus, 
        .custom-dropdown-item:active {
          background-color: #FFF2F2 !important;
          color: #D8A7B1 !important;
        }
      `}</style>
    </nav>
  );
}