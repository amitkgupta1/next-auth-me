import { connectDB } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest) {
    try {
        const response = NextResponse.json({
            message: "Logout Successfully",
            status: 200,
            success: true
        })

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return response;

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
