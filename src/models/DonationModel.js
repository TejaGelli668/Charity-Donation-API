import mongoose from "mongoose";

const { Schema } = mongoose;

const donationSchema = new Schema(
  {
    campaign_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    user_name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    donation_status: {
      type: String,
      required: true,
    },
    refund_amount: {
      type: Number,
      default: 0,
    },
    refund_status: {
      type: String,
      default: "Not Applicable",
    },
    created_on: {
      type: Date,
      default: Date.now,
    },
    updated_on: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "donations" } // Collection name for the donation model
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
