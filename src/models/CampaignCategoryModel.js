import mongoose, { Schema } from "mongoose";

const campaignCategorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
  },
  { collection: "categories" }
);

const CampaignCategory = mongoose.model(
  "CampaignCategory",
  campaignCategorySchema
);

export default CampaignCategory;
