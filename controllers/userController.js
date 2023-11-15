const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { createHash } = require("../helpers/authentication");
const passport = require("passport");

/* SIGN-UP-GET */
exports.sign_up_get = (req, res, next) => {
    return res.render("sign-up-form", { title: "Crear Usuario" });
};

/* SIGN-UP-POST */
exports.sign_up_post = [
    body("username")
        .trim()
        .custom(async (value) => {
            const user = await User.findOne({ username: value });
            if (user) {
                return await Promise.reject("El username ya esta en uso");
            }
            return true;
        })
        .isLength({ min: 4, max: 18 })
        .withMessage("Username es requerido (4-18 caracteres) ")
        .escape(),
    body("firstname", "Nombre es requerido (3 - 18 caracteres) ")
        .trim()
        .isLength({ min: 2, max: 18 })
        .escape(),
    body("lastname", "Apellido es requerido (3-18 caracteres) ")
        .trim()
        .isLength({ min: 2, max: 18 })
        .escape(),
    body("password", "Contraseña deberia tener minimo 6 caracteres")
        .trim()
        .isLength({ min: 6 })
        .escape(),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas no coinciden")
        }
        return true;
    }),
    
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const user = new User({
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.password,
            });
            return res.render("sign-up-form", {
                title: "Crear usuario",
                user: user,
                errors: errors.array(),
            });
        }

        try {
            const passwordHash = await createHash(req.body.password);
            const user = await new User({
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: passwordHash,
            }).save();

            await req.login(user, (err) => {
                if (err) return next(err);
                return res.redirect("/");
            });
        } catch (err) {
            return next(err);
        }
    },
];

//MEMBERSHIP GET
exports.membership_get = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    return res.render("membership-form", { title: "Se un miembro" });
};

//MEMBERSHIP POST
exports.membership_post = async (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login");
    }

    if (req.body.code !== process.env.MEMBERSHIP_CODE) {
        return res.render("membership-form", {
            title: "Se un miembro",
            error: "Codigo incorrecto",
        });
    }
    try {
        const user = req.user;
        user.isMember = true;
        await user.save();

        return res.redirect("/");
    } catch (err) {
        return next(err);
    };
}