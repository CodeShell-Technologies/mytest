import React, { useState, useRef, useEffect } from "react";
import alminoLogo from "../../app/assets/signin-img-removebg-preview.png";
import alminoBrand from "../../app/assets/Almino structural consultancy_Final.png";
import { IoIosArrowRoundForward } from "react-icons/io";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { BASE_URL } from "~/constants/api";
import { useAuthStore } from "src/stores/authStore";
import { useNavigate } from "react-router";

const FloatingInput = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  showPasswordToggle = false,
  onTogglePassword,
}: {
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValue = value.length > 0;
  const shouldFloatLabel = isFocused || hasValue;

  return (
    <div className="relative mt-6">
      <input
        id={id}
        ref={inputRef}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-transparent border-2 rounded-lg outline-none transition-all duration-200 ${
          disabled
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-gray-400 hover:border-gray-500 focus:border-red-700"
        } ${showPasswordToggle ? "pr-10" : ""}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 px-1 bg-white dark:bg-gray-900 transition-all duration-200 pointer-events-none ${
          shouldFloatLabel
            ? "text-red-700 dark:text-red-800 text-sm -translate-y-6"
            : "text-gray-500 text-base translate-y-0"
        } ${disabled ? "text-gray-400" : ""}`}
      >
        {label}
        {required && <span className="text-red-700 ml-1">*</span>}
      </label>
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={type === "password" ? "Show password" : "Hide password"}
        >
          {type === "password" ? (
            <AiFillEye size={20} />
          ) : (
            <AiFillEyeInvisible size={20} />
          )}
        </button>
      )}
    </div>
  );
};
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const setAuthData = useAuthStore((state) => state.setAuthData);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVibrating && buttonRef.current) {
      buttonRef.current.classList.add("animate-vibrate");
      const timer = setTimeout(() => {
        buttonRef.current?.classList.remove("animate-vibrate");
        setIsVibrating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVibrating]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setIsLoading(true);

  //   try {
  //     const response = await axios.post(`${BASE_URL}/users/login`, formData);
  //     if (response?.status === 201) {
  //       setAuthData({
  //         branchcode: response?.data?.data[0].branchcode,
  //         staff_id: response?.data.data[0].staff_id,
  //         accessToken: response.data.token.accessToken,
  //         refreshToken: response.data.token.refreshToken,
  //         isActive: response.data.data[0]?.status,
  //         permissions: response.data.roleAccess,
  //         role: response.data.data[0].role,
  //       });

          

  //       navigate("/");
  //     }
  //   } catch (error: any) {
  //     console.error("Login error:", error?.response?.data?.error);
  //     setError(
  //       error?.response?.data?.error || "Login failed. Please try again."
  //     );
  //     setIsVibrating(true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    const response = await axios.post(`${BASE_URL}/users/login`, formData);

    if (response?.status === 201) {
      const userData = response.data.data[0];
      const { accessToken, refreshToken } = response.data.token; // destructure tokens

      // Set auth state (accessToken is string, safe to render)
      setAuthData({
        branchcode: userData.branchcode,
        staff_id: userData.staff_id,
        accessToken: accessToken, // string
        isActive: userData.status,
        permissions: response.data.roleAccess,
        role: userData.role,
      });

      // Store tokens in localStorage for persistence
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userData.staff_id);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("brcode", userData.branchcode);

      navigate("/"); // redirect to dashboard/home
    }
  } catch (error: any) {
    console.error("Login error:", error?.response?.data?.error);
    setError(error?.response?.data?.error || "Login failed. Please try again.");
    setIsVibrating(true);
  } finally {
    setIsLoading(false);
  }
};



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full bg-gray-100 dark:bg-gray-100 relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-700"></div>
            <p className="mt-4 text-gray-500">Authenticating...</p>
          </div>
        </div>
      )}

      <div className="hidden sm:block">
        <img
          className="w-[600PX] h-[400PX] object-cover mt-[100px]"
          src={alminoLogo}
          alt="Almino Logo"
        />
      </div>
      <div className="bg-white dark:bg-gray-900 flex flex-col justify-center">
        <div className="w-full mx-auto flex justify-center">
          <img
            src={alminoBrand}
            className="w-[100px] h-[100px]"
            alt="Almino Brand"
          />
        </div>
        <form
          className="max-w-[400px] w-full mx-auto bg-white dark:bg-transparent p-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-transparent text-3xl font-bold text-center py-3 gradient-text">
            Welcome Admin!
          </h2>
          {/* <div className="flex flex-col gap-6">
            <div className="flex flex-col py-2 text-left mt-1">
              <label className="relative">
                <input
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  type="email"
                  required
                  className="px-4 py-2 w-full outline-none border-2 border-gray-400 rounded hover:border-gray-300 duration-200 peer focus:border-gray-400 bg-inherit"
                  disabled={isLoading}
                />
                <span className="absolute left-0 top-2 px-1 text-lg tracking-wise peer-focus:text-red-700 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 text-gray-400 bg-white ml-2 dark:bg-gray-900 peer-valid:text-sm peer-valid:-translate-y-5">
                  User Email:
                </span>
              </label>
            </div>

            <div className="flex flex-col py-2 text-left mt-1 relative">
              <label className="relative">
                <input
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  type={showPassword ? "text" : "password"}
                  required
                  className="px-4 py-2 w-full outline-none border-2 border-gray-400 rounded hover:border-gray-300 duration-200 peer focus:border-gray-400 bg-inherit pr-10"
                  disabled={isLoading}
                />
                <span className="absolute left-0 top-2 px-1 text-lg tracking-wise peer-focus:text-red-700 pointer-events-none duration-200 peer-focus:text-sm peer-focus:-translate-y-5 text-gray-400 bg-white ml-2 dark:bg-gray-900 peer-valid:text-sm peer-valid:-translate-y-5">
                  Password
                </span>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-2 animate-pulse">{error}</p>
            )}
          </div>
          <button
            ref={buttonRef}
            type="submit"
            disabled={isLoading}
            className={`border w-full my-5 text-gray-300 py-2 bg-red-700 hover:bg-red-700/80 dark:bg-red-700/80 border-none dark:hover:bg-red-700/70 rounded transition-transform ${
              isVibrating ? "animate-vibrate" : ""
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            Sign In <IoIosArrowRoundForward className="inline" size={25} />
          </button> */}
          <div className="flex flex-col gap-6">
            <FloatingInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              label="User Email"
              required
              disabled={isLoading}
            />

            <FloatingInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              label="Password"
              required
              disabled={isLoading}
              showPasswordToggle
              onTogglePassword={togglePasswordVisibility}
            />

            {error && (
              <div className="text-sm text-red-500 mb-2 animate-pulse">
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full my-5 py-3 text-white bg-red-700 hover:bg-red-800 rounded-lg transition-all ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {/* {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : ( */}
            Sign In <IoIosArrowRoundForward className="inline" size={25} />
          </button>
        </form>
      </div>

      {/* Add this to your global CSS or CSS-in-JS */}
      <style jsx global>{`
        @keyframes vibrate {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-5px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-vibrate {
          animation: vibrate 0.1s linear;
        }
      `}</style>
    </div>
  );
}

export default Login;
