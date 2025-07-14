import mongoose, { Schema } from "mongoose";

const campaignStatusSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
    },
  },
  { collection: "campaign_status" }
);

const CampaignStatus = mongoose.model("CampaignStatus", campaignStatusSchema);

export default CampaignStatus;
