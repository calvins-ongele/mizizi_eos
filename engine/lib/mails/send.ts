import nodemailer, { Transporter } from "nodemailer"; 
import { EmailOptions } from "./email.types";
 

let transporter: Transporter | null = null;

/**
 * Initializes the SMTP transporter once
 */
function getTransporter(): Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  }); 

  return transporter;
}

/**
 * Sends an email
 */
export async function sendMail(options: EmailOptions) {
  const transport = getTransporter();

  if (process.env.NODE_ENV == "production") {

  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,

    // Attachments are optional 
    attachments: options.attachments,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Email sent:", info.messageId);

    // Ethereal preview link (if applicable)
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log("Preview:", preview);
  }

  return info;
 }
 return null;
}