import Campaign from "../models/CampaignModel.js";
import CampaignStatus from "../models/CampaignStatusModel.js";
import CampaignCategory from "../models/CampaignCategoryModel.js";
import User from "../models/UserModel.js";

// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the campaign." });
  }
};

// Get all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("category_id")
      .populate("status_id")
      .sort({ start_date: 1 })
      .exec();

    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaigns." });
  }
};

export const getAllCampaignsByUsers = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("category_id")
      .populate("status_id")
      .sort({ start_date: 1 })
      .exec();

    // Get an array of unique user IDs from the campaigns
    const userIds = [...new Set(campaigns.map((campaign) => campaign.user_id))];

    // Fetch user details from the User collection based on the user_ids
    const users = await User.find({ _id: { $in: userIds } });

    // Create a map of user_id to user details for easy merging
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = { name: user.name, email: user.email };
    });

    // Merge user details into the campaigns array based on user_id
    const campaignsWithUserDetails = campaigns.map((campaign) => {
      const user = userMap[campaign.user_id.toString()];
      return {
        ...campaign._doc,
        user_details: { name: user.name, email: user.email },
      };
    });

    res.status(200).json(campaignsWithUserDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaigns." });
  }
};

//getAllCampaignsByUsers

// Get a campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("category_id")
      .populate("status_id")
      .exec();
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the campaign." });
  }
};

export const getCampaignByUserId = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user_id: req.params.id })
      .populate("category_id")
      .populate("status_id")
      .exec();

    if (campaigns.length === 0) {
      return res
        .status(404)
        .json({ error: "Campaigns not found for the user." });
    }

    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the campaigns." });
  }
};

// Update a campaign by ID
export const updateCampaignById = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const updateFields = req.body;

    // Find the campaign by ID and update only the specified fields
    const updatedCampaign = await Campaign.findOneAndUpdate(
      { _id: campaignId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the campaign." });
  }
};

// Delete a campaign by ID
export const deleteCampaignById = async (req, res) => {
  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!deletedCampaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }
    res.status(200).json({ message: "Campaign deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the campaign." });
  }
};

// Get all campaign statuses
export const getAllCampaignStatuses = async (req, res) => {
  try {
    const statuses = await CampaignStatus.find();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaign statuses." });
  }
};

// Get all campaign categories
export const getAllCampaignCategories = async (req, res) => {
  try {
    const categories = await CampaignCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaign categories." });
  }
};
