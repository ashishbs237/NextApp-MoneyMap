import mongoose from "mongoose";

const InvestmentLabelSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    note: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.InvestmentLabel ||
  mongoose.model("InvestmentLabel", InvestmentLabelSchema);
