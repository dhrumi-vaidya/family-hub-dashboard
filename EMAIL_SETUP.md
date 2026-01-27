# Email Configuration Guide

## Setting up Email Service for KutumbOS

To enable automatic email sending for family invitations, you need to configure SMTP settings.

### Gmail Configuration (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update your server `.env` file**:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

### Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Testing Email Configuration

1. **Restart your server** after updating the `.env` file
2. **Test the email service** by visiting: `http://localhost:5005/api/auth/test-email`
3. **Check server logs** for email configuration status

### Security Notes

- **Never use your regular password** - always use app-specific passwords
- **Keep your `.env` file secure** and never commit it to version control
- **Use environment variables** in production, not `.env` files

### Troubleshooting

**"Email service not configured"**
- Check that all SMTP_* variables are set in your `.env` file
- Restart the server after making changes

**"Authentication failed"**
- Verify your email and app password are correct
- Make sure 2FA is enabled and you're using an app password

**"Connection refused"**
- Check your SMTP host and port settings
- Verify your internet connection allows SMTP traffic

### Development Mode

Without email configuration, the system will:
- Generate invitation links successfully
- Log email content to the server console
- Allow manual sharing of invitation links
- Work perfectly for development and testing

This is the current mode - everything works except automatic email delivery.