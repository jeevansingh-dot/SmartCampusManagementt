import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminComplaints.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchComplaints = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (user.role !== "admin") {
        window.location.href = "/";
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/complaints`,
        {
          headers: {
            "x-user-role": "admin",
          },
        }
      );

      setComplaints(response.data || []);
    } catch (error) {
      console.error(
        "Fetch Admin Complaints Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id) => {
    try {
      setUpdatingId(id);

      const response = await axios.put(
        `${API_BASE_URL}/api/complaints/${id}/status`,
        {},
        {
          headers: {
            "x-user-role": "admin",
          },
        }
      );

      if (response.data.success) {
        await fetchComplaints();
      }
    } catch (error) {
      console.error(
        "Update Status Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update complaint status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/complaints/${id}`,
        {
          headers: {
            "x-user-role": "admin",
          },
        }
      );

      if (response.data.success) {
        setComplaints((prev) =>
          prev.filter(
            (complaint) =>
              complaint._id !== id
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete Complaint Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete complaint"
      );
    }
  };

  const getStatusClass = (status) => {
    if (status === "pending") return "pending";
    if (status === "in progress") return "progress";
    if (status === "resolved") return "resolved";

    return "default-status";
  };

  const getStatusText = (status) => {
    if (status === "pending") return "Pending";
    if (status === "in progress") return "In Progress";
    if (status === "resolved") return "Resolved";

    return status;
  };

  return (
    <div className="admin-complaints-page">

      {/* HEADER */}
      <header className="complaints-topbar">

        <div className="complaints-brand">
          <div className="complaints-brand-icon">
            🎓
          </div>

          <div>
            <h1>CampusConnect AI</h1>
            <p>Complaint Administration</p>
          </div>
        </div>

        <button
          className="dashboard-btn"
          onClick={() =>
            (window.location.href = "/admin")
          }
        >
          ← Dashboard
        </button>

      </header>

      {/* MAIN */}
      <main className="admin-complaints-main">

        {/* PAGE INTRO */}
        <section className="complaints-intro">

          <div>
            <p className="page-label">
              ADMIN PANEL
            </p>

            <h2>
              All Student Complaints
            </h2>

            <p>
              Review, monitor and manage complaints
              submitted by students.
            </p>
          </div>

          <div className="complaint-count">
            <span>Total</span>
            <strong>
              {complaints.length}
            </strong>
          </div>

        </section>

        {/* LOADING */}
        {loading && (
          <div className="complaints-loading">
            <div className="loading-spinner"></div>
            <p>Loading complaints...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          complaints.length === 0 && (
            <div className="complaints-empty">
              <div className="empty-icon">
                📭
              </div>

              <h3>No Complaints Found</h3>

              <p>
                There are currently no student
                complaints to display.
              </p>
            </div>
          )}

        {/* COMPLAINT GRID */}
        {!loading &&
          complaints.length > 0 && (
            <section className="admin-complaints-grid">

              {complaints.map((complaint) => (
                <article
                  className="admin-complaint-card"
                  key={complaint._id}
                >

                  {/* CARD HEADER */}
                  <div className="complaint-card-header">

                    <div className="complaint-title-wrap">
                      <span className="complaint-category-icon">
                        📢
                      </span>

                      <div>
                        <h3>
                          {complaint.title}
                        </h3>

                        <span className="complaint-id">
                          ID: {complaint._id?.slice(-6)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`complaint-status ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {getStatusText(
                        complaint.status
                      )}
                    </span>

                  </div>

                  {/* STUDENT */}
                  <div className="student-info-box">

                    <div className="box-heading">
                      <span>👨‍🎓</span>
                      Student Information
                    </div>

                    <div className="student-info-grid">

                      <div>
                        <span>Name</span>
                        <strong>
                          {complaint.studentName}
                        </strong>
                      </div>

                      <div>
                        <span>ERP ID</span>
                        <strong>
                          {complaint.erpId}
                        </strong>
                      </div>

                      <div>
                        <span>Course</span>
                        <strong>
                          {complaint.course}
                        </strong>
                      </div>

                      <div>
                        <span>Phone</span>
                        <strong>
                          {complaint.phone}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* COMPLAINT DETAILS */}
                  <div className="complaint-details">

                    <div className="box-heading">
                      <span>📋</span>
                      Complaint Details
                    </div>

                    <div className="detail-row">
                      <span>Category</span>
                      <strong>
                        {complaint.category}
                      </strong>
                    </div>

                    <div className="detail-row">
                      <span>Priority</span>
                      <strong
                        className={`priority-${(
                          complaint.priority || ""
                        ).toLowerCase()}`}
                      >
                        {complaint.priority}
                      </strong>
                    </div>

                    <div className="description-box">
                      <span>Description</span>
                      <p>
                        {complaint.description}
                      </p>
                    </div>

                    <div className="submitted-date">
                      <span>Submitted</span>
                      <strong>
                        {complaint.createdAt
                          ? new Date(
                              complaint.createdAt
                            ).toLocaleString()
                          : "N/A"}
                      </strong>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="complaint-actions">

                    {complaint.status !==
                      "resolved" && (
                      <button
                        className="status-action-btn"
                        onClick={() =>
                          updateStatus(
                            complaint._id
                          )
                        }
                        disabled={
                          updatingId ===
                          complaint._id
                        }
                      >
                        {updatingId ===
                        complaint._id
                          ? "Updating..."
                          : complaint.status ===
                            "pending"
                          ? "Move to In Progress →"
                          : "Mark Resolved ✓"}
                      </button>
                    )}

                    <button
                      className="delete-action-btn"
                      onClick={() =>
                        deleteComplaint(
                          complaint._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>
              ))}

            </section>
          )}

      </main>

      {/* FOOTER */}
      <footer className="complaints-footer">
        <span>CampusConnect AI</span>
        <span>•</span>
        <span>
          Smart Campus Management System
        </span>
      </footer>

    </div>
  );
};

export default AdminComplaints;