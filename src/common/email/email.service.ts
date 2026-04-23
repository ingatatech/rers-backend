import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor() {
    this.from = `RNEC <${process.env.GMAIL_USER}>`;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendPasswordReset(to: string, resetToken: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject: 'Reset your RNEC password',
        html: `
          <p>Hello,</p>
          <p>Click the link below to reset your password. It expires in <strong>1 hour</strong>.</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you did not request a password reset, you can ignore this email.</p>
        `,
      });
    } catch (err) {
      this.logger.error(`Failed to send password reset email to ${to}`, err);
      throw err;
    }
  }

  async sendWelcomeCredentials(
    to: string,
    firstName: string,
    email: string,
    password: string,
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject: 'Your RNEC account has been created',
        html: `
          <p>Hello ${firstName},</p>
          <p>Your account on the <strong>RNEC Research Ethics Review System</strong> has been created.</p>
          <p>Here are your login credentials:</p>
          <table style="border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:4px 12px 4px 0;color:#555">Email</td><td><strong>${email}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#555">Password</td><td><strong style="font-family:monospace;font-size:15px">${password}</strong></td></tr>
          </table>
          <p>Please <a href="${frontendUrl}/login">log in</a> and change your password immediately.</p>
          <p style="color:#999;font-size:12px">If you were not expecting this email, please contact your administrator.</p>
        `,
      });
    } catch (err) {
      this.logger.error(`Failed to send welcome credentials email to ${to}`, err);
    }
  }

  async sendOtp(to: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject: 'Your RNEC verification code',
        html: `
          <p>Hello,</p>
          <p>Use the code below to verify your account. It expires in <strong>10 minutes</strong>.</p>
          <h2 style="letter-spacing:4px">${otp}</h2>
          <p>If you did not create an account, you can ignore this email.</p>
        `,
      });
    } catch (err) {
      this.logger.error(`Failed to send OTP email to ${to}`, err);
      throw err;
    }
  }
}
