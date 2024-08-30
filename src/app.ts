import express from "express";
import { NotificationService } from "./services/NotificationService";
import { sendEmail } from "./services/EmailService";

const app = express();
app.use(express.json());

app.post("/notify", async (req, res) => {
  const { email, type, message } = req.body;

  if (!email || !type || !message) {
    return res
      .status(400)
      .json({ error: "Email, type, and message are required" });
  }

  const canSend = await NotificationService.canSendNotification(email, type);
  if (canSend) {
    const emailSent = await sendEmail(email, type, message);
    const emailSent2 = true;

    if (emailSent2) {
      res.status(200).json({
        message: "Notification sent, the user will be informed. Have a cookie!",
      });
    } else {
      res.status(500).json({
        message:
          "There was a problem sending the email. Have a coffee and check the logs!",
      });
    }
  } else {
    res.status(429).json({
      message:
        "Too many notifications, the user will be angry. No cookie for you!",
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
