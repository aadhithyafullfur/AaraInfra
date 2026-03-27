import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerUser } from "../utility/api";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, CreditCard, CheckCircle } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm();
  const [signupMessage, setSignupMessage] = useState("");
  const [signupMessageColor, setSignupMessageColor] = useState("green");
  const navigate = useNavigate();

  const password = watch("password");

  const onSignUp = async (data) => {
    setSignupMessage("");
    try {
      const signupData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
      };

      await registerUser(signupData);

      setSignupMessage("Registration successful! Redirecting...");
      setSignupMessageColor("green");

      setTimeout(() => {
        navigate("/");
      }, 2000);

      reset();
    } catch (error) {
      setSignupMessage(error || "Registration failed. Please try again.");
      setSignupMessageColor("red");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="flex w-full max-w-5xl h-[700px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mx-4 border border-gray-200 dark:border-gray-700">

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
              Join <span className="text-accent-300">AaraInfraa</span>
            </h1>
            <p className="text-lg text-blue-100 font-light max-w-sm mx-auto leading-relaxed">
              Create an account to start managing your consultancy projects with elegance and efficiency.
            </p>
          </div>
        </div>

        {/* Right Panel - SignUp Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-gray-800 relative">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Create Account</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Join us today! It takes less than a minute.</p>
            </div>

            <form onSubmit={handleSubmit(onSignUp)} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Min 2 characters",
                      },
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="email"
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

              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Phone Number</label>
                <div className="relative group">
                  {/* Reuse User icon or another icon since we might not have Phone imported */}
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors flex items-center justify-center font-bold">#</div>
                  <input
                    type="text"
                    {...register("phone", {
                      required: "Phone is required"
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="1234567890"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Address Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Address</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors flex items-center justify-center font-bold">@</div>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Address is required"
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="123 Street Name"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.address.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="password"
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

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Confirm Password</label>
                <div className="relative group">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign Up <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {signupMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm text-center ${signupMessageColor === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}
                >
                  {signupMessage}
                </motion.div>
              )}
            </form>

            <div className="pt-4 text-center border-t border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/")}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold hover:underline transition-all"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
