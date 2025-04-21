export const envUtil = {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    MONGODB_URI: process.env.NEXT_APP_MONGODB_URI || '',
    USER_EMAIL: process.env.SMTP_USER,
    USER_PASS: process.env.SMTP_PASS,
    GOOGLE_APP_PASS: process.env.GOOGLE_APP_PASS,
    JWT_SECRET: process.env.JWT_SECRET
}