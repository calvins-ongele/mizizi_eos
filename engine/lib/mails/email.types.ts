import { Attachment } from "nodemailer/lib/mailer"; 

export type EmailOptions = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;

  /**
   * Optional attachments
   */
  attachments?: Attachment[];
}; 