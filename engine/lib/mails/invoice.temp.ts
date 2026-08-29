 import { headers } from 'next/headers';

export async function INVOICE_TEMP(fname:string, sender:string ) {
    const headersList = await headers();
    const domain = headersList.get('host'); 

    return `<p>Hello ${fname},</p>

        <p>
        You have received an Invoice from ${sender}.
        </p>

        <p> 
        <span style="font-size:16px; letter-spacing:1px;">
            Please find attached invoice in pdf
        </span> 
        </p>


        <p>
        Regards,<br />
        The ${process.env.WEBSITE_NAME} Team,<br/>
        ${domain}
    </p>
`;

}