import nodemailer from 'nodemailer';
import { FamilyRole } from '../models/database';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface InviteEmailData {
  recipientEmail: string;
  recipientName?: string;
  familyName: string;
  inviterName: string;
  inviterEmail: string;
  role: FamilyRole;
  inviteUrl: string;
  expiresInHours: number;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.setupTransporter();
  }

  private setupTransporter() {
    try {
      // Check if email configuration is provided
      const emailConfig = this.getEmailConfig();
      
      if (emailConfig) {
        this.transporter = nodemailer.createTransport(emailConfig);
        this.isConfigured = true;
        console.log('📧 Email service configured successfully');
      } else {
        console.log('📧 Email service not configured - using console logging');
        this.isConfigured = false;
      }
    } catch (error) {
      console.error('❌ Email service configuration failed:', error);
      this.isConfigured = false;
    }
  }

  private getEmailConfig(): EmailConfig | null {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS
    } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return null;
    }

    return {
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587'),
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    };
  }

  async sendInviteEmail(data: InviteEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const emailHtml = this.generateInviteEmailHtml(data);
      const emailText = this.generateInviteEmailText(data);

      const mailOptions = {
        from: `"KutumbOS" <${process.env.SMTP_USER}>`,
        to: data.recipientEmail,
        subject: `You're invited to join ${data.familyName} on KutumbOS`,
        text: emailText,
        html: emailHtml
      };

      if (this.isConfigured && this.transporter) {
        // Send actual email
        const result = await this.transporter.sendMail(mailOptions);
        console.log('📧 Invite email sent successfully:', result.messageId);
        return { success: true };
      } else {
        // Log to console for development
        console.log('\n📧 EMAIL WOULD BE SENT:');
        console.log('To:', data.recipientEmail);
        console.log('Subject:', mailOptions.subject);
        console.log('Content:');
        console.log(emailText);
        console.log('\n');
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Failed to send invite email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      };
    }
  }

  private generateInviteEmailHtml(data: InviteEmailData): string {
    const roleLabels: Record<FamilyRole, string> = {
      'FAMILY_ADMIN': 'Family Administrator',
      'ADULT': 'Adult Member',
      'SENIOR': 'Senior Member',
      'TEEN': 'Teen Member',
      'CHILD': 'Child Member',
      'EMERGENCY': 'Emergency Access'
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KutumbOS Family Invitation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .info-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏠 KutumbOS</div>
        <h1>You're Invited!</h1>
        <p>Join ${data.familyName} on KutumbOS</p>
    </div>
    
    <div class="content">
        <p>Hello!</p>
        
        <p><strong>${data.inviterName}</strong> (${data.inviterEmail}) has invited you to join their family <strong>"${data.familyName}"</strong> on KutumbOS.</p>
        
        <div class="info-box">
            <h3>📋 Invitation Details</h3>
            <p><strong>Family:</strong> ${data.familyName}</p>
            <p><strong>Your Role:</strong> ${roleLabels[data.role]}</p>
            <p><strong>Invited by:</strong> ${data.inviterName}</p>
            <p><strong>Expires:</strong> ${data.expiresInHours} hours from now</p>
        </div>
        
        <p>KutumbOS helps families stay organized with shared expenses, health records, responsibilities, and more!</p>
        
        <div style="text-align: center;">
            <a href="${data.inviteUrl}" class="button">Accept Invitation & Join Family</a>
        </div>
        
        <p><small>If the button doesn't work, copy and paste this link into your browser:</small></p>
        <p><small><a href="${data.inviteUrl}">${data.inviteUrl}</a></small></p>
        
        <div class="info-box">
            <h3>🔒 What happens next?</h3>
            <p>1. Click the invitation link above</p>
            <p>2. Create your account with a secure password</p>
            <p>3. You'll automatically join ${data.familyName}</p>
            <p>4. Start collaborating with your family!</p>
        </div>
    </div>
    
    <div class="footer">
        <p>This invitation will expire in ${data.expiresInHours} hours.</p>
        <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        <p>© 2026 KutumbOS - Family Life, Organized</p>
    </div>
</body>
</html>`;
  }

  private generateInviteEmailText(data: InviteEmailData): string {
    const roleLabels: Record<FamilyRole, string> = {
      'FAMILY_ADMIN': 'Family Administrator',
      'ADULT': 'Adult Member',
      'SENIOR': 'Senior Member',
      'TEEN': 'Teen Member',
      'CHILD': 'Child Member',
      'EMERGENCY': 'Emergency Access'
    };

    return `
🏠 KutumbOS - Family Invitation

Hello!

${data.inviterName} (${data.inviterEmail}) has invited you to join their family "${data.familyName}" on KutumbOS.

INVITATION DETAILS:
- Family: ${data.familyName}
- Your Role: ${roleLabels[data.role]}
- Invited by: ${data.inviterName}
- Expires: ${data.expiresInHours} hours from now

KutumbOS helps families stay organized with shared expenses, health records, responsibilities, and more!

ACCEPT INVITATION:
${data.inviteUrl}

WHAT HAPPENS NEXT:
1. Click the invitation link above
2. Create your account with a secure password
3. You'll automatically join ${data.familyName}
4. Start collaborating with your family!

This invitation will expire in ${data.expiresInHours} hours.
If you didn't expect this invitation, you can safely ignore this email.

© 2026 KutumbOS - Family Life, Organized
`;
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured || !this.transporter) {
      return { success: false, error: 'Email service not configured' };
    }

    try {
      await this.transporter.verify();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection test failed' 
      };
    }
  }
}

export const emailService = new EmailService();