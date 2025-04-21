import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
    {
        label: { type: String, required: true },
        amount: { type: Number, required: true },
        tag: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Expense ||
    mongoose.model("Expense", ExpenseSchema);