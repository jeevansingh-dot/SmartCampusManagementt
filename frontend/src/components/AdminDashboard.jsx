import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    lostFound: 0,
  });

  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const fetchStats = async () => {
    try {
      if (user.role !== "admin") {
        navigate("/");
        return;
      }

      const headers = {
        "x-user-role": "admin",
      };

      const complaintResponse = await axios.get(
        `${API_BASE_URL}/api/complaints/stats`,
        { headers }
      );

      const lostFoundResponse = await axios.get(
        `${API_BASE_URL}/api/lostfound/stats`,
        { headers }
      );

      const complaintStats =
        complaintResponse.data.stats;

      const lostFoundStats =
        lostFoundResponse.data.stats;

      setStats({
        totalComplaints: complaintStats.total,
        pending: complaintStats.pending,
        inProgress: complaintStats.inProgress,
        resolved: complaintStats.resolved,
        lostFound: lostFoundStats.total,
      });
    } catch (error) {
      console.error(
        "Dashboard Stats Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <header className="admin-header">

        <div className="admin-brand">

          <div className="admin-brand-icon">
            🎓
          </div>

          <div>
            <h1>CampusConnect AI</h1>
            <p>
              Smart Campus Management System
            </p>
          </div>

        </div>

        <div className="admin-header-right">

          <div className="admin-profile">

            <div className="admin-avatar">
              {(user.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user.name || "Admin"}
              </strong>

              <span>
                {user.erpId || "Admin Account"}
              </span>
            </div>

          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="admin-main">

        <section className="admin-intro">

          <div>
            <p className="admin-label">
              ADMIN PORTAL
            </p>

            <h2>
              Admin Dashboard
            </h2>

            <p>
              Monitor and manage campus services
              from one place.
            </p>
          </div>

          <div className="admin-status">
            <span className="status-dot"></span>
            System Online
          </div>

        </section>


        {/* ================= LOADING ================= */}

        {loading && (
          <div className="dashboard-loading">
            Loading dashboard...
          </div>
        )}


        {/* ================= STATISTICS ================= */}

        {!loading && (
          <section className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon complaints-icon">
                📢
              </div>

              <div className="stat-info">
                <span>
                  Total Complaints
                </span>

                <strong>
                  {stats.totalComplaints}
                </strong>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon pending-icon">
                ⏳
              </div>

              <div className="stat-info">
                <span>
                  Pending
                </span>

                <strong>
                  {stats.pending}
                </strong>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon progress-icon">
                🔄
              </div>

              <div className="stat-info">
                <span>
                  In Progress
                </span>

                <strong>
                  {stats.inProgress}
                </strong>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon resolved-icon">
                ✅
              </div>

              <div className="stat-info">
                <span>
                  Resolved
                </span>

                <strong>
                  {stats.resolved}
                </strong>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon lost-icon">
                🔎
              </div>

              <div className="stat-info">
                <span>
                  Lost & Found
                </span>

                <strong>
                  {stats.lostFound}
                </strong>
              </div>

            </div>

          </section>
        )}


        {/* ================= MANAGEMENT ================= */}

        <section className="management-section">

          <div className="section-title">

            <h2>
              Campus Management
            </h2>

            <p>
              Manage student complaints and
              Lost & Found reports.
            </p>

          </div>


          <div className="management-grid">


            {/* COMPLAINTS */}

            <div className="management-card">

              <div className="management-top">

                <div className="management-icon">
                  📢
                </div>

                <div className="management-arrow">
                  →
                </div>

              </div>

              <h3>
                Complaint Management
              </h3>

              <p>
                View all student complaints,
                monitor their status and take
                necessary actions.
              </p>

              <button
                className="management-btn"
                onClick={() =>
                  navigate("/admin/complaints")
                }
              >
                Manage Complaints
                <span>→</span>
              </button>

            </div>


            {/* LOST & FOUND */}

            <div className="management-card">

              <div className="management-top">

                <div className="management-icon">
                  🔎
                </div>

                <div className="management-arrow">
                  →
                </div>

              </div>

              <h3>
                Lost & Found Management
              </h3>

              <p>
                Review lost and found reports,
                update item status and manage
                student submissions.
              </p>

              <button
                className="management-btn"
                onClick={() =>
                  navigate("/admin/lostfound")
                }
              >
                Manage Lost & Found
                <span>→</span>
              </button>

            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="admin-footer">

        <span>
          CampusConnect AI
        </span>

        <span>•</span>

        <span>
          Smart Campus Management System
        </span>

        <span>•</span>

        <span>
          Admin Portal
        </span>

      </footer>

    </div>
  );
};

export default AdminDashboard;