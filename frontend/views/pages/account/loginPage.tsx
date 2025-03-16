import React, { useState } from "react";
import { useRouter } from "next/router";
import Breadcrumb from "../../Containers/Breadcrumb";
import { Row, Col, Input, Label } from "reactstrap";
import { toast } from "react-toastify";

// Define types for the form state
interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle form submission
  const loginAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        router.push("/"); // Redirect to homepage
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
                    <Label htmlFor="user-email">Email Address</Label>
                    <Input
                      type="email"
                      id="user-email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="user-password">Your Password</Label>
                    <Input
                      type="password"
                      id="user-password"
                      name="password"
                      value={form.password}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter your secure password"
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
