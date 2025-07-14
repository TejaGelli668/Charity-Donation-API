import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cause: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampaignCategory",
      required: true,
    },
    goal: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampaignStatus",
      required: true,
    },
    amount_raised: {
      type: Number,
      default: 0,
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
  { collection: "campaigns" } // Collection name for the campaign model
);

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
