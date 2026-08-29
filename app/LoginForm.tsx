// app/login/page.tsx
"use client";

import { useState } from "react";

export function LoginForm({ cname, logo }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passType, setPassType] = useState("password");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      let msg = data?.message;
      if (data?.details) {
        msg += `: ${data?.details[0]["message"]}`;
      }
      setError(msg || "Invalid credentials");
    } else {
      // localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    }

    setLoading(false);
  }

  function togglePass(e: any) {
    e.preventDefault();

    if (passType == "password") setPassType("text");
    else setPassType("password");
  }

  return (
    <div className="">
      {/* <!-- Container starts --> */}
      <div className="container">
        <div className="auth-wrapper ">
          <form onSubmit={handleSubmit} action="/">
            <div className="auth-box">
              <div className="d-flex justify-content-start ">
                <a href="/" className="auth-logo mb-4">
                  <img src={logo} alt={cname} />
                </a>
                <h3 className="mb-4">Login</h3>
              </div>

              {error && <p className="alert alert-sm text-danger">{error}</p>}
              {success && (
                <p className="alert alert-sm text-success">{success}</p>
              )}

              <div className="mb-3">
                <label className="form-label" htmlFor="email">
                  Your email <span className="text-danger">*</span>
                </label> 
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-2">
                <label className="form-label" htmlFor="pwd">
                  Your password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    name="password"
                    type={passType}
                    id="pwd"
                    className="form-control"
                    placeholder="Enter password"
                  />
                  <button
                    onClick={togglePass}
                    className="btn btn-outline-secondary"
                    type="button"
                  >
                    <i className={`bi ${passType=='text'? 'bi-eye-slash':'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-end mb-3"> </div>

              <div className="mb-3 d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* End of login */}
    </div>
  );
}
