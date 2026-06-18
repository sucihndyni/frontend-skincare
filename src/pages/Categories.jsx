/* global bootstrap */
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [namaKategori, setNamaKategori] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      let allCategories = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const res = await api.get(`/categories?page=${page}`);
        
        const pageData = res.data?.data?.data || res.data?.data || [];
        allCategories = [...allCategories, ...pageData];

        const current = res.data?.pagination?.current_page || res.data?.current_page || res.data?.meta?.current_page || page;
        const last = res.data?.pagination?.last_page || res.data?.last_page || res.data?.meta?.last_page || page;

        console.log(`Mengambil kategori halaman ${current} dari ${last}`);

        if (current < last) {
          page++;
        } else {
          hasNextPage = false;
        }
      }
      setCategories(allCategories);
    } catch (error) {
      console.error("Gagal load kategori admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (cat) => {
    setSelectedId(cat.id);
    setNamaKategori(cat.nama_kategori);
  };

  const updateCategory = async () => {
    try {
      const response = await api.put(`/categories/${selectedId}`, { 
        nama_kategori: namaKategori 
      });
      
      // Mengecek response.data.success sesuai dengan struktur try-catch baru di Laravel
      if (response.data && response.data.success) {
        alert(response.data.message); // Menampilkan "Category berhasil diperbarui 🎉"
        fetchCategories();
        
        // Sembunyikan modal Bootstrap secara aman
        const modalElement = document.getElementById("editCategoryModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      } else {
        alert(response.data?.message || "Gagal update kategori");
      }
    } catch (error) {
      console.error("Error update kategori:", error);
      // Jika error ditangkap oleh catch block Laravel (status 500) atau error validasi
      const errorMsg = error.response?.data?.message || "Gagal update kategori";
      alert(errorMsg);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Yakin hapus kategori ini?")) return;
    try {
      const response = await api.delete(`/categories/${id}`);
      
      if (response.data && response.data.success) {
        alert(response.data.message || "Category berhasil dihapus 👋");
        fetchCategories();
      } else {
        alert(response.data?.message || "Gagal hapus kategori");
      }
    } catch (error) {
      console.error("Error delete kategori:", error);
      const errorMsg = error.response?.data?.message || "Gagal hapus kategori";
      alert(errorMsg);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4" style={{ backgroundColor: "#FFF8F8", minHeight: "100vh" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" style={{ color: "#D8A7B1" }}>
              <i className="bi bi-tags me-2"></i> Category Management
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: "#D8A7B1" }} />
            </div>
          ) : (
            <div className="card border-0 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden" }}>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: "#FFF0F3" }}>
                    <tr style={{ color: "#D8A7B1" }}>
                      <th className="px-4 py-3" style={{ width: "150px" }}>ID Kategori</th>
                      <th className="py-3">Nama Kategori</th>
                      <th className="text-center py-3" style={{ width: "220px" }}>Aksi Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-4">
                          Tidak ada kategori yang terdaftar.
                        </td>
                      </tr>
                    ) : (
                      categories.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 fw-bold text-muted">#{item.id}</td>
                          <td>
                            <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ backgroundColor: "#FFF0F3", color: "#E995B1", border: "1px solid #FFE4E8" }}>
                              {item.nama_kategori}
                            </span>
                          </td>
                          <td className="text-center">
                            <button 
                              className="btn btn-sm px-3 py-1.5 rounded-pill me-2 fw-semibold" 
                              style={{ backgroundColor: "#E3F2FD", color: "#0D47A1", border: "none", fontSize: "12px", transition: "all 0.2s" }} 
                              data-bs-toggle="modal" 
                              data-bs-target="#editCategoryModal" 
                              onClick={() => openEdit(item)}
                              onMouseOver={(e) => { e.target.style.backgroundColor = "#BBDEFB"; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = "#E3F2FD"; }}
                            >
                              <i className="bi bi-pencil me-1"></i> Edit
                            </button>
                            <button 
                              className="btn btn-sm px-3 py-1.5 rounded-pill fw-semibold" 
                              style={{ backgroundColor: "#FFEBEE", color: "#C62828", border: "none", fontSize: "12px", transition: "all 0.2s" }} 
                              onClick={() => deleteCategory(item.id)}
                              onMouseOver={(e) => { e.target.style.backgroundColor = "#FFCDD2"; }}
                              onMouseOut={(e) => { e.target.style.backgroundColor = "#FFEBEE"; }}
                            >
                              <i className="bi bi-trash me-1"></i> Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Edit Kategori */}
      <div className="modal fade" id="editCategoryModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: "15px" }}>
            <div className="modal-header border-bottom-0" style={{ background: "#F9F1F2" }}>
              <h5 className="modal-title fw-bold">
                <i className="bi bi-pencil-square me-2" style={{ color: "#D8A7B1" }}></i> Update Nama Kategori
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <label className="form-label small fw-bold text-muted">Nama Kategori</label>
              <input 
                type="text" 
                className="form-control" 
                value={namaKategori} 
                onChange={(e) => setNamaKategori(e.target.value)} 
              />
            </div>
            <div className="modal-footer border-top-0">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Batal</button>
              <button type="button" className="btn text-white" onClick={updateCategory} style={{ backgroundColor: "#D8A7B1" }}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}