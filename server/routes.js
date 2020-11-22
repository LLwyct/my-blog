const BlogController = require("./controllers/blogController");

module.exports = (app) => {
    app.get("/api/getAllBlogs",
        BlogController.getAllBlogs
    )
    app.get("/api/getLastestBlogs",
        BlogController.getLastestBlogs
    )
    app.post("/api/createblog",
        BlogController.createBlog
    )
    app.post("/api/getBlogDetail",
        BlogController.getBlogDetail
    )
    app.put("/api/updateLikesNum",
        BlogController.updateLikesNum
    )
}