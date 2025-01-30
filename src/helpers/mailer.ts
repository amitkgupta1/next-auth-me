import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000), // Expiry time 1 hour
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPassword: hashedToken,
          forgotPasswordExpiry: new Date(Date.now() + 3600000),
        },
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    } as SMTPTransport.Options);

    const info = {
      from: '"Amit Foo Koch 👻" <amit013021@gmail.com>',
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email ✔" : "Reset your password",
      text: "Hello?",
      html: `<p> Click <a href="http://localhost:3000/verifyemail?token=${hashedToken}">here</a> 
        to ${
          emailType === "VERIFY" ? "Verify your email!" : "Reset your password!"
        }
        or copy and paste the link below in your browser...
        <br/> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`,
    };
    const mailResponse = await transporter.sendMail(info);

    return mailResponse;
  } catch (error: any) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};
