import { NextResponse } from "next/server";
import bundleData from "../../data/bundle.json";

export async function GET() {
  return NextResponse.json({
    message: "Bundle data loaded successfully.",
    results: bundleData,
    status: "success",
  });
}
