// import mongoose module
const mongoose = require("mongoose");
// create schema 
const courseSchema = mongoose.Schema({
    courseName: String,
    duration: String,
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: String,
    avatar: String,
    students: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        note: Number,
        evaluation: String,
    }],


});
// create Model
const course = mongoose.model("Course", courseSchema);
// let exportable
module.exports = course;