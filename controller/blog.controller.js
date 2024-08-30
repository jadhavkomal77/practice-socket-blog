const asyncHandler = require("express-async-handler")
const Blog = require("../models/Blog")
const { io } = require("../socket/socket")


exports.getBlog = asyncHandler(async (req, res) => {
    const result = await Blog.find()
    io.emit("blog-create", result)
    res.json({ message: "Blog Fetch Success", result })
})

exports.addBlog = asyncHandler(async (req, res) => {
    await Blog.create(req.body)
    const result = await Blog.find()
    io.emit("blog-create", result)
    res.json({ message: "Blog Create Success" })
})

exports.updateBlog = asyncHandler(async (req, res) => {
    await Blog.findByIdAndUpdate(req.params.id, req.body)
    const result = await Blog.find()
    io.emit("blog-create", result)
    res.json({ message: "Blog Update Success" })
})

exports.deleteBlog = asyncHandler(async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id)
    const result = await Blog.find()
    io.emit("blog-create", result)
    res.json({ message: "Blog Delete Success" })
})