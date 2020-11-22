const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  useMarkdown: {
    type: Boolean,
    required: true,
    default: false
  },
  title: {
    type: String,
    required: true,
    default: "< 无 题 >",
    unique: true
  },
  description: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    required: true,
    default: "他什么都没有留下..."
  },
  nickName: {
    type: String,
    required: true,
    default: 'anonymous'
  },
  labels: {
    type: [String],
    required: false,
    default: "",
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("Blog", blogSchema);