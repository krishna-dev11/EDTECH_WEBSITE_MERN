const category = require("../Models/category");
require('dotenv').config();

exports.creatcategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "fill add details completely and carefully",
      });
    }

    // extra mene lagaya hai
    const categoryAlreadyExist = await category.findOne({ name: name });

    if (categoryAlreadyExist) {
      return res.status(400).json({
        success: false,
        message:"you already created the similar category previously",
      });
    }
    //

    const createNewCategory = await category.create({
      name: name,
      description: description,
    });

    return res.status(200).json({
      success: true,
      message: "Category created successfully in database",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "there would be some error on creating a new category in database",
    });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const allCategory = await category.find({}, { name: true, description: true });

    if (!allCategory) {
      return res.status(400).json({
        success: false,
        message:
          "data base can't contain any of the Category so create some categories to published ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "all category fetched successfully",
      data : allCategory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "some error occurs in fetching the all Category data from the database",
    });
  }
};


exports.categoryPageDetails = async (req, res) => {
  try {
          //get categoryId
          const {categoryId} = req.body;
          //get courses for specified categoryId
          const selectedCategory = await Category.findById(categoryId)
                                          .populate("courses")
                                          .exec();
          //validation
          if(!selectedCategory) {
              return res.status(404).json({
                  success:false,
                  message:'Data Not Found',
              });
          }
          //get coursesfor different categories
          const differentCategories = await Category.find({
                                       _id: {$ne: categoryId},
                                       })
                                       .populate("courses")
                                       .exec();

          //get top 10 selling courses
          //HW - write it on your own

          //return response
          return res.status(200).json({
              success:true,
              data: {
                  selectedCategory,
                  differentCategories,
              },
          });

  }
  catch(error ) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:error.message,
      });
  }
}

