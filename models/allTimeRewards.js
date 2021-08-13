import mongoose from "mongoose";

const rewardsSchema = mongoose.Schema({
  user: { type: String },
  earnings: { type: Number, default: 0 },
  userReferrers: { type: [String], default: [] },
});

const AllTimeRewards = mongoose.model("allTimeRewards", rewardsSchema);

export default AllTimeRewards;
