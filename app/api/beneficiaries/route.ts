import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.beneficiaries.count();

    return NextResponse.json({ count });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch beneficiaries" },
      { status: 500 }
    );
  }
}