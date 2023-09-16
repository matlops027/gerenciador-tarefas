import { useState, useEffect } from "react";
import { auth } from "../firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { USER_KEY } from "../constants";
import { Navigate } from "react-router-dom";

function Private({ children }) {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);

  async function checkLogin() {
    const unsub = await onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        setSigned(true);
      } else {
        setSigned(false);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    checkLogin();
  }, []);

  if (loading) {
    return <div></div>;
  }

  if (!signed) {
    return <Navigate to={"/"} />;
  }

  return children;
}

export default Private;
