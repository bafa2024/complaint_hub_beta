import React, { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import UserLogin from "./components/UserLogin";

<Route path="/login" element={<UserLogin />} />

export default function App() {
  const [step, setStep] = useState(() => {
    // Stay logged in if there's a token
    return localStorage.getItem("token") ? "dashboard" : "register";
  });

  if (step === "register")
    return <>
      <h1>Register</h1>
      <RegisterForm onSuccess={() => setStep("login")} />
      <button onClick={() => setStep("login")}>Go to Login</button>
    </>;
  if (step === "login")
    return <>
      <h1>Login</h1>
      <LoginForm onLogin={() => setStep("dashboard")} />
      <button onClick={() => setStep("register")}>Go to Register</button>
    </>;
  if (step === "dashboard")
    return <Dashboard onLogout={() => setStep("login")} />;
}
