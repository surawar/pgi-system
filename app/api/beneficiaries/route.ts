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
      id: Number(item.id),
      taluka: item.taluka,
      zp: item.zp,
      panchayat: item.panchayat,
      village_name: item.village_name,
      reg_no: item.reg_no,
      beneficiary: item.beneficiary,
      year: item.year,
      scheme_code: item.scheme_code,
      house_status: item.house_status,
      inspection_date: item.inspection_date,
      amount_released: item.amount_released
        ? Number(item.amount_released)
        : null,
      installment: item.installment
        ? Number(item.installment)
        : null,
      credit_date: item.credit_date,
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