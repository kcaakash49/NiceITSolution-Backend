import { Request, Response } from "express";
import { mailSchema } from "../validators/mailValidation.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async(req:Request, res: Response) => {
    const parsed = mailSchema.safeParse(req.body);
    if (!parsed.success) {
        return res
          .status(422)
          .json({ message: "Validation failed", errors: parsed.error.issues });
    }
    try {
        const { name, email, message } = parsed.data;
        await resend.emails.send({
            from: "No Reply <no-reply@niceitsolution.com>",
            to: ["info@niceitsolution.com"],
            replyTo: email,
            subject: `New Contact Form Message from ${name}`,
            html: `
              <h3>New Inquiry</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong><br/>${message}</p>
            `,
          });

          return res.status(200).json({
            message: "Message Sent Successfully!!!",
            success: true
          })
    }catch(e){
        console.error(e);
        res.status(500).json({ success: false, error: "Failed to send email" });
    }
}