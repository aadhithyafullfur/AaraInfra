import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginUser } from "../utility/api";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword";
import { ArrowRight, Lock, Mail, CreditCard } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();
  const [loginMessage, setLoginMessage] = useState("");
  const [loginMessageColor, setLoginMessageColor] = useState("green");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const onLogin = async (data) => {
    setLoginMessage("");
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };

      const response = await loginUser(loginData);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000);

      setLoginMessage("Login successful!");
      setLoginMessageColor("green");

      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (response.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (error) {
      setLoginMessage(error || "Invalid email or password.");
      setLoginMessageColor("red");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="flex w-full max-w-5xl h-[650px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mx-4 border border-gray-200 dark:border-gray-700">

        {/* Left Panel - Hero Section */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-primary-600 to-indigo-700 items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center text-white space-y-6">
            <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl inline-block shadow-lg mb-4">
              <CreditCard className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">
              Aara<span className="text-accent-300">Infraa</span>
            </h1>
            <p className="text-lg text-blue-100 font-light max-w-sm mx-auto leading-relaxed">
              Experience the next generation of consultancy management. Premium, secure, and efficient.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-gray-800 relative">
          <div className="max-w-md mx-auto w-full space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Welcome Back</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Please enter your credentials to sign in.</p>
            </div>

            <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      autoComplete="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email format",
                        },
                      })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                      placeholder="you@company.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="password"
                      autoComplete="current-password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Min 6 characters",
                        },
                      })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {loginMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm text-center ${loginMessageColor === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}
                >
                  {loginMessage}
                </motion.div>
              )}
            </form>

            <div className="pt-6 text-center border-t border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold hover:underline transition-all"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
}
