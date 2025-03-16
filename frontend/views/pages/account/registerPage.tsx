import React, { useState } from "react";
import { NextPage } from "next";
import { Label, Input, Row, Col, Form, FormGroup, Button } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import API from "../../../utils/api"; // Adjust the import path as needed
import { useRouter } from "next/router";

const RegisterPage: NextPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(""); // State for OTP
  const [showOtpInput, setShowOtpInput] = useState(false); // Toggle for OTP input
  const [emailForOtp, setEmailForOtp] = useState(""); // Store email separately for OTP verification
  const router = useRouter();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
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

  // Handle form submission for sign up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await API.post("/api/auth/register", formData);
      console.log("Response:", response.data);

      // Store email for OTP verification
      setEmailForOtp(formData.email);

      // Show OTP input field
      setShowOtpInput(true);

      // Set the message for OTP verification
      setMessage("OTP sent to your email. Please enter the OTP to verify your email.");

    } catch (error: any) {
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed!";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await API.post("/api/auth/verify-email", {
        email: emailForOtp,
        code: otp,
      });

      console.log("OTP Verified:", response.data);
      setMessage("Email verified successfully!");

      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push("/pages/account/login");
      }, 2000);

    } catch (error: any) {
      console.error("Error verifying OTP:", error.response);
      setMessage(error.response?.data?.message || "OTP verification failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Register" parent="home" />
      <section className="login-page section-big-py-space bg-light">
        <div className="custom-container">
          <Row className="row">
            <Col lg="4" className="offset-lg-4">
              <div className="theme-card">
                <h3 className="text-center">Create Account</h3>
                <Form className="theme-form" onSubmit={handleSubmit}>
                  <div className="form-row row">
                    <FormGroup className="col-md-12">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </div>
                  <div className="form-row row">
                    <FormGroup className="col-md-12">
                      <Label htmlFor="Email">Email</Label>
                      <Input
                        type="email"
                        id="Email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup className="col-md-12">
                      <Button
                        type="submit"
                        className="btn btn-normal"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </FormGroup>
                  </div>
                  <div className="form-row row">
                    <Col md="12">
                      <p>
                        Already have an account?{" "}
                        <a href="/pages/account/login" className="txt-default">
                          Click here to Login
                        </a>
                      </p>
                    </Col>
                  </div>
                </Form>

                {/* OTP Input */}
                {showOtpInput && (
                  <Form onSubmit={handleOtpSubmit}>
                    <FormGroup>
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        type="text"
                        id="otp"
                        name="otp"
                        placeholder="Enter 6 digit OTP"
                        required
                        value={otp}
                        onChange={handleOtpChange}
                      />
                    </FormGroup>
                    <Button
                      type="submit"
                      className="btn btn-normal"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying OTP..." : "Verify OTP"}
                    </Button>
                  </Form>
                )}

                {message && <p className="text-center">{message}</p>}
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
