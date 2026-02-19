// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import "./App.css";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminDashboard from "./pages/AdminDashboard";
// import UserDashboard from "./pages/UserDashboard";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import AdminUserSearch from "./pages/AdminUserSearch";
// import UserProfile from "./pages/UserProfile";
// import AdminUserList from "./pages/AdminUserList";
// import AdminEditUserPage from "./pages/AdminEditUserPage";


// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />

//       <div className="main-content">
//         <Routes>
//           <Route path="/" element={<Login />} />

//           <Route
//             path="/register"
//             element={
//               <ProtectedRoute role="Admin">
//                 <Register />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute role="Admin">
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//             <Route
//             path="/admin/edit/:id"
//             element={
//               <ProtectedRoute role="Admin">
//                 <AdminEditUserPage/>
//               </ProtectedRoute>
//             }
//           />


//           <Route
//             path="/admin/all-users"
//             element={
//               <ProtectedRoute role="Admin">
//                 <AdminUserList />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin/users"
//             element={
//               <ProtectedRoute role="Admin">
//                 <AdminUserSearch />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute role="User">
//                 <UserProfile />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/user"
//             element={
//               <ProtectedRoute role="User">
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }



// export default App;


import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminUserSearch from "./pages/AdminUserSearch";
import UserProfile from "./pages/UserProfile";
import AdminUserList from "./pages/AdminUserList";
import AdminEditUserPage from "./pages/AdminEditUserPage";
import AdminNotifications from "./pages/AdminNotifications";


/* 👇 Separate component because useLocation must be inside Router */
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
      <Navbar />

      {/* Remove margin on login page */}
      <div className={isLoginPage ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/register"
            element={
              <ProtectedRoute role="Admin">
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute role="Admin">
                <AdminNotifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute role="User">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute role="Admin">
                <AdminEditUserPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/all-users"
            element={
              <ProtectedRoute role="Admin">
                <AdminUserList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="Admin">
                <AdminUserSearch />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute role="User">
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user"
            element={
              <ProtectedRoute role="User">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
