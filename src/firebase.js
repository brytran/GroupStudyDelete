import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get, child, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBVwiyd2h_xxDu21pDa3BPRqEL-M5Aco3Y",
  authDomain: "group-study-45f82.firebaseapp.com",
  databaseURL: "https://group-study-45f82-default-rtdb.firebaseio.com",
  projectId: "group-study-45f82",
  storageBucket: "group-study-45f82.firebasestorage.app",
  messagingSenderId: "593904627326",
  appId: "1:593904627326:web:5fab9b13b9b9335ece322f",
  measurementId: "G-W2TCW31LWC",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user; // The logged-in user
    console.log("Login successful:", user);
    return user;
  } catch (error) {
    console.error("Login error:", error.message);
    return null;
  }
}

async function deleteUserFromGroups(uid) {
  const userRef = ref(database, "groups/");

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key; // Key of the child
        const dataRef = ref(database, `groups/${childKey}`);
        // Get the users array
        let users = childSnapshot.child("users").val();

        if (users != null && users.includes(uid)) {
          // Create a new array with the user removed
          const result = users.filter((item) => item !== uid);
          update(dataRef, { users: result })
            .then(() => {
              console.log("User removed and data updated successfully");
            })
            .catch((error) => {
              console.error("Error updating data:", error);
              return false;
            });
        }
      });

      return true;
    } else {
      console.log("No data available");
      return true;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
}

async function handleDeleteCurrentUser() {
  const user = auth.currentUser;
  if (user) {
    try {
      await deleteUser(user);
      console.log("User deleted successfully.");
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  } else {
    console.error("No user is signed in.");
    return false;
  }
}

export { loginUser, auth, deleteUserFromGroups, handleDeleteCurrentUser };
