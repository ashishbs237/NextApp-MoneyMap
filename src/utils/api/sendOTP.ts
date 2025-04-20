import nodemailer from 'nodemailer';
import { envUtil } from '../envUtil';

export async function sendOtpMail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: envUtil.USER_EMAIL,
            pass: envUtil.GOOGLE_APP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"MoneyMap" <${envUtil.USER_EMAIL}>`,
        to: email,
        subject: 'Verify your email',
        html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });
}
