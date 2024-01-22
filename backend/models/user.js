// import mongoose module
const mongoose = require("mongoose");
// var uniqueValidator = require('mongoose-unique-validator');
// create user schema 
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    address: String,
    tel: Number,

    // tel: { type: String, unique: true },
    role: String,
    gender: String,
    childTel: Number,
    children:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

    avatar: String,
    speciality: String,
    status: String,
    cv: String,
    courses:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }]
        ,
    studentCourses:
        [{
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
            note: Number,
            evaluation: String,
        }]

});
// userSchema.plugin(uniqueValidator);

userSchema.pre("save", function (next) {
    const user = this;
    return new Promise(async (resolve, reject) => {

        if (user.role != "teacher") {
            user.courses = undefined; 
        }

        if (user.role != "parent") {
            user.children = undefined; 
        }

        if (user.role != "student") {
            user.studentCourses = undefined; 
        }

        resolve();
    })
        .then(() => next())
        .catch(error => next(error)); 
});

const user = mongoose.model("User", userSchema);

// let user exportable
module.exports = user;