import nodemailer from 'nodemailer';
import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.createTransporter();
  }

  private createTransporter() {
    // Production: Use actual email service (SMTP, SendGrid, etc.)
    if (process.env.NODE_ENV === 'production') {
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        secure: true,
      });
    } 
    // Development: Use Ethereal Email for testing
    else {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
        }
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'PosCalls4U <noreply@poscalls4u.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html)
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      logger.info(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      logger.error('Email sending failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<boolean> {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - PosCalls4U</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            box-shadow: 0 0 20px rgba(0,0,0,0.1); 
            overflow: hidden; 
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            margin: 20px 0; 
            font-weight: bold; 
            text-align: center;
            transition: transform 0.2s;
          }
          .button:hover { 
            transform: translateY(-2px); 
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px; 
            color: #666; 
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            border-radius: 5px; 
            padding: 15px; 
            margin: 20px 0; 
            color: #856404; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Password Reset Request</h1>
            <p>PosCalls4U - Call Center Platform</p>
          </div>
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>We received a request to reset your password for your PosCalls4U account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Your Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour for security</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
              ${resetUrl}
            </p>
            
            <p>Best regards,<br>The PosCalls4U Team</p>
          </div>
          <div class="footer">
            <p>© 2024 PosCalls4U. All rights reserved.</p>
            <p>This is an automated message, please don't reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '🔒 Reset Your PosCalls4U Password',
      html,
    });
  }

  async sendEmailVerificationEmail(email: string, verificationToken: string, userName: string): Promise<boolean> {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - PosCalls4U</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            box-shadow: 0 0 20px rgba(0,0,0,0.1); 
            overflow: hidden; 
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            margin: 20px 0; 
            font-weight: bold; 
            text-align: center;
            transition: transform 0.2s;
          }
          .button:hover { 
            transform: translateY(-2px); 
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px; 
            color: #666; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Verify Your Email</h1>
            <p>PosCalls4U - Call Center Platform</p>
          </div>
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Welcome to PosCalls4U! Please verify your email address to complete your account setup:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
              ${verificationUrl}
            </p>
            
            <p>This verification link will expire in 24 hours.</p>
            
            <p>Best regards,<br>The PosCalls4U Team</p>
          </div>
          <div class="footer">
            <p>© 2024 PosCalls4U. All rights reserved.</p>
            <p>This is an automated message, please don't reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '✉️ Verify Your PosCalls4U Email Address',
      html,
    });
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
    const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/login`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to PosCalls4U</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 0; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            box-shadow: 0 0 20px rgba(0,0,0,0.1); 
            overflow: hidden; 
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            margin: 20px 0; 
            font-weight: bold; 
            text-align: center;
            transition: transform 0.2s;
          }
          .button:hover { 
            transform: translateY(-2px); 
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px; 
            color: #666; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to PosCalls4U!</h1>
            <p>Your Call Center Platform</p>
          </div>
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Welcome to PosCalls4U! Your account has been successfully created and verified. You're now ready to start using our call center platform.</p>
            
            <div style="text-align: center;">
              <a href="${loginUrl}" class="button">Login to Your Account</a>
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>Complete your profile setup</li>
              <li>Explore the dashboard and features</li>
              <li>Connect with your team</li>
              <li>Start managing your calls efficiently</li>
            </ul>
            
            <p>If you have any questions or need help getting started, don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The PosCalls4U Team</p>
          </div>
          <div class="footer">
            <p>© 2024 PosCalls4U. All rights reserved.</p>
            <p>Need help? Contact us at support@poscalls4u.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '🎉 Welcome to PosCalls4U!',
      html,
    });
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }
}

export const emailService = new EmailService();
