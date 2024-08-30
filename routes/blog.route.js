const blogcontroller = require("../controller/blog.controller")

const router = require("express").Router()

router

    .get("/get", blogcontroller.getBlog)
    .post("/add", blogcontroller.addBlog)
    .put("/update/:id", blogcontroller.updateBlog)
    .delete("/delete/:id", blogcontroller.deleteBlog)

module.exports = router