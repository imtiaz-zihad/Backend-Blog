import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignup: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignup: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: '"Prisma Blog App" <imtiaz20067@gmail.com>',
          to: user.email,
          subject: "Verify your email address",
          text: `Please verify your email address by clicking this link: ${verificationUrl}`,
          html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
          color: #1f2937;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background-color: #f4f7fb; padding: 40px 16px;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width: 600px;
                  background-color: #ffffff;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    style="
                      background-color: #111827;
                      padding: 28px 32px;
                      text-align: center;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 26px;
                        line-height: 1.3;
                      "
                    >
                      Prisma Blog App
                    </h1>

                    <p
                      style="
                        margin: 8px 0 0;
                        color: #d1d5db;
                        font-size: 14px;
                      "
                    >
                      Welcome to our community
                    </p>
                  </td>
                </tr>

                <!-- Main content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <h2
                      style="
                        margin: 0 0 16px;
                        color: #111827;
                        font-size: 24px;
                        line-height: 1.4;
                      "
                    >
                      Verify your email address
                    </h2>

                    <p
                      style="
                        margin: 0 0 18px;
                        color: #4b5563;
                        font-size: 16px;
                        line-height: 1.7;
                      "
                    >
                      Thanks for signing up for Prisma Blog App. Please
                      verify your email address to activate your account.
                    </p>

                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="margin: 28px 0;"
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            border-radius: 8px;
                            background-color: #2563eb;
                          "
                        >
                          <a
                            href="${verificationUrl}"
                            target="_blank"
                            style="
                              display: inline-block;
                              padding: 14px 28px;
                              border-radius: 8px;
                              color: #ffffff;
                              font-size: 16px;
                              font-weight: bold;
                              text-decoration: none;
                            "
                          >
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin: 0 0 12px;
                        color: #6b7280;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      If the button above does not work, copy and paste this
                      link into your browser:
                    </p>

                    <p
                      style="
                        margin: 0;
                        word-break: break-all;
                        color: #2563eb;
                        font-size: 13px;
                        line-height: 1.6;
                      "
                    >
                      <a
                        href="${verificationUrl}"
                        target="_blank"
                        style="color: #2563eb; text-decoration: none;"
                      >
                        ${verificationUrl}
                      </a>
                    </p>

                    <hr
                      style="
                        border: 0;
                        border-top: 1px solid #e5e7eb;
                        margin: 32px 0 24px;
                      "
                    />

                    <p
                      style="
                        margin: 0;
                        color: #9ca3af;
                        font-size: 13px;
                        line-height: 1.6;
                      "
                    >
                      This verification link will expire soon. If you did not
                      create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      background-color: #f9fafb;
                      padding: 24px 32px;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        color: #9ca3af;
                        font-size: 12px;
                        line-height: 1.6;
                      "
                    >
                      © ${new Date().getFullYear()} Prisma Blog App. All rights
                      reserved.
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
        });

        console.log(info.messageId);
      } catch (error) {
        console.log(error);
        throw new Error("Failed to send verification email");
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",  
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
