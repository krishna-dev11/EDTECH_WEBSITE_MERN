const mongoose = require("mongoose");

const ratingAndReviewsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "user",
  },
  rating: {
    type: Number,
    required: true,
  },
  reviews: {
    type: String,
    trim: true,
    required:true
  },
  course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "courses",
		index: true,
	}
});

module.exports = mongoose.model("ratingAndReviews", ratingAndReviewsSchema);
