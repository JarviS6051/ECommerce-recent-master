import React, { useState } from "react";
import { useRouter } from "next/router";
import Breadcrumb from "../../Containers/Breadcrumb";
import { Row, Col, Input, Label } from "reactstrap";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Breadcrumb title="Login" parent="Home" />

      <section className="login-page section-big-py-space bg-light">
        <div className="custom-container">
          <Row className="row">
            <Col xl="4" lg="6" md="8" className="offset-xl-4 offset-lg-3 offset-md-2">
              <div className="theme-card">
                <h3 className="text-center">Login</h3>
                <form className="theme-form" onSubmit={loginAuth}>
                  <div className="form-group">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-normal">
                    Login
                  </button>
                  <a className="float-end txt-default mt-2" href="/pages/account/forget-password">
                    Forgot your password?
                  </a>
                </form>
                <p className="mt-3">
                  Sign up for a free account at our store. Registration is quick and easy. It allows you to order from our shop. Click register to start shopping.
                </p>
                <a href="/pages/account/register" className="txt-default pt-3 d-block">
                  Create an Account
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Login;
