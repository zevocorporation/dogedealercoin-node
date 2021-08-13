import mongoose from "mongoose";

const rewardsSchema = mongoose.Schema({
  user: { type: String },
  earnings: { type: Number, default: 0 },
  userReferrers: { type: [String], default: [] },
});

const WeeklyRewards = mongoose.model("weeklyRewards", rewardsSchema);

export default WeeklyRewards;
