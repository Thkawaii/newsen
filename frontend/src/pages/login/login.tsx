import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../services/https/Authen/authen";
import "./Login.css";
import { message } from "antd";
import logo from "../../assets/logo1.png";
import background from "../../assets/bg3.png";
import { SignInInterface } from "../../interfaces/Signln";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // State management for form inputs
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const values: SignInInterface = { email, password };
      const res = await SignIn(values);

      if (res.status === 200) {
        messageApi.success(`Welcome back, ${res.data.role}!`);

        // Save login data to localStorage
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("token_type", res.data.token_type || "");
        localStorage.setItem("token", res.data.token || "");
        localStorage.setItem("id", res.data.id || "");
        localStorage.setItem("role", res.data.role || "");

        console.log("JWT Token:", res.data);
        console.log("User Role:", res.data.role);

        // Redirect based on role
        switch (res.data.role) {
          case "Admin":
          case "Employee":
            navigate("/dashboard");
            break;
          case "Driver":
            navigate("/dashboards");
            break;
          case "Passenger":
            navigate("/home");
            break;
          default:
            messageApi.error("Unauthorized role");
        }
      } else {
        messageApi.error("Login failed. Please check your email or password.");
        console.error("API Response Error:", res);
        setErrorMessage("ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบอีเมลหรือรหัสผ่าน");
      }
    } catch (error) {
      messageApi.error("An error occurred while signing in");
      console.error("Error during sign-in:", error);
      setErrorMessage("ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบอีเมลหรือรหัสผ่าน");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        background: `url(${background}) no-repeat center center`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",
      }}
    >
      {contextHolder}
      <div
        className="login-form"
        style={{
          position: "absolute",
          left: "75%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="login">
        <img src={logo} alt="Logo" className="logo" />
        <h2>เข้าสู่ระบบ</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="กรุณากรอกอีเมล"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรุณากรอกรหัสผ่าน"
              required
            />
          </div>
          <button type="submit" className="login-btn">
            LOGIN
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login;
