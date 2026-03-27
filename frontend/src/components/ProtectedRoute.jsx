import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);

  const allowedRolesStr = allowedRoles ? allowedRoles.join(',') : '';

  useEffect(() => {
    let isMounted = true;
    const getLoginRoute = () => (location.pathname.startsWith('/client') ? '/client' : '/admin');
    const redirectToLogin = () => {
      const loginRoute = getLoginRoute();
      if (location.pathname !== loginRoute && location.pathname !== '/') {
        navigate(loginRoute, { replace: true });
      }
    };
    
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr || userStr === "undefined" || userStr === "null") {
        localStorage.clear();
        if (isMounted) setIsVerified(false);
        redirectToLogin();
        return;
      }

      let userData;
      try {
        userData = typeof userStr === "string" ? JSON.parse(userStr) : userStr;
      } catch {
        console.error("Authentication guard: Failed to parse user data, redirecting.");
        localStorage.clear();
        if (isMounted) setIsVerified(false);
        redirectToLogin();
        return;
      }
      
      if (allowedRoles && !allowedRoles.includes(userData.role)) {
         const targetRoute = userData.role === 'client' ? '/client/dashboard' : '/dashboard';
         if (location.pathname !== targetRoute) {
             navigate(targetRoute, { replace: true });
         }
         return;
      }

      try {
        await axios.get(`${API_BASE_URL}/api/protected`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (isMounted) setIsVerified(true);
      } catch (err) {
        console.error("Authentication failed:", err);
        localStorage.clear();
        if (isMounted) setIsVerified(false);
        redirectToLogin();
      }
    };

    verifyAuth();
    
    return () => { 
      isMounted = false; 
    };
  }, [navigate, location.pathname, allowedRolesStr]);

  return isVerified ? children : null;
};

export default ProtectedRoute;