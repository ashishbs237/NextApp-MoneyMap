import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signJwtToken } from "@/utils/api/jwt";
import connectDB from '@/utils/api/connectDB';
import User from '@/models/Users';
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (!user) return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });

        if (!user.isVerified) {
            return NextResponse.json({ message: 'Email not verified' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });

        const token = signJwtToken({ _id: user._id, email: user.email });

        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({ data: { name: user.name, email: user.email, token }, message: 'Login successful' }, { status: 200 });

    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
