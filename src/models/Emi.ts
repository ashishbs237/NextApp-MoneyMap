import mongoose from "mongoose";

const EmiSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    amount: { type: Number, required: true },
    totalEmis: { type: Number, required: true },
    deductionDate: { type: Number, require: true },
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
