import { NextResponse } from 'next/server';
import connectDB from '@/utils/api/connectDB';
import User from '@/models/Users';

export async function POST(req: Request) {
    await connectDB();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    if (user.otp !== otp || new Date() > user.otpExpiry) {
        return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Email verified successfully' });
}
