import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
    {
        label: { type: String, required: true },
        amount: { type: Number, required: true },
        tag: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Investment ||
    mongoose.model("Investment", InvestmentSchema);