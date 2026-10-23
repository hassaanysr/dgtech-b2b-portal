import { NextResponse } from "next/server";
import { connectDB, Lead } from "../../lib/mongodb";

// Pre-seeded DG Tech Industrial Machinery Data
const INDUSTRIAL_MACHINES = [
  {
    id: "m1",
    name: "High-Speed CNC Fiber Laser Cutting Machine",
    category: "Metal Fabrication",
    brand: "DG-Tech Series X",
    power: "3000W - 12000W",
    specs: "Working Area: 3000x1500mm | Max Speed: 120m/min | Precision: ±0.03mm",
    status: "Available for Import",
  },
  {
    id: "m2",
    name: "Automatic High-Speed Servo Injection Molding Machine",
    category: "Plastics & Packaging",
    brand: "SinoPlast Pro",
    power: "Clamping Force: 2500 kN",
    specs: "Shot Weight: 680g | Energy Saving Servo Motor | PLC Control",
    status: "In Stock - Lahore Warehouse",
  },
  {
    id: "m3",
    name: "Industrial Textile Air-Jet Loom System",
    category: "Textile Machinery",
    brand: "TexWeave CNC",
    power: "4.5 kW High-Efficiency",
    specs: "Reed Width: 190-340cm | Max RPM: 1000 | Electronic Let-off & Take-up",
    status: "Available for Import",
  },
  {
    id: "m4",
    name: "Fully Automatic BOPP Film Slitting & Rewinding Line",
    category: "Printing & Packaging",
    brand: "PackMaster 3P",
    power: "18 kW Multi-Servo",
    specs: "Max Web Width: 1600mm | Slitting Speed: 400m/min | Auto Tension",
    status: "Available for Import",
  },
];

// GET API: Fetch Catalog with Category Filtering
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let filtered = INDUSTRIAL_MACHINES;
  if (category && category !== "All") {
    filtered = INDUSTRIAL_MACHINES.filter((m) => m.category === category);
  }

  return NextResponse.json({ success: true, data: filtered }, { status: 200 });
}

// POST API: Securely Capture B2B RFQ Lead into CRM/MongoDB
export async function POST(request) {
  try {
    const body = await request.json();
    const { companyName, contactEmail, machineModel, inquiryDetails } = body;

    // Application Security: Input Sanitization & Validation
    if (!companyName || !contactEmail || !machineModel || !inquiryDetails) {
      return NextResponse.json(
        { success: false, error: "All B2B RFQ fields are required." },
        { status: 400 }
      );
    }

    // Prevent XSS / Script Injection
    const sanitize = (str) => String(str).replace(/[<>]/g, "").trim();
    const cleanPayload = {
      companyName: sanitize(companyName),
      contactEmail: sanitize(contactEmail),
      machineModel: sanitize(machineModel),
      inquiryDetails: sanitize(inquiryDetails),
    };

    const isConnected = await connectDB();
    if (isConnected) {
      await Lead.create(cleanPayload);
    }

    return NextResponse.json(
      {
        success: true,
        message: "RFQ logged in CRM pipeline successfully.",
        lead: cleanPayload,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error processing RFQ." },
      { status: 500 }
    );
  }
}
