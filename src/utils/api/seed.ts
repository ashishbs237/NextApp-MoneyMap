import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/Users';

// Sample dummy users
const users = [
    {
        name: 'Ashish Patel',
        email: 'ashish@gmail.com',
        password: 'admin@123', // You can change these passwords
        isVerified: true,
    },
    {
        name: 'Kalyani Patel',
        email: 'kalyani@gmail.com',
        password: 'admin@123',
        isVerified: true,
    },
    {
        name: 'Shashwat Patel',
        email: 'shashwat@gmail.com',
        password: 'admin@123',
        isVerified: true,
    },
    {
        name: 'Ritu Patel',
        email: 'ritu@gmail.com',
        password: 'admin@123',
        isVerified: true,
    },
];

export const createDummyUsers = async () => {
    try {
        // Connect to the database
        await connectDB();

        // Loop through each user, hash the password and insert into the database
        const usersWithHashedPassword = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return {
                    ...user,
                    password: hashedPassword,
                    otp: Math.floor(100000 + Math.random() * 900000).toString(), // Generate OTP for unverified users
                    otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // OTP expiration time
                };
            })
        );

        // Insert users into MongoDB
        await User.insertMany(usersWithHashedPassword);
        console.log('Dummy users added successfully');
    } catch (error) {
        console.error('Error adding dummy users:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

async function connectDB() {
    const mongoUri = "mongoUri"
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(mongoUri, {
            dbName: 'moneymap',
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}
// Run the script
createDummyUsers();
