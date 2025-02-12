const Tag = require("../Models/tags");
require('dotenv').config();

exports.createTags = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "fill add details completely and carefully",
      });
    }

    // extra mene lagaya hai
    const tagalreadyexist = await Tag.findOne({ name: name });

    if (tagalreadyexist) {
      return res.status(400).json({
        success: false,
        message:"you already created the similar tag previously",
      });
    }
    //

    const createnewtag = await Tag.create({
      name: name,
      description: description,
    });

    return res.status(200).json({
      success: true,
      message: "Tag created successfully in database",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "there would be some error on creating a new tag in database",
    });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });

    if (!allTags) {
      return res.status(400).json({
        success: false,
        message:
          "data base can't contain any of the tag so create some tags to published ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "all tags fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "some error occurs in fetching the all tags data from the database",
    });
  }
};
