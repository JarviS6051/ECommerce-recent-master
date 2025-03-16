import React, { useState } from "react";
import { NextPage } from "next";
import { Label, Input, Row, Col, Form, FormGroup, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import Breadcrumb from "../../Containers/Breadcrumb";
import { useRouter } from "next/router";
import API from "../../../utils/api";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterPage: NextPage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState<string>(""); // OTP state
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false); // Modal state
  const router = useRouter();

  // Handle input change for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Validate form inputs before submission
  const validateForm = (): boolean => {
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

  // Handle form submission to register the user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await API.post("/api/auth/register", formData);
      console.log("Response:", response.data);
      setMessage("Account created successfully!");

      // Open OTP modal after successful registration
      setModal(true);
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

  // Handle OTP submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post("/api/auth/verify-email", { code: otp });
      console.log("OTP verification response:", response.data);
      setMessage("Email verified successfully!");

      // Redirect to home after successful verification
      setTimeout(() => {
        router.push("/"); // Home page or dashboard
      }, 2000);
    } catch (error: any) {
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "OTP verification failed!";
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
          <Row className="row">
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
                      required
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
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      type="email"
                      id="Email"
                      name="email"
                      required
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
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Button type="submit" className="btn btn-normal" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  {/* Already have an account? Login */}
                  <div className="form-row row mt-3">
                    <Col md="12" className="text-center">
                      <p>
                        Already have an account?{" "}
                        <a href="/pages/account/login" className="txt-default">
                          Click here to Login
                        </a>
                      </p>
                    </Col>
                  </div>
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
