import React, { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import "../index.css";

const Account: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [customName, setCustomName] = useState<string | null>(null);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [showLogoutOptions, setShowLogoutOptions] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedName = localStorage.getItem("customName");
    if (savedUser && savedName) {
      setUser(JSON.parse(savedUser));
      setCustomName(savedName);
    }
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const savedName = localStorage.getItem("customName");
      if (!savedName) {
        setShowNameModal(true);
      } else {
        setCustomName(savedName);
      }
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));
      setShowAuthOptions(false);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleNameSubmit = () => {
    if (!nameInput.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    setCustomName(nameInput);
    localStorage.setItem("customName", nameInput);
    setShowNameModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCustomName(null);
      localStorage.removeItem("user");
      setShowLogoutOptions(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) {
      console.error("No user is currently signed in.");
      return;
    }

    try {
      await auth.currentUser.delete();
      setUser(null);
      setCustomName(null);
      localStorage.removeItem("user");
      localStorage.removeItem("customName");
      setShowDeleteModal(false);
      setShowLogoutOptions(false);
      alert("Your account has been deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === "auth/requires-recent-login") {
        alert(
          "Please log in again to delete your account for security reasons."
        );
        try {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          await auth.currentUser?.delete();
          setUser(null);
          setCustomName(null);
          localStorage.removeItem("user");
          localStorage.removeItem("customName");
          setShowDeleteModal(false);
          setShowLogoutOptions(false);

          alert("Your account has been deleted successfully.");
        } catch (secondError) {
          console.error(
            "Error deleting account after reauthentication:",
            secondError
          );
          alert("Unable to delete account. Please try again later.");
        }
      } else {
        alert(
          "An error occurred while deleting the account. Please try again."
        );
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".auth-container")) {
        setShowLogoutOptions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="auth-container">
      {!user ? (
        <div className="auth-wrapper">
          <button
            className="toggle-auth-btn"
            onClick={() => setShowAuthOptions(!showAuthOptions)}
          >
            <img
              src="/assets/icons/ui/account.png"
              alt="Login Icon"
              className="icon"
            />
            Sign Up / Login
          </button>
          <div className={`auth-options ${showAuthOptions ? "visible" : ""}`}>
            <button className="google-login-btn" onClick={handleGoogleLogin}>
              <img
                src="/assets/icons/ui/google.png"
                alt="Google Icon"
                className="icon"
              />
              Google
            </button>
          </div>
        </div>
      ) : (
        <div className="logout-wrapper">
          <button
            className="toggle-auth-btn"
            onClick={() => setShowLogoutOptions(!showLogoutOptions)}
          >
            <img
              src="/assets/icons/ui/account.png"
              alt="Profile Icon"
              className="icon"
            />
            {customName}
          </button>
          <div className={`auth-options ${showLogoutOptions ? "visible" : ""}`}>
            <button
              className="profile-btn"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <button
              className="delete-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
      {showNameModal && (
        <div className="modal-overlay">
          <div className={`modal ${showNameModal ? "visible" : ""}`}>
            <h2 style={{ color: "white", textAlign: "center" }}>
              Choose a Display Name
            </h2>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "90%",
                margin: "10px auto",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #555",
                background: "#333",
                color: "white",
              }}
            />
            <button onClick={handleNameSubmit} className="submit-btn">
              OK
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className={`modal ${showDeleteModal ? "visible" : ""}`}>
            <h2 style={{ color: "white", textAlign: "center" }}>
              Are you sure you want to delete your account?
            </h2>
            <button
              onClick={handleDeleteAccount}
              className="submit-btn"
              style={{ marginRight: "10px" }}
            >
              Yes
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="cancel-btn"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
