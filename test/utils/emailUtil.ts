import nodemailer from "nodemailer";
import EnvVariables from "data/env.variables";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  public constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EnvVariables.GMAIL_USER,
        pass: EnvVariables.GMAIL_APP_PASSWORD
      }
    });
  }

  public async sendEmail(options: EmailOptions): Promise<void> {
    const recipients = options.to
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    await this.transporter.sendMail({
      from: options.from ?? EnvVariables.GMAIL_USER,
      to: recipients.join(", "),
      subject: options.subject,
      html: options.html
    });
  }
}
