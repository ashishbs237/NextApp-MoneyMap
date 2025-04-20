import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { envUtil } from '../envUtil';

const JWT_SECRET = envUtil.JWT_SECRET

export function signJwtToken(payload: object, expiresIn = '7d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export const verifyJwtToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        const error: any = new Error('No token found');
        error.status = 401;
        throw error;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err: any) {
        const error: any = new Error('Token invalid or expired');
        error.status = 401;
        throw error;
    }
};

