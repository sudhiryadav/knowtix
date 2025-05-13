import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Configure Handlebars
const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve("./src/templates/emails/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./src/templates/emails/"),
  extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

export async function sendContactEmail(data: {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}) {
  const { fullName, email, phone, message } = data;

  const mailOptions = {
    from: process.env.EMAIL_SERVER_USER,
    to: process.env.CONTACT_EMAIL || 'er.sudhir.yadav@gmail.com',
    subject: `New Contact Form Submission from ${fullName}`,
    template: "contact",
    context: {
      fullName,
      email,
      phone,
      message,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
