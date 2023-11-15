const Post = require('../models/Post');
const { body, validationResult } = require("express-validator");

// NEW POST GET
exports.new_post_get = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login");
    }

    return res.render("new-post-form", { title: "Crear un nuevo Post" });
}

// NEW POST POST
exports.new_post_post = [
    body("title", "El titulo deberia tener al menos 2 caracteres")
        .trim()
        .isLength({ min: 2 })
        .escape(),
    body("content", "El texto deberia tener al menos 2 caracteres")
        .trim()
        .isLength({ min: 2 })
        .escape(),
    async (req, res, next) => {
        if (!req.user) {
            return res.redirect("/login");
        }

        const post = new Post({
            user: req.user._id,
            title: req.body.title,
            text: req.body.content,
        });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.render("new-post-form", {
                title: "Crear nuevo Post",
                post: post,
                errors: errors.array(),
            });
        }

        try {
            await post.save();
            return res.redirect("/");
        } catch (err) {
            return next(err);
        }
    },
];

// SHOW LIST OF POSTS
exports.post_list = async (req, res, next) => {
    try {
        if (!req.user || !req.user.isMember) {
            const posts = await Post.find().sort({ timestamp: -1 });
            return res.render("home", { posts: posts });
        }
        const posts = await Post.find().sort({ timestamp: -1 }).populate("user");
        return res.render("home-member", { posts: posts });
    } catch (err) {
        return next(err);
    }
};

// DELETE POST POST
exports.delete_post = async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.redirect("/");
    }
    try {
        await Post.findByIdAndDelete(req.params.id);
        return res.redirect("/");
    } catch (err) {
        return next(err);
    }
};
