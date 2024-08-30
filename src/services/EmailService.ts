import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "modaktechtest@gmail.com",
      pass: "qsho wrvh vawt lezr",
    },
  });

  try {
    await transporter.sendMail({
      from: "modaktechtest@gmail.com",
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
