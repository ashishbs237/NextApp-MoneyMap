import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/utils/api/connectDB';
import User from '@/models/Users';
import { sendOtpMail } from '@/utils/api/sendOTP';

export async function POST(req: Request) {
    await connectDB();

    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser) {
        if (existingUser.isVerified) {
            return NextResponse.json(
                { data: { isVerified: true }, message: 'User already exists' },
                { status: 200 }
            );
        } else {
            // User exists but not verified – update OTP
            existingUser.otp = otp;
            existingUser.otpExpiry = otpExpiry;
            await existingUser.save();

            await sendOtpMail(email, otp);

            return NextResponse.json(
                {
                    data: { isVerified: false, otpId: existingUser._id },
                    message: 'OTP resent to email',
                },
                { status: 200 }
            );
        }
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false,
    });

    await sendOtpMail(email, otp);

    return NextResponse.json(
        {
            data: { isVerified: false, otpId: newUser._id },
            message: 'OTP sent to email',
        },
        { status: 200 }
    );
}
