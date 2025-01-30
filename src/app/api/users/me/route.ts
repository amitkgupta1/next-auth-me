import { connectDB } from "@/db/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDB();

export async function POST(req: NextRequest) {
    const userId = await getDataFromToken(req);

    if (!userId) {
        return NextResponse.json({ message: "Invalid User" }, { status: 401 });
    }
    const user = await User.findById(userId)
    .select("-password");

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        message: "User found",
        data: user
    });
}
