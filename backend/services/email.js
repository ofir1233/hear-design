import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDemoReadyEmail(email, token, frontendUrl, companyName) {
  const accessUrl = `${frontendUrl}?demoToken=${token}`
  const name = companyName || 'your company'

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `Your Hear demo for ${name} is ready`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:48px 24px;">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                  <tr>
                    <td style="padding:40px 40px 32px;">
                      <img src="${frontendUrl}/Logo.svg" alt="Hear" height="36" style="display:block;margin-bottom:32px;" />
                      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">
                        Your demo is ready
                      </h1>
                      <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;">
                        Your Hear demo environment for <strong style="color:rgba(255,255,255,0.85);">${name}</strong> has been built.
                        Use the link below to access it anytime — no sign-in required.
                      </p>
                      <a href="${accessUrl}"
                         style="display:inline-block;padding:13px 28px;background:#FF7056;border-radius:10px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.01em;">
                        Open my demo →
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;">
                        This link gives direct access to your demo — keep it safe.<br/>
                        Link: <span style="color:rgba(255,255,255,0.35);">${accessUrl}</span>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  })
}

export async function sendDevSetupLink(email, token) {
  const setupUrl = `${process.env.APP_URL}?devToken=${token}`

  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Your Hear developer setup link',
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:48px 24px;">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                  <tr>
                    <td style="padding:40px 40px 32px;">
                      <img src="${process.env.APP_URL}/Logo.svg" alt="Hear" height="36" style="display:block;margin-bottom:32px;" />
                      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">
                        Your developer setup link
                      </h1>
                      <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;">
                        Click the button below to configure your Hear developer environment.
                        This link expires in <strong style="color:rgba(255,255,255,0.75);">24 hours</strong>.
                      </p>
                      <a href="${setupUrl}"
                         style="display:inline-block;padding:13px 28px;background:#1779F7;border-radius:10px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.01em;">
                        Open setup page →
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;">
                        If you didn't request this, you can safely ignore this email.<br/>
                        Link: <span style="color:rgba(255,255,255,0.35);">${setupUrl}</span>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  })
}
