/* global bootstrap */
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let allOrders = [];
      let page = 1;
      let hasNextPage = true;

      // Loop untuk mengambil semua halaman sampai habis
      while (hasNextPage) {
        const res = await api.get(`/orders?page=${page}`);
        const pageData = res.data?.data || [];
        allOrders = [...allOrders, ...pageData];
        
        const meta = res.data?.pagination;
        if (meta && meta.current_page < meta.last_page) {
          page++;
        } else {
          hasNextPage = false;
        }
      }
      setOrders(allOrders);
    } catch (error) {
      console.error("Gagal memuat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ minHeight: "100vh", backgroundColor: "#FDFBF7" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold" style={{ color: "#D8A7B1" }}>
            <i className="bi bi-wallet2 me-2"></i> Riwayat Transaksi
          </h2>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden" }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: "#FFF0F3" }}>
                <tr style={{ color: "#D8A7B1" }}>
                  <th className="px-4 py-3">ID Order</th>
                  <th className="py-3">Pelanggan</th>
                  <th className="py-3">Tanggal</th>
                  <th className="py-3">Total Harga</th>
                  <th className="py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-4">Memuat data...</td></tr>
                ) : (
                  orders.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 fw-bold text-muted">#{item.id}</td>
                      <td>
                        <div className="fw-bold text-dark">{item.user?.nama}</div>
                        <small className="text-secondary">{item.user?.email}</small>
                      </td>
                      <td className="text-muted">{item.tanggal}</td>
                      <td className="fw-bold" style={{ color: "#D8A7B1" }}>
                        Rp {Number(item.total_harga).toLocaleString("id-ID")}
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm px-3 rounded-pill"
                          style={{ backgroundColor: "#FFE4E8", color: "#D8A7B1" }}
                          data-bs-toggle="modal"
                          data-bs-target="#orderDetailModal"
                          onClick={() => setSelectedOrder(item)}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="orderDetailModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "25px" }}>
            <div className="modal-header border-0 pt-4 px-4">
              <h5 className="modal-title fw-bold" style={{ color: "#D8A7B1" }}>Rincian Transaksi</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            
            <div className="modal-body px-4 pb-4">
              {selectedOrder && (
                <>
                  <div className="d-flex justify-content-between mb-4 bg-light p-3 rounded-3">
                    <div><span className="text-muted small d-block">ID ORDER</span><strong style={{ color: "#D8A7B1" }}>#{selectedOrder.id}</strong></div>
                    <div className="text-end"><span className="text-muted small d-block">TANGGAL</span><strong className="text-dark">{selectedOrder.tanggal}</strong></div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-muted small">NAMA PENGGUNA</span>
                    <div className="fw-bold text-dark fs-6">{selectedOrder.user?.nama}</div>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="fw-bold small text-muted text-uppercase mb-3">Daftar Produk</h6>
                    {selectedOrder.details.map((d, i) => (
                      <div key={i} className="d-flex justify-content-between mb-2">
                        <span className="text-dark">{d.product?.nama_produk} <span className="text-secondary">x{d.qty}</span></span>
                        <span className="fw-semibold">Rp {Number(d.subtotal).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted">Metode Pembayaran</span>
                    <span className="badge rounded-pill px-3" style={{ backgroundColor: "#D8A7B1" }}>{selectedOrder.payment}</span>
                  </div>

                  <div className="mt-4 p-3 rounded-3 text-center" style={{ backgroundColor: "#D8A7B1" }}>
                    <div className="text-white small">TOTAL AKHIR</div>
                    <div className="text-white fs-4 fw-bold">Rp {Number(selectedOrder.total_harga).toLocaleString("id-ID")}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}