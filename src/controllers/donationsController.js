import Donation from "../models/DonationModel.js";
import Campaign from "../models/CampaignModel.js";
import PaymentDetails from "../models/PaymentDetailsModel.js";
import CampaignStatus from "../models/CampaignStatusModel.js";

// Create a new donation and update the amount_raised field in the associated campaign
export const createDonation = async (req, res) => {
  const donationData = req.body;
  try {
    if (!donationData.user_id && !donationData.user_name) {
      donationData.user_name = "Anonymous";
    }

    // Create the new donation
    const newDonation = new Donation(donationData);

    // Get the current amount_raised in the associated campaign
    const campaign = await Campaign.findById(donationData.campaign_id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const statuses = await CampaignStatus.find();

    // Update the amount_raised field in the associated campaign
    const updatedAmountRaised = campaign.amount_raised + donationData.amount;
    const newCampaignData = { amount_raised: updatedAmountRaised };

    if (updatedAmountRaised >= campaign.goal)
      newCampaignData.status_id = statuses.find(
        ({ status }) => status === "Completed"
      )._id;

    await Campaign.findByIdAndUpdate(
      donationData.campaign_id,
      { $set: newCampaignData },
      { new: true }
    );

    // Create or update the payment details for the user or anonymous
    const query = donationData.user_id
      ? { user_id: donationData.user_id }
      : { user_name: "Anonymous" };

    let paymentDetails = await PaymentDetails.findOne(query);

    if (!paymentDetails) {
      // Create a new payment details document if it doesn't exist
      paymentDetails = new PaymentDetails({
        user_id: donationData.user_id || null,
        user_name: donationData.user_name,
        payments: [],
      });
    }

    // Add the new payment details for the donation
    paymentDetails.payments.push({
      donation_id: newDonation._id,
      payment_type: donationData.payment_type,
      card_number: donationData.card_number,
      card_name: donationData.card_name,
      expiry_month: donationData.expiry_month,
      expiry_year: donationData.expiry_year,
      cvv: donationData.cvv,
      status: "Paid", // You can set the initial status of the payment here
      total_amount: donationData.amount,
    });

    // Save the payment details
    await paymentDetails.save();

    // Save the new donation
    await newDonation.save();

    res.json(newDonation);
  } catch (error) {
    res.status(500).json({ error: "Failed to create donation" });
  }
};

// Get all donations
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

export const getAllDonationsByUserId = async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Fetch donations with user_id matching the provided user ID
    const donations = await Donation.find({ user_id: userId });

    // Fetch campaign details for the donations using the $in operator
    const campaignIds = donations.map((donation) => donation.campaign_id);
    const campaigns = await Campaign.find({ _id: { $in: campaignIds } });

    // Merge the donations and campaign details
    const donationsWithCampaigns = donations.map((donation) => {
      const campaign = campaigns.find(
        (c) => c._id.toString() === donation.campaign_id.toString()
      );
      return {
        _id: donation._id,
        user_id: donation.user_id,
        donation_status: donation.donation_status,
        donated_amount: donation.amount,
        refund_amount: donation.refund_amount,
        refund_status: donation.refund_status,
        created_on: donation.created_on,
        updated_on: donation.updated_on,
        campaign: campaign || null, // Include the campaign details or null if not found
      };
    });

    if (donationsWithCampaigns.length === 0) {
      return res
        .status(404)
        .json({ message: "No donations found for the user ID." });
    }

    res.json(donationsWithCampaigns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

export const getAllDonationsByCampaignId = async (req, res) => {
  const campaign_id = req.params.id;

  try {
    // Fetch donations with user_id matching the provided campaign ID
    const donations = await Donation.find({
      campaign_id,
      donation_status: "Success",
    });

    if (donations.length === 0) {
      return res
        .status(404)
        .json({ message: "No donations found for the campaign" });
    }

    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// Get a donation by ID
export const getDonationById = async (req, res) => {
  const id = req.params.id;
  try {
    const donation = await Donation.findById(id);
    if (!donation) {
      throw new Error("Donation not found");
    }
    res.json(donation);
  } catch (error) {
    res.status(404).json({ error: "Donation not found" });
  }
};

// Update a donation by ID for cancellation (handling refund amount and campaign amount_raised changes)
export const updateDonationById = async (req, res) => {
  const id = req.params.donation_id;

  try {
    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    // Calculate the refund amount
    const refundAmount = donation.amount - (donation.refund_amount || 0);

    // Update the donation for cancellation
    const updatedDonation = await Donation.findByIdAndUpdate(
      id,
      {
        donation_status: "Cancelled",
        refund_amount: donation.amount, // Set the refund_amount to the original donation amount
        refund_status: "Refunded", // Set the refund_status to "Processed" or any desired status for the cancellation
        ...req.body,
      },
      { new: true }
    );

    // Update the campaign's amount_raised field for donation cancellation
    const campaign = await Campaign.findById(donation.campaign_id);

    if (campaign) {
      const newAmountRaised = campaign.amount_raised - refundAmount;
      await Campaign.findByIdAndUpdate(donation.campaign_id, {
        $set: { amount_raised: newAmountRaised },
      });
    }

    return res.json(updatedDonation);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update donation" });
  }
};

// Delete a donation by ID
export const deleteDonationById = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedDonation = await Donation.findByIdAndRemove(id);
    if (!deletedDonation) {
      throw new Error("Donation not found");
    }

    // Update the amount_raised field in the associated campaign
    const campaign = await Campaign.findById(deletedDonation.campaign_id);
    if (campaign) {
      const updatedAmountRaised =
        campaign.amount_raised - deletedDonation.amount;
      await Campaign.findByIdAndUpdate(
        deletedDonation.campaign_id,
        { $set: { amount_raised: updatedAmountRaised } },
        { new: true }
      );
    }

    res.json(deletedDonation);
  } catch (error) {
    res.status(404).json({ error: "Donation not found" });
  }
};
