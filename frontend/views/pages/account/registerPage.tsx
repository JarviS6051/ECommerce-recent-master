import React, { useState } from "react";
import { NextPage } from "next";
import { Label, Input, Row, Col, Form, FormGroup, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import API from "../../../utils/api";
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
  const [otp, setOtp] = useState("");
  const [modal, setModal] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Validate the form before submitting
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

  // Handle sign-up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await API.post("/api/auth/register", formData);
      setEmailForOtp(formData.email);
      setModal(true);
      setMessage("OTP sent to your email. Please verify to continue.");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Signup failed!");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification & auto-login
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await API.post("/api/auth/verify-email", {
        email: emailForOtp,
        code: otp,
      });

      const { token, user } = response.data;

      // Store the token in localStorage (or cookies)
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Email verified! Redirecting to home...");
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (error: any) {
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
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="Email">Email</Label>
                    <Input type="email" id="Email" name="email" required value={formData.email} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" id="password" name="password" required value={formData.password} onChange={handleChange} />
                  </FormGroup>
                  <Button type="submit" className="btn btn-normal" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form>

                {/* OTP Modal */}
                <Modal isOpen={modal}>
                  <ModalHeader>Verify Your Email</ModalHeader>
                  <ModalBody>
                    <Form onSubmit={handleOtpSubmit}>
                      <FormGroup>
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          type="text"
                          id="otp"
                          name="otp"
                          placeholder="Enter 6-digit OTP"
                          required
                          value={otp}
                          onChange={handleOtpChange}
                          maxLength={6}
                          style={{
                            fontSize: "18px",
                            padding: "12px",
                            textAlign: "center",
                            letterSpacing: "5px",
                            border: "2px solid #4CAF50",
                            borderRadius: "8px",
                          }}
                        />
                      </FormGroup>
                      <Button type="submit" className="btn btn-normal" disabled={isLoading}>
                        {isLoading ? "Verifying OTP..." : "Verify OTP"}
                      </Button>
                    </Form>
                  </ModalBody>
                </Modal>

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
