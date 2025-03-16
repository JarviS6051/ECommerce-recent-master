import React, { useState } from "react";
import { NextPage } from "next";
import { Label, Input, Row, Col, Form, FormGroup, Button } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import API from "../../../utils/api"; // Adjust the import path as needed
import { useRouter } from "next/router";
import Link from "next/link";

const RegisterPage: NextPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validateForm = () => {
    const { firstName, lastName, email, password } = formData;

    if (!firstName || !lastName || !email || !password) {
      setMessage("All fields are required!");
      return false;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long!");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await API.post("/api/auth/register", formData);
      console.log("Response:", response.data);
      setMessage("Account created successfully!");

      // Clear the form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      // Redirect to login page after 2 seconds
      setTimeout(() => router.push("/pages/account/login"), 2000);
    } catch (error: any) {
      console.error("Error response:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed! Please try again later.";

      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Register" parent="home" />
      <section className="login-page section-big-py-space bg-light">
        <div className="custom-container">
          <Row>
            <Col lg="4" className="offset-lg-4">
              <div className="theme-card">
                <h3 className="text-center">Create Account</h3>
                <Form className="theme-form" onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  {message && (
                    <p className={`text-center ${message.includes('successfully') ? 'text-success' : 'text-danger'}`}>
                      {message}
                    </p>
                  )}

                  <Button type="submit" disabled={isLoading} className="btn btn-normal w-100">
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <p className="mt-3 text-center">
                    Already have an account?{" "}
                    <Link href="/pages/account/login" className="txt-default">
                      Click here to Login
                    </Link>
                  </p>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
