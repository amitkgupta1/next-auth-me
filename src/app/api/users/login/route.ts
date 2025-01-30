import { connectDB } from "@/db/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
 
connectDB();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { email, password } = reqBody;
        console.log("reqBody: " + reqBody)
        if (!email ||!password) {
            return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User does not exists..!" }, { status: 400 });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid password" }, { status: 400 });
        }

        const payload = {
            id: user._id,
            email: user.email,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });

        //return NextResponse.json({ message: "Logged in successfully", token });

        const response = NextResponse.json({
            message: "Logged in successfully",
            token,
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        });
        return response;
        
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, {status: 500});
    }
}
