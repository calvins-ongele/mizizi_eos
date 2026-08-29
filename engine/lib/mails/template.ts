export function EMAIL_TEMPLATE():string {
  return `<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Email</title>
  </head> 
  <body style='margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f4f6f8; padding:24px 0;'>
      <tr>
        <td align='center'>
          <!-- Container -->
          <table
            width='100%'
            cellpadding='0'
            cellspacing='0'
            style='max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;'
          > 
            <!-- Header -->
            <tr>
              <td style='padding:20px 24px; background:#111827; color:#ffffff;'>
                <h1 style='margin:0; font-size:18px; font-weight:600;'>
                  {{title}}
                </h1>
              </td>
            </tr> 
            <!-- Body -->
            <tr>
              <td style='padding:24px; color:#111827; font-size:14px; line-height:1.6;'>
                {{body}}
              </td>
            </tr> 
            <!-- Divider -->
            <tr>
              <td style='padding:0 24px;'>
                <hr style='border:none; border-top:1px solid #e5e7eb;' />
              </td>
            </tr> 
            <!-- Footer -->
            <tr>
              <td style='padding:16px 24px; font-size:12px; color:#6b7280;'>
                <p style='margin:0;'>
                  © {{year}} ${process.env.WEBSITE_NAME}. All rights reserved.
                </p>
                <p style='margin:8px 0 0;'>
                  This email was sent automatically. Please do not reply.
                </p>
              </td>
            </tr> 
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
