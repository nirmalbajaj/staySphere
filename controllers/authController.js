const { check, validationResult } = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: [],
      oldInput: {email: ""},
      user: {},
    });
}

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
      pageTitle: "Signup",
      currentPage: "signup",
      isLoggedIn: false,
      errors: [],
      oldInput: {
          firstName: "",
          lastName: "",
          email: "",
          userType: "",
          user: {},
      }
  })
}

exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name must only contain letters and spaces"),

  check("lastName")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Last name must only contain letters and spaces"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Password do not match")
        }
        return true
    }),

  check("userType")
    .notEmpty()
    .withMessage("Please select a user type")
    .isIn(['guest', 'host'])
    .withMessage("Please select a valid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept the terms and conditions")
    .custom((value, {req}) => {
        if (value !== "on") {
            throw new Error("Please accept the terms and conditions")
        }
        return true
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render("auth/signup", {
            pageTitle: "Signup",
            currentPage: "signup",
            isLoggedIn: false,
            errors: errors.array().map(error => error.msg),
            oldInput: { firstName, lastName, email, password, userType },
            user: {}
        })
    }

    bcrypt.hash(password,12).then(hashedPassword => {
      const user = new User({firstName, lastName, email, password: hashedPassword, userType})
      return user.save()
    }).then(() => {
      res.redirect("/login")
    }).catch(err => {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: [err.message],
        oldInput: { firstName, lastName, email, userType },
        user: {},
      })
    })
  }
];

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({email})
    if (!user) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["User does not exist"],
        oldInput: {email},
        user: {},
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["Invalid Password"],
        oldInput: {email},
        user: {},
      })
    }

    req.session.isLoggedIn = true
    req.session.user = user
    await req.session.save()
    res.redirect("/")
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/login")
    })
}



