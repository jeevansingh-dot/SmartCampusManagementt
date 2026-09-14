import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Complaint.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://192.168.31.197:5000";

const ENDPOINT =
  `${API_BASE_URL}/api/complaints`;

function Complaint() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [erpId, setErpId] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Academic");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");

  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/");
        return;
      }

      const user = JSON.parse(storedUser);

      setStudentName(user.name || "");
      setErpId(user.erpId || "");
    } catch (error) {
      console.error("User Data Error:", error);
      navigate("/");
    }
  }, [navigate]);

  // ==========================================
  // LOAD STUDENT COMPLAINTS
  // ==========================================

  const loadComplaints = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setComplaints([]);
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.erpId) {
        setComplaints([]);
        return;
      }

      const response = await axios.get(
        `${ENDPOINT}/erp/${user.erpId}`
      );

      if (response.data.success) {
        setComplaints(
          response.data.complaints || []
        );
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error(
        "Fetch Complaints Error:",
        error
      );
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // ==========================================
  // SUBMIT COMPLAINT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !studentName ||
      !erpId ||
      !phone ||
      !course ||
      !title ||
      !description
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert(
        "Please enter a valid 10-digit phone number"
      );
      return;
    }

    try {
      setLoading(true);

      const complaintData = {
        studentName: studentName,
        erpId: erpId.toUpperCase(),
        phone: phone,
        course: course,
        title: title,
        category: category,
        priority: priority,
        description: description,
      };

      const response = await axios.post(
        ENDPOINT,
        complaintData
      );

      if (response.data.success) {
        alert(
          "Complaint submitted successfully!"
        );

        setPhone("");
        setCourse("");
        setTitle("");
        setCategory("Academic");
        setPriority("Medium");
        setDescription("");

        loadComplaints();
      }
    } catch (error) {
      console.error(
        "Create Complaint Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredComplaints =
    complaints.filter((complaint) => {
      if (filter === "ALL") {
        return true;
      }

      if (filter === "PENDING") {
        return complaint.status === "pending";
      }

      if (filter === "PROGRESS") {
        return complaint.status === "in progress";
      }

      if (filter === "RESOLVED") {
        return complaint.status === "resolved";
      }

      return true;
    });

  // ==========================================
  // COUNTS
  // ==========================================

  const pendingCount =
    complaints.filter(
      (c) => c.status === "pending"
    ).length;

  const progressCount =
    complaints.filter(
      (c) => c.status === "in progress"
    ).length;

  const resolvedCount =
    complaints.filter(
      (c) => c.status === "resolved"
    ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="complaint-page">

      {/* HEADER */}

      <div className="complaint-header">
        <h1>
          Student Complaint Portal 📣
        </h1>

        <h2>
          Raise a Complaint
        </h2>
      </div>

      {/* FORM */}

      <form
        className="complaint-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label>
            Student Name *
          </label>

          <input
            type="text"
            placeholder="Your name"
            value={studentName}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>
            ERP ID *
          </label>

          <input
            type="text"
            placeholder="Your ERP ID"
            value={erpId}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>
            Phone Number *
          </label>

          <input
            type="text"
            maxLength="10"
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
          />
        </div>

        <div className="form-group">
          <label>
            Course *
          </label>

          <input
            type="text"
            placeholder="e.g. B.Tech CSE"
            value={course}
            onChange={(e) =>
              setCourse(e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>
            Complaint Title *
          </label>

          <input
            type="text"
            placeholder="Enter complaint title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="Academic">
                Academic
              </option>

              <option value="Infrastructure">
                Infrastructure
              </option>

              <option value="Hostel">
                Hostel
              </option>

              <option value="Transport">
                Transport
              </option>

              <option value="Library">
                Library
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >
              <option value="Low">
                🟢 Low Priority
              </option>

              <option value="Medium">
                🟡 Medium Priority
              </option>

              <option value="High">
                🔴 High Priority
              </option>
            </select>
          </div>

        </div>

        <div className="form-group">
          <label>
            Describe your complaint *
          </label>

          <textarea
            rows="4"
            placeholder="Describe your complaint..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className="submit-complaint"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Complaint 📢"}
        </button>

      </form>

      {/* FILTERS */}

      <div className="complaint-filters">

        <button
          className={
            filter === "ALL"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("ALL")
          }
        >
          ALL ({complaints.length})
        </button>

        <button
          className={
            filter === "PENDING"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("PENDING")
          }
        >
          Pending ({pendingCount})
        </button>

        <button
          className={
            filter === "PROGRESS"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("PROGRESS")
          }
        >
          In Progress ({progressCount})
        </button>

        <button
          className={
            filter === "RESOLVED"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("RESOLVED")
          }
        >
          Resolved ({resolvedCount})
        </button>

      </div>

      {/* COMPLAINTS */}

      <div className="complaint-grid">

        {filteredComplaints.length === 0 ? (

          <p className="no-complaints">
            No complaints found
          </p>

        ) : (

          filteredComplaints.map(
            (complaint) => (

              <div
                className="complaint-card"
                key={complaint._id}
              >

                <h3>
                  {complaint.title}
                </h3>

                <p>
                  <strong>
                    Category:
                  </strong>{" "}
                  {complaint.category}
                </p>

                <p>
                  <strong>
                    Priority:
                  </strong>{" "}
                  {complaint.priority}
                </p>

                <p>
                  <strong>
                    Description:
                  </strong>{" "}
                  {complaint.description}
                </p>

                {complaint.createdAt && (
                  <p>
                    <strong>
                      Submitted:
                    </strong>{" "}
                    {new Date(
                      complaint.createdAt
                    ).toLocaleString()}
                  </p>
                )}

                <span
                  className={`complaint-status ${
                    complaint.status.replace(
                      " ",
                      "-"
                    )
                  }`}
                >
                  {complaint.status}
                </span>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}

export default Complaint;