import { EmailOptions } from "./email.types";
import { renderEmailTemplate } from "./render.template";
import { sendMail } from "./send";

export async function MailSuperAdmin(title:string, content:string) {
    //send the admin an email
    const body = `<p>Hello Admin,</p> 
        <p>
        A new system email requiring your attention.
        </p> 
        <p>
        <span style="font-size:16px; letter-spacing:1px;">
            ${content}
        </span> 
        </p> 
        <p>Regards,<br /> The ${process.env.WEBSITE_NAME},<br/>https://${process.env.WEBSITE_URL}/</p>
        `;
    const options: EmailOptions = {
        to: `info@${process.env.WEBSITE_URL}`,
        subject: title,
        html: renderEmailTemplate(body, { title: title }),
    };
    if (process.env.NODE_ENV == "production") {
        sendMail(options);
    }
}