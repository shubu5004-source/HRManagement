import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

function AdminUserSearch() {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [users, setUsers] = useState([]);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [departments, setDepartments] = useState([]);

  /* 🔹 FETCH DEPARTMENTS */
  useEffect(() => {
    axios.get("/departments").then(res => setDepartments(res.data));
  }, []);

  /* 🔹 REAL-TIME NAME SUGGESTIONS (FAST – 300ms) */
  useEffect(() => {
    if (name.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      axios
        .get("/admin/users/suggestions", {
          params: { query: name }
        })
        .then(res => {
          setSuggestions(res.data);
          setShowSuggestions(true);
        });
    }, 300); // 👈 FAST suggestions

    return () => clearTimeout(timer);
  }, [name]);

  /* 🔥 AUTO SEARCH AFTER USER STOPS TYPING (3 SECONDS) */
  useEffect(() => {
    if (name.trim() === "") {
      setUsers([]);
      return;
    }

    const timer = setTimeout(() => {
      axios
        .get("/admin/users/search", {
          params: {
            name,
            departmentId: departmentId || null
          }
        })
        .then(res => {
          setUsers(res.data);
          setShowSuggestions(false);
        });
    }, 100); // 👈 1 SECONDS DELAY

    return () => clearTimeout(timer);
  }, [name, departmentId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Users</h2>

      {/* 🔎 SEARCH CONTROLS */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {/* NAME INPUT */}
        <div style={{ position: "relative", width: "250px" }}>
          <input
            placeholder="Search by name"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
          />

          {/* 🔽 AUTOCOMPLETE DROPDOWN */}
        {showSuggestions && suggestions.length > 0 && users.length === 0 && (
          <ul
            style={{
              position: "absolute",
              top: "38px",
              left: 0,
              right: 0,
              background: "white",
              border: "1px solid #ccc",
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxHeight: "150px",
              overflowY: "auto",
              zIndex: 10
            }}
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                style={{
                  padding: "8px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  setName(s);
                  setShowSuggestions(false);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        </div>

        {/* DEPARTMENT FILTER */}
        <select
          value={departmentId}
          onChange={e => setDepartmentId(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>
              {d.departmentName}
            </option>
          ))}
        </select>
      </div>

      <br />

      {/* 📋 SEARCH RESULTS */}
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" align="center">
                No results
              </td>
            </tr>
          ) : (
            users.map(u => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.departmentName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserSearch;
