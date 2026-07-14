import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const beneficiaries = await prisma.beneficiaries.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      count: beneficiaries.length,
      firstId: beneficiaries[0]?.id.toString(),
      lastId: beneficiaries[beneficiaries.length - 1]?.id.toString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch beneficiaries" },
      { status: 500 }
    );
  }
}