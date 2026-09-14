import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./LostFound.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://192.168.31.197:5000";

const ENDPOINT =
  `${API_BASE_URL}/api/lostfound`;

function LostFound() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [erpId, setErpId] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Lost");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [items, setItems] = useState([]);
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
  // LOAD ITEMS
  // ==========================================

  const loadItems = async () => {
    try {
      const response = await axios.get(ENDPOINT);

      setItems(response.data || []);
    } catch (error) {
      console.error(
        "Fetch Lost & Found Error:",
        error
      );
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // ==========================================
  // SUBMIT ITEM
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !studentName ||
      !erpId ||
      !phone ||
      !course ||
      !title ||
      !location ||
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

      const formData = new FormData();

      formData.append(
        "studentName",
        studentName
      );

      formData.append(
        "erpId",
        erpId.toUpperCase()
      );

      formData.append(
        "phone",
        phone
      );

      formData.append(
        "course",
        course
      );

      formData.append(
        "title",
        title
      );

      formData.append(
        "type",
        type
      );

      formData.append(
        "location",
        location
      );

      formData.append(
        "description",
        description
      );

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      const response = await axios.post(
        `${ENDPOINT}/create`,
        formData
      );

      if (response.data.success) {
        alert(
          "Lost & Found item submitted successfully!"
        );

        setPhone("");
        setCourse("");
        setTitle("");
        setType("Lost");
        setLocation("");
        setDescription("");
        setImage(null);

        const fileInput =
          document.getElementById("itemImage");

        if (fileInput) {
          fileInput.value = "";
        }

        loadItems();
      }
    } catch (error) {
      console.error(
        "Create Lost & Found Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to submit Lost & Found item"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredItems =
    items.filter((item) => {
      if (filter === "ALL") {
        return true;
      }

      if (filter === "LOST") {
        return item.type === "Lost";
      }

      if (filter === "FOUND") {
        return item.type === "Found";
      }

      if (filter === "CLAIMED") {
        return item.status === "Claimed";
      }

      return true;
    });

  // ==========================================
  // COUNTS
  // ==========================================

  const lostCount =
    items.filter(
      (item) => item.type === "Lost"
    ).length;

  const foundCount =
    items.filter(
      (item) => item.type === "Found"
    ).length;

  const claimedCount =
    items.filter(
      (item) => item.status === "Claimed"
    ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="lost-found-page">

      {/* HEADER */}

      <div className="lost-found-header">
        <h1>
          Lost & Found Portal 🔍
        </h1>

        <h2>
          Report Lost / Found Item
        </h2>
      </div>

      {/* FORM */}

      <form
        className="lost-found-form"
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
            Item Title *
          </label>

          <input
            type="text"
            placeholder="e.g. Black Wallet"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label>
              Type *
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="Lost">
                Lost
              </option>

              <option value="Found">
                Found
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Location *
            </label>

            <input
              type="text"
              placeholder="Where was it lost/found?"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />
          </div>

        </div>

        <div className="form-group">
          <label>
            Description *
          </label>

          <textarea
            rows="4"
            placeholder="Describe the item in detail..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label>
            Item Image
          </label>

          <input
            id="itemImage"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
          />
        </div>

        <button
          type="submit"
          className="submit-lost-found"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Lost & Found 📤"}
        </button>

      </form>

      {/* FILTERS */}

      <div className="lost-found-filters">

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
          ALL ({items.length})
        </button>

        <button
          className={
            filter === "LOST"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("LOST")
          }
        >
          Lost ({lostCount})
        </button>

        <button
          className={
            filter === "FOUND"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("FOUND")
          }
        >
          Found ({foundCount})
        </button>

        <button
          className={
            filter === "CLAIMED"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("CLAIMED")
          }
        >
          Claimed ({claimedCount})
        </button>

      </div>

      {/* ITEMS */}

      <div className="lost-found-grid">

        {filteredItems.length === 0 ? (

          <p className="no-items">
            No items found
          </p>

        ) : (

          filteredItems.map(
            (item) => (

              <div
                className="lost-found-card"
                key={item._id}
              >

                {item.image && (
                  <img
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.title}
                    className="item-image"
                  />
                )}

                <h3>
                  {item.title}
                </h3>

                <p>
                  <strong>
                    Type:
                  </strong>{" "}
                  {item.type}
                </p>

                <p>
                  <strong>
                    Student:
                  </strong>{" "}
                  {item.studentName}
                </p>

                <p>
                  <strong>
                    ERP ID:
                  </strong>{" "}
                  {item.erpId}
                </p>

                <p>
                  <strong>
                    Course:
                  </strong>{" "}
                  {item.course}
                </p>

                <p>
                  <strong>
                    Location:
                  </strong>{" "}
                  {item.location}
                </p>

                <p>
                  <strong>
                    Description:
                  </strong>{" "}
                  {item.description}
                </p>

                {item.createdAt && (
                  <p>
                    <strong>
                      Submitted:
                    </strong>{" "}
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </p>
                )}

                <span
                  className={
                    item.status === "Claimed"
                      ? "status claimed"
                      : "status open"
                  }
                >
                  {item.status}
                </span>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}

export default LostFound;