import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Institutions from "./pages/Institutions";
import Insurance from "./pages/Insurance";
import VisaService from "./pages/VisaService";
import Accommodation from "./pages/Accommodation";
import SkillAssessment from "./pages/SkillAssessment";
import Popup from "./pages/Popup";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

function App() {
return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#363636",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <PrivateRoute>
                  <Institutions />
                </PrivateRoute>
              }
            />
            <Route
              path="institutions"
              element={
                <PrivateRoute>
                  <Institutions />
                </PrivateRoute>
              }
            />
            <Route
              path="insurance"
              element={
                <PrivateRoute>
                  <Insurance />
                </PrivateRoute>
              }
            />
            <Route
              path="visa-service"
              element={
                <PrivateRoute>
                  <VisaService />
                </PrivateRoute>
              }
            />
            <Route
              path="accommodation"
              element={
                <PrivateRoute>
                  <Accommodation />
                </PrivateRoute>
              }
            />
            <Route
              path="skill-assessment"
              element={
                <PrivateRoute>
                  <SkillAssessment />
                </PrivateRoute>
              }
            />
            <Route
              path="popup"
              element={
                <PrivateRoute>
                  <Popup />
                </PrivateRoute>
              }
            />
            <Route
              path="contact-us"
              element={
                <PrivateRoute>
                  <ContactUs />
                </PrivateRoute>
              }
            />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
