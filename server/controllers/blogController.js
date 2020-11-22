const Blog = require('../models/blog');

module.exports = {
    async createBlog (req, res) {
        if (req.body) {
            if (req.body.nickName !== "李玄苍")
                return res.status(404).send(JSON.stringify({
                    msg: '用户名不正确'
                }))
            try {
                await Blog.create(req.body);
            } catch (error) {
                return res.status(400).send(
                    JSON.stringify({
                        msg: "已有重复标题",
                    })
                );
            }
            return res.status(200).send(
                JSON.stringify({
                    msg: "创建成功",
                })
            );
        } else {
            return res.status(400).send(
                JSON.stringify({
                    msg: '服务器发生了一点小故障...'
                })
            )
        }
    },

    async getAllBlogs (req, res) {
        console.log("getAllBlogs");
        const Blogs = await Blog.find().limit(10);
        return res.status(200).send(JSON.stringify(Blogs));
    },

    async getBlogDetail (req, res) {
        if (req.body && req.body.query) {
            const queryTitle = req.body.query;
            const blog = await Blog.findOne({
                title: queryTitle
            }, "content useMarkdown views");
            blog.views += 1;
            blog.save();
            res.status(200).send(JSON.stringify(blog));
        } else {
            return res.status(404).send(JSON.stringify({
                msg: "Page Not Found"
            }));
        }
    },
    
    async updateLikesNum (req, res) {
        try {
            await Blog.findOneAndUpdate({ title: req.query.title}, {$inc: {likes: 1}},);
            return res.status(200).send(JSON.stringify({
                msg: "ok"
            }));
        } catch (error) {
            return res.status(500).send(JSON.stringify(error));
        }
    },

    async getLastestBlogs (req, res) {
        console.log("getLastestBlogs");
        try {
            const ans = await Blog.find().limit(7).sort({createDate: -1});
            res.status(200).send(JSON.stringify(ans));
        } catch(error) {
            return res.status(500).send(JSON.stringify({
                msg: error
            }));
        }
    }
}