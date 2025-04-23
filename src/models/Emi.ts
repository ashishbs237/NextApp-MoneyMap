import mongoose from "mongoose";

const EmiSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    amount: { type: Number, required: true },
    totalEmis: { type: Number, required: true },
    deductionDate: {
      type: Number,
      required: true,
      min: [1, "Deduction date must be between 1 and 31"],
      max: [31, "Deduction date must be between 1 and 31"],
    },
    startMonth: { type: Number, required: true }, // e.g., "04" or "April"
    startYear: { type: Number, required: true },
    tag: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Emi || mongoose.model("Emi", EmiSchema);
