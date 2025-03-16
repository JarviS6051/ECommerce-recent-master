import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: "5d1f157f01677b03fe33dc64fb28757a",  // Correctly accessing the environment variable
});

export const sender = {
  email: "hello@quadcydle.com",  // Sender's email
  name: "Mailtrap Test",  // Sender's name
};


// import { MailtrapClient } from "mailtrap";

// const TOKEN = "5d1f157f01677b03fe33dc64fb28757a";

// const client = new MailtrapClient({
//   token: TOKEN,
// });

// const sender = {
//   email: "hello@quadcydle.com",
//   name: "Yash",
// };
// const recipients = [
//   {
//     email: "yashb150603@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);