const { default: mongoose } = require("mongoose");
const courses = require("../Models/courses");
const ratingAndReviews = require("../Models/ratingAndReviews");
const user = require("../Models/user");

exports.createRatingAndReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, rating, reviews } = req.body;

    const iscourseExist = await courses.findOne({ _id: courseId });
    if (!iscourseExist) {
      return res.status(400).json({
        success: false,
        message: "Course Not Found",
      });
    }

    // check user allready hit the review and rating or not
    const isUserAlreadyHit = await courses.findOne({
      _id: courseId,
      studentEnrolled: userId,
      // or   studentEnrolled : {$elemMatch : {$eq : userId}}
    });

    if (isUserAlreadyHit) {
      return res.status(400).json({
        success: false,
        message: " you are already hits the rating and reviews on these course",
      });
    }

    const createRatingandReviews = await ratingAndReviews.create({
      user: userId,
      rating: rating,
      reviews: reviews,
    });

    const updateCourse = await courses.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: createRatingandReviews._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "rating and reviews are successfully created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "some error occurs in creating the rating and reviews",
    });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const result = await ratingAndReviews.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId.toString()),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "average rating is produced successfully",
        averageRating: result[0].averageRating,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Average Rating is 0, no ratings given till now",
      averageRating: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "some error in producing th average rating",
    });
  }
};

exports.getAllRatingAndReviews = async (req, res) => {
  try {
    const allRatingAndReviews = await ratingAndReviews.find({})
                                                   .sort({rating:"desc"})
                                                   .populate({
                                                            path:"user",
                                                            select:"firstName lastName email image"
                                                    });

    return res.status(200).json({
      success: true,
      message: "All rating andreviews are fetched successfully",
      data : allRatingAndReviews
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "some error occurs on fetching all the rating and reviews data from the dataBase",
    });
  }
};
