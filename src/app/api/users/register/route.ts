import { connectDB } from "@/db/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { userName, email, password } = reqBody;
        
        if (!userName ||!email ||!password) {
            return NextResponse.json({ message: "All fields are required..." }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ message: "User already exists..." }, { status: 409 });
        }
        
        const hashedPassword = await bcryptjs.hash(password, 10);
        
        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword
        });

        const createdUser = await User.findById(newUser._id).select("-password");
        if (!createdUser) {
            return NextResponse.json({ message: "Failed to register user..." }, { status: 400 });
        }

        console.log("userName: " + createdUser.userName)
        console.log("email: " + createdUser.email)

        // Send Verification Email
        await sendEmail({
            email: newUser.email,
            emailType: "VERIFY",
            userId: newUser._id
        });
        
        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            user: createdUser
        });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
