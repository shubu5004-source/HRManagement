import axios from "../api/axiosInstance";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ added
import "./Profile.css";

function UserProfile() {
  const navigate = useNavigate();   // ✅ added

  const [profile, setProfile] = useState({
    fullName: "",
    address: "",
    phoneNumber: ""
  });

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  // 🔹 Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/user/profile");

        setProfile({
          fullName: res.data.fullName || "",
          address: res.data.address || "",
          phoneNumber: res.data.phoneNumber || ""
        });

      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Update Profile
  const updateProfile = async () => {
    setError("");
    setProfileMessage("");

    if (!profile.fullName || !profile.address || !profile.phoneNumber) {
      setError("All profile fields are required");
      return;
    }

    try {
      await axios.put("/user/profile", profile);

      setProfileMessage("Profile updated successfully");

      // ✅ Redirect after 2 seconds
      setTimeout(() => {
        navigate("/user");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.title || "Error updating profile");
    }
  };

  // 🔹 Change Password
  const changePassword = async () => {
    setError("");
    setPasswordMessage("");

    if (!password.oldPassword || !password.newPassword) {
      setError("Both password fields are required");
      return;
    }

    try {
      await axios.put("/user/change-password", password);

      setPasswordMessage("Password changed successfully");

      setPassword({
        oldPassword: "",
        newPassword: ""
      });

    } catch (err) {
      setError(err.response?.data?.title || "Error changing password");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h3>Loading profile...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h2>Edit Profile</h2>

        {error && <div className="error-message">{error}</div>}
        {profileMessage && (
          <div className="success-message">{profileMessage}</div>
        )}

        <input
          placeholder="Full Name"
          value={profile.fullName}
          onChange={e =>
            setProfile({ ...profile, fullName: e.target.value })
          }
        />

        <input
          placeholder="Address"
          value={profile.address}
          onChange={e =>
            setProfile({ ...profile, address: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={profile.phoneNumber}
          onChange={e =>
            setProfile({ ...profile, phoneNumber: e.target.value })
          }
        />

        <button className="save-btn" onClick={updateProfile}>
          Save
        </button>

        <hr />

        <h2>Change Password</h2>

        {passwordMessage && (
          <div className="success-message">{passwordMessage}</div>
        )}

        <input
          type="password"
          placeholder="Old Password"
          value={password.oldPassword}
          onChange={e =>
            setPassword({ ...password, oldPassword: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={password.newPassword}
          onChange={e =>
            setPassword({ ...password, newPassword: e.target.value })
          }
        />

        <button className="save-btn" onClick={changePassword}>
          Change Password
        </button>

      </div>
    </div>
  );
}

export default UserProfile;
