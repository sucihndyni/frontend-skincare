import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistic = () => {
    const [data, setData] = useState({
        revenue: 0, total_orders: 0, total_sales: 0, total_products: 0,
        topProducts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resMain, resTop] = await Promise.all([
                    api.get("/statistics"),
                    api.get("/statistics/top-products")
                ]);
                setData({
                    ...resMain.data.data,
                    topProducts: resTop.data.data
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Navbar />;

    const chartData = {
        labels: data.topProducts.slice(0, 3).map(p => p.nama_produk),
        datasets: [{
            label: 'Jumlah Terjual',
            data: data.topProducts.slice(0, 3).map(p => p.total_terjual || p.terjual),
            backgroundColor: "#E995B1",
            borderRadius: 8,
        }]
    };

    return (
        <div style={{ backgroundColor: "#FFF8F9", minHeight: "100vh", paddingBottom: "50px" }}>
            <Navbar />
            <div className="container mt-4">
                <h3 className="mb-4" style={{ color: "#D66D8D" }}>✨ Dashboard Analisis</h3>
                
                {/* Kartu Ringkasan */}
                <div className="row g-3 mb-4">
                    {[
                        { title: "Total Pendapatan", val: `Rp ${data.revenue?.toLocaleString("id-ID")}` },
                        { title: "Total Pesanan", val: data.total_orders },
                        { title: "Barang Terjual", val: data.total_sales },
                        { title: "Katalog Produk", val: data.total_products }
                    ].map((item, i) => (
                        <div className="col-md-3" key={i}>
                            <div className="card p-4 border-0 shadow-sm" style={{ borderRadius: "20px", background: "#ffffff" }}>
                                <small className="text-muted">{item.title}</small>
                                <h4 style={{ color: "#E995B1" }}>{item.val}</h4>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grafik & Top 3 */}
                <div className="row g-4">
                    <div className="col-md-8">
                        <div className="card p-4 border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                            <h5>Grafik Produk Terlaris</h5>
                            <Bar data={chartData} options={{ responsive: true }} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card p-4 border-0 shadow-sm" style={{ borderRadius: "20px", height: "100%" }}>
                            <h5 className="mb-3">Top 3 Terlaris</h5>
                            <div className="list-unstyled">
                                {data.topProducts.slice(0, 3).map((p, i) => (
                                    <div key={i} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                                        <div>
                                            <div style={{ fontWeight: "600" }}>{p.nama_produk}</div>
                                            <small style={{ color: "#D66D8D" }}>{p.brand}</small>
                                        </div>
                                        <div style={{ fontWeight: "bold" }}>{p.total_terjual || p.terjual} pcs</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistic;