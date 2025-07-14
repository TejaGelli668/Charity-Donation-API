import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user_id: { type: mongoose.Types.ObjectId },
    user_name: { type: String, required: true },
    payments: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        }, // Generate a new unique _id for each payment object
        donation_id: { type: mongoose.Types.ObjectId, required: true },
        payment_type: { type: String, required: true },
        card_number: { type: String, required: true },
        card_name: { type: String, required: true },
        expiry_month: { type: Number, required: true },
        expiry_year: { type: Number, required: true },
        cvv: { type: String, required: true },
        status: { type: String, required: true },
        total_amount: { type: Number, required: true },
        created_on: { type: Date, default: Date.now },
        updated_on: { type: Date, default: Date.now },
      },
    ],
  },
  { collection: "payment_details" }
);

const PaymentDetail = mongoose.model("PaymentDetail", paymentSchema);

export default PaymentDetail;
