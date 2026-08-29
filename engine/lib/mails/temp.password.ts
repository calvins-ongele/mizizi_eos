 import { headers } from 'next/headers';

export async function TEMP_PASSWORD(fname:string, password:string ) {
    const headersList = await headers();
    const domain = headersList.get('host'); 

    return `<p>Hello ${fname},</p>

        <p>
        Your account password was reset successfully.
        </p>

        <p>
        <strong>Temporary Password:</strong><br />
        <span style="font-size:16px; letter-spacing:1px;">
            ${password}
        </span> 
        </p>

        <p>
        Please log in and change your password immediately.
        </p>

        <p>
        Regards,<br />
        The ${process.env.WEBSITE_NAME} Team,<br/>
        ${domain}
    </p>
`;

}