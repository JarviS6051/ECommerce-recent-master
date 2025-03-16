import { VERIFICATION_EMAIL_TEMPLATE , PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {  
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email Address",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Verification Email",
        });
        console.log("Email sent successfully", response);
        
    } catch (error) {
        console.log(`Failed to send verification email`, error);
        
        throw new Error(`Failed to send verification email ${error}`);
    }
};

export const sendWelcomeEmail = async (email, firstName) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "5f560798-fa2a-4ab5-8fc3-0b522c28334c",  // Your template ID
            template_variables: {
                company_info_name: "Big Deal",  // Example company name
                name: firstName,                    // First name passed to the template
            }
        });

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.log("Failed to send welcome email", error);

        // Providing more context in the error message
        throw new Error(`Failed to send welcome email: ${error.message}`);
    }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });

        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.log("Failed to send password reset email", error);

        throw new Error(`Failed to send password reset email: ${error.message}`);
    }
};

export const sendResetSuccessfullEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        });

        console.log("Password reset success email sent successfully", response);
    } catch (error) {
        console.log("Failed to send password reset success email", error);

        throw new Error(`Failed to send password reset success email: ${error.message}`);
    }
};
