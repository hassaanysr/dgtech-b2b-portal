import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (!MONGODB_URI) return false; // Smart fallback if DB isn't connected yet
  if (mongoose.connection.readyState >= 1) return true;
  try {
    await mongoose.connect(MONGODB_URI);
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
}

// B2B Lead / RFQ Schema (With Input Validation for App Security)
const LeadSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true, maxlength: 100 },
  contactEmail: { type: String, required: true, trim: true },
  machineModel: { type: String, required: true },
  inquiryDetails: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

export const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);