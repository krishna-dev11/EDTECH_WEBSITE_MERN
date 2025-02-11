const mongoose = require("mongoose");

const ratingAndReviewsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  rating: {
    type: Number,
    required: true,
  },
  reviews: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("ratingAndReviews", ratingAndReviewsSchema);
