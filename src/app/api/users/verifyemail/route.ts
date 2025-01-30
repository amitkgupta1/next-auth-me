import { connectDB } from "@/db/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const {token} = reqBody
        console.log("token: " + token);
        if(!token){
            return NextResponse.json({ error: "Token not provided." }, {status: 400});
        }

        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: {$gt: Date.now()} });

        if (!user) {
            return NextResponse.json({ error: "Invalid token." }, {status: 401});
        }
        console.log("user: " + user);
        
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({ 
            message: "Email verified successfully.",
            success: true
        }, { status: 200});

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, {status: 500});
    }
}
