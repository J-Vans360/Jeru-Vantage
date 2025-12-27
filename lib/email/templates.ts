export function universityLeadNotificationEmail(data: {
  universityName: string;
  studentName: string;
  studentEmail: string;
  studentCountry: string;
  matchScore: number;
  programName?: string;
  hollandCode?: string;
  leadId: string;
}) {
  return {
    subject: `New Qualified Lead: ${data.studentName} (${data.matchScore}% Match)`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
          .score-box { background: white; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; border: 2px solid #10b981; }
          .score { font-size: 48px; font-weight: bold; color: #10b981; }
          .details { background: white; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .label { color: #6b7280; }
          .value { font-weight: 600; color: #111827; }
          .cta { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">New Student Lead</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">A qualified student wants to connect with ${data.universityName}</p>
          </div>

          <div class="content">
            <div class="score-box">
              <div style="color: #6b7280; margin-bottom: 5px;">Match Strength</div>
              <div class="score">${data.matchScore}%</div>
              <div style="color: #10b981; font-weight: 500;">Excellent Fit</div>
            </div>

            <div class="details">
              <h3 style="margin-top: 0; color: #111827;">Student Information</h3>

              <div class="detail-row">
                <span class="label">Name</span>
                <span class="value">${data.studentName}</span>
              </div>

              <div class="detail-row">
                <span class="label">Email</span>
                <span class="value">${data.studentEmail}</span>
              </div>

              <div class="detail-row">
                <span class="label">Country</span>
                <span class="value">${data.studentCountry}</span>
              </div>

              ${data.programName ? `
              <div class="detail-row">
                <span class="label">Interested Program</span>
                <span class="value">${data.programName}</span>
              </div>
              ` : ''}

              ${data.hollandCode ? `
              <div class="detail-row">
                <span class="label">Career Interest Profile</span>
                <span class="value">${data.hollandCode}</span>
              </div>
              ` : ''}
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/university/leads/${data.leadId}" class="cta">
                View Full Profile & Respond
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              This student has consented to share their information and is expecting to hear from your admissions team.
              We recommend responding within 24-48 hours for best results.
            </p>
          </div>

          <div class="footer">
            <p>Powered by Jeru Vantage - The Student Assessment System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export function studentConfirmationEmail(data: {
  studentName: string;
  universityName: string;
  programName?: string;
}) {
  return {
    subject: `Connection Request Sent to ${data.universityName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
          .next-steps { background: white; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px; }
          .step-number { background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">&#127881;</div>
            <h1 style="margin: 0; font-size: 24px;">You're Connected!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your profile has been shared with ${data.universityName}</p>
          </div>

          <div class="content">
            <p>Hi ${data.studentName},</p>

            <p>Great news! Your connection request to <strong>${data.universityName}</strong>${data.programName ? ` for the ${data.programName} program` : ''} has been sent successfully.</p>

            <div class="next-steps">
              <h3 style="margin-top: 0;">What happens next?</h3>

              <div class="step">
                <span class="step-number">1</span>
                <div>
                  <strong>University Reviews Your Profile</strong>
                  <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">The admissions team will review your assessment results and profile.</p>
                </div>
              </div>

              <div class="step">
                <span class="step-number">2</span>
                <div>
                  <strong>They'll Reach Out</strong>
                  <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Expect an email within 2-5 business days with personalized information.</p>
                </div>
              </div>

              <div class="step">
                <span class="step-number">3</span>
                <div>
                  <strong>Continue Your Journey</strong>
                  <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Keep exploring other matched universities while you wait!</p>
                </div>
              </div>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              If you don't hear back within a week, don't worry! You can always explore other great matches on your dashboard.
            </p>
          </div>

          <div class="footer">
            <p>Good luck with your educational journey!</p>
            <p>— The Jeru Vantage Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
