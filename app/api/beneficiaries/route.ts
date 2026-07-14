import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const beneficiaries = await prisma.beneficiaries.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const data = beneficiaries.map((item) => ({
      ...item,
      id: Number(item.id),
      amount_released: item.amount_released
        ? Number(item.amount_released)
        : null,
      installment: item.installment
        ? Number(item.installment)
        : null,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch beneficiaries" },
      { status: 500 }
    );
  }
}