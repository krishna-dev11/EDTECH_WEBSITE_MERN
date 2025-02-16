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

    // check user allready Enrolled in  couse
    const isUserAlreadyHit = await courses.findOne({
      _id: courseId,
      studentEnrolled: userId,
      // or   studentEnrolled : {$elemMatch : {$eq : userId}}
    });

    if (!isUserAlreadyHit) {
      return res.status(404).json({
        success: false,
        message: " student is not Enrolled in Our Course",
      });
    }


    const AlreadyReviewd = await ratingAndReviews.findOne(
      {
        user :userId,
        course : courseId
      });
      if(AlreadyReviewd)
      {
        return res.status(403).json({
          success:false,
          message:"course alreday reviewd by the User"
        })
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
      data : createRatingandReviews
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

    const courseId  = req.body.courseId;
    const result = await ratingAndReviews.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
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
                                                    })
                                                    .populate({
                                                      path:"course",
                                                      select:"courseName"
                                                    }).exec();
                                                    

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

createRatingAndReviews , getAverageRating , getAllRatingAndReviews
