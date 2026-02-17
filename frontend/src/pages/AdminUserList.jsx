import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const navigate = useNavigate();

  const totalPages = Math.ceil(totalUsers / pageSize);

  const loadUsers = async (page) => {
    try {
      const res = await axios.get("/admin/users", {
        params: {
          pageNumber: page,
          pageSize: pageSize
        }
      });

      setUsers(res.data.users);
      setTotalUsers(res.data.totalUsers);
    } catch {
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  return (
    <div>
      <h2>All Users</h2>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.departmentName}</td>

              <td>
                <button onClick={() => navigate(`/admin/edit/${u.id}`)}>
                  Edit
                </button>
              </td>

              <td>
                <button
                  style={{ color: "red" }}
                  onClick={() => alert("Soft delete already implemented")}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔢 PAGINATION CONTROLS */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminUserList;
