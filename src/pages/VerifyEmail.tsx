import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Shield, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { toast } from "../lib/toast";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyEmail({ email, otp });
      toast.success("Email verified successfully! Redirecting...");
      setTimeout(() => navigate("/institutions", { replace: true }), 1500);
    } catch (err: any) {
      toast.error(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      await authService.resendOTP({ email, type: "registration" });
      toast.success("Verification code sent! Please check your email.");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to resend code.";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No email provided</p>
          <Link to="/register" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Go to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-green-500 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="mt-2 text-gray-600">We've sent a verification code to</p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center">
              Check your inbox for the 6-digit code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>

              <Button type="submit" disabled={isLoading || otp.length !== 6} className="w-full">
                {isLoading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify Email
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm text-gray-600">
              <p>
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="font-medium text-blue-600 hover:text-blue-700 disabled:text-blue-400"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </p>
              <p>
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                  Back to Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
