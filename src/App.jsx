import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  loginUser,
  auth,
  deleteUserFromGroups,
  handleDeleteCurrentUser,
} from "./firebase";
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDelete = async (email, password) => {
    if (email != "" && password != "") {
      const loginResult = await loginUser(email, password);
      if (loginResult != null) {
        setUser(loginResult.uid);
        const deleteGroupsResult = await deleteUserFromGroups(loginResult.uid);
        if (!deleteGroupsResult) {
          setSuccess(false);
          setError(
            "Failed to delete user from their groups. Please contact administrator."
          );
        } else {
          const deleteUserResult = await handleDeleteCurrentUser();
          if (!deleteUserResult) {
            setError("Could not delete the user. Please contact administrator");
            setSuccess(false);
          } else {
            setError("");
            setSuccess(true);
          }
        }
      }
    } else {
      setError("Incorrect login information. Please try again!");
      setSuccess(false);
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="header-container">
          <h1 id="title">Group Study De-Activate Account</h1>
          <p className="font-text">
            Sorry to see you go! If you'd like to deactivate your Group Study
            account, please fill out the form below and we'll deactivate it for
            you.
          </p>
        </div>
        <div className="form-container">
          <form className="login-form font-text">
            <div className="sub-container login-form">
              <label className="form-label">Enter your email:</label>
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              ></input>
            </div>
            <div className="sub-container login-form">
              <label className="form-label">Enter your password:</label>
              <input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              ></input>
            </div>

            <button
              id="submit"
              onClick={(e) => {
                e.preventDefault();
                handleDelete(email, password);
              }}
            >
              Delete Account
            </button>
          </form>
        </div>
        {!success && error != "" && <p className="error-text">{error}</p>}
        {success && error == "" && (
          <p className="success-text">
            Your account has successfully been deleted!
          </p>
        )}
      </div>
    </>
  );
}

export default App;
