// import express module
const express = require("express");
// import body parser
const bodyParser = require("body-parser");

// import jsonwebtoken module
const jwt = require("jsonwebtoken");

// import cors
const cors = require('cors');


// import axios module
const axios = require("axios");

// import express-session module
const session = require("express-session");

// import bcrypt module
const bcrypt = require("bcrypt");

// import mongoose module
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/validationDB');

// import path and multer
const path = require('path');
const multer = require('multer');

// creer une app BE named app
const app = express();

// configurer body-parser pour structurer la reponse du BE sous format Json
app.use(bodyParser.json());
//  configurer body-parser pour parser le req reçu du FE (acceder au contenu)
app.use(bodyParser.urlencoded({ extended: true }));
// cors config
app.use(cors());

//security config
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS, PATCH, PUT");
    next();
})
app.use('/images', express.static(path.join('backend/images')));
app.use('/docs', express.static(path.join('backend/docs')));

const MIME_TYPE_IMG = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const MIME_TYPE_DOC = {
    'application/pdf': 'pdf',
};


const storage = multer.diskStorage({
    // destination
    destination: (req, file, cb) => {
        const isImg = MIME_TYPE_IMG[file.mimetype];
        const isDoc = MIME_TYPE_DOC[file.mimetype];
        if (isImg) {
            cb(null, 'backend/images')
        } else if (isDoc) {
            cb(null, 'backend/docs')
        }

    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        let extension = MIME_TYPE_IMG[file.mimetype];
        if (!extension) {
            extension = MIME_TYPE_DOC[file.mimetype];
        }
        const filename = name + '-' + Date.now() + '-crococoder-' + '.' +
            extension;
        cb(null, filename);
    }
});


const secretKey = "croco-amira-28-dev";

app.use(session({
    secret: secretKey,
}));

// import models
const User = require('./models/user');
const Course = require('./models/course');


// Business Logic

// get quote
app.get("/quotes", (req, res) => {
    console.log("Here into getQuote")

    axios.get(`https://api.api-ninjas.com/v1/quotes?category=education`, {
        headers: {
            'X-Api-Key': 'URK3T4ypSB7F8LZhat25Qg==39DRVxtOKJCdnDnT',
            'Content-Type': 'application/json',
        }
    }).then(
        (apiRes) => {
            console.log("Here is APIRes", apiRes.data)
            let quote = {
                quote: apiRes.data[0].quote,
                author: apiRes.data[0].author

            }
            console.log("Here is quote", quote)

            res.json({
                quote: quote
            });
        })
})

// Business Logic : Signup User
app.post("/users/signup", multer({ storage: storage }).fields([
    { name: 'img', maxCount: 1 },
    { name: 'doc', maxCount: 1 },
]), (req, res) => {
    let obj = req.body;
    console.log("Here signup BL", obj);
    User.findOne({ tel: obj.tel }).then(
        (doc) => {
            if (doc) {
                return res.json({
                    msg: "Error tel is not unique"
                })
            }
            else {
                bcrypt.hash(obj.password, 10).then(
                    (cryptedPwd) => {
                        console.log("Here crypted pwd", cryptedPwd);
                        obj.password = cryptedPwd;
                        obj.avatar = `http://localhost:3000/images/${req.files['img'][0].filename}`;
                        if (obj.role == "parent") {
                            User.findOne({ tel: obj.childTel }).then(
                                (child) => {
                                    if (!child || child.role != "student") {
                                        return res.json({
                                            msg: "Student not found"
                                        })
                                    }
                                    let user = new User(obj);
                                    user.children.push(child._id)
                                    saveUser(user);
                                });
                        } else if (obj.role == "teacher") {
                            obj.cv = `http://localhost:3000/docs/${req.files['doc'][0].filename}`;
                            let user = new User(obj);
                            saveUser(user);
                        } else {
                            let user = new User(obj);
                            saveUser(user);
                        }
                        function saveUser(user) {
                            user.save((err, doc) => {
                                console.log("user in save", user);
                                console.log("Error", err);
                                (err)
                                    ? res.json({ msg: "Error" })
                                    : res.json({ msg: "success" });
                            })
                        };
                    });
            }
        })

});
// Business Logic : Edit User
app.put("/users/editUser", multer({ storage: storage }).fields([
    { name: 'img', maxCount: 1 },
    { name: 'doc', maxCount: 1 },
]), (req, res) => {
    console.log("Here into BL: userEdit", req.body);
    let user = req.body;
    user._id = mongoose.Types.ObjectId(user._id);

    User.findById(user._id).then(
        (oldUser) => {
            if (!oldUser) {
                return res.json({
                    msg: "Use notFound"
                })
            }
            bcrypt.compare(user.password, oldUser.password).then(
                (compareResult) => {
                    if (!compareResult) {
                        return res.json({
                            msg: "pwdNotCorrect"
                        })
                    }
                    User.findOne({ _id: { $ne: user._id }, tel: user.tel }).then(
                        (telExists) => {
                            if (telExists) {
                                return res.json({
                                    msg: "Error tel is not unique"
                                })
                            }

                            if (req.files['img']) {
                                user.avatar = `http://localhost:3000/images/${req.files['img'][0].filename}`;
                            }

                            if (req.files['doc']) {
                                user.cv = `http://localhost:3000/docs/${req.files['doc'][0].filename}`;
                            }

                            bcrypt.hash(user.password, 10).then(
                                (cryptedPwd) => {
                                    console.log("Here crypted pwd", cryptedPwd);
                                    user.password = cryptedPwd;
                                    console.log("User before updateOne", user);
                                    User.updateOne({ _id: user._id }, user).then(
                                        (updateResponse) => {
                                            console.log("here update response", updateResponse);
                                            if (updateResponse.nModified == 1) {
                                                return res.json({
                                                    msg: "success"
                                                })
                                            } else {
                                                return res.json({
                                                    msg: "error"
                                                })
                                            }
                                        }
                                    )

                                });
                        });



                })
        }
    )

})





// business logic to login
app.post("/users/login", (req, res) => {
    console.log("Here into login BL", req.body);
    let obj = req.body;
    User.findOne({ tel: obj.tel }).then(
        (doc) => {
            if (!doc) {
                return res.json({
                    msg: "Tel not found"
                })
            }
            if (doc.status == "notValidated") {
                return res.json({
                    msg: "Teacher not yet validated"
                })
            }
            bcrypt.compare(req.body.password, doc.password).then(
                (compareResult) => {
                    if (!compareResult) {
                        return res.json({
                            msg: "False"
                        })
                    }
                    let userToSend = {
                        fName: doc.firstName,
                        lName: doc.lastName,
                        id: doc._id,
                        role: doc.role,
                    }
                    const token = jwt.sign(userToSend, secretKey, {
                        expiresIn:
                            '1h'
                    })
                    res.json({
                        token: token,
                        msg: "User found"
                    })
                }
            )
        }
    )
});
// get users by role
app.get("/users/role/:role", (req, res) => {
    console.log("Here into BL : getUsersByRole", req.params.role);
    let query = User.find({ role: req.params.role });
    if (req.params.role == "parent") {
        query = query.populate('children');
    } else if (req.params.role == "teacher") {
        query = query.populate({
            path: 'courses',
            populate: {
                path: 'students.studentId',
                model: 'User'
            }
        });
    }
    else if (req.params.role == "student") {
        query = query.populate('studentCourses.courseId');
    }
    query.then(
        (docs) => {
            console.log("getUsersByRole", docs);
            res.json({
                T: docs
            })

        }
    );
});


// getUserById
app.get("/users/id/:id", (req, res) => {
    console.log("Here into BL:getUserById");
    let userId = req.params.id;

    User.findById(userId).then((doc) => {
        if (!doc) {
            return res.json({
                msg: "User not found"
            });
        }

        let query = User.findById(userId);

        if (doc.role == "parent") {
            query = query.populate('children')
                .populate('studentCourses.courseId');
        } else if (doc.role == "teacher") {
            query = query.populate({
                path: 'courses',
                populate: {
                    path: 'students.studentId',
                    model: 'User'
                }
            });
        } else if (doc.role == "student") {
            query = query.populate({
                path: 'studentCourses.courseId',
                populate: {
                    path: 'teacherId',
                    model: 'User'
                }
            });
        }

        query.then((populatedDoc) => {
            console.log("here userFound", populatedDoc);

            res.json({
                userFound: populatedDoc,
                msg: "User found and populated"
            });
        });
    });
});

// get all users
app.get("/users", (req, res) => {
    console.log("Here into BL : getAllUsers");
    User.find()
        .populate({
            path: 'courses',
            model: 'Course',
            match: { role: 'teacher' }
        }
        )
        .populate({
            path: 'studentCourses',
            model: 'Course',
            match: { role: 'student' }
        }
        )
        .populate({
            path: 'children',
            model: 'User',
            match: { role: 'parent' }
        }
        )
        .then(
            (docs) => {
                console.log("Here AllUsers", docs);
                res.json({
                    T: docs
                })

            }
        );
});



//   addChild to parent
app.put("/users/parentId/:id", (req, res) => {
    let userId = req.params.id;
    let childTel = req.body.tel;
    User.findById(userId).then(
        (user) => {
            if (!user) {
                return res.json({
                    msg: "Parent not found"
                })
            };
            User.findOne({ tel: childTel }).then(
                (child) => {
                    if (!child || child.role != "student") {
                        return res.json({
                            msg: "Student not found"
                        })
                    }
                    user.children.push(child._id)
                    user.save();
                    res.json({
                        msg: "Child added with success"
                    })
                });



        })

})

// Business Logic : Get Student By tel
// app.get("/users/student/:tel", (req, res) => {
//     console.log("Here into BL : Get Student By tel", req.params.tel);
//     let tel = req.params.tel;
//     User.find({ tel: tel, role: "student" }).then((doc) => {
//         if (!doc) {
//             return res.json({ msg : 'notFound' });
//         }
//         console.log("Here student found", doc);

//         res.json({ child : doc });
//     });
//   });


// delete user
app.delete("/users/:id", (req, res) => {
    let userId = req.params.id;
    console.log("Here into BL : deleteUser", userId);
    User.findById(userId).then(
        (user) => {
            if (!user) {
                return res.json({
                    msg: "User not found"
                })

            };
            console.log("userObj", user);
            if (user.role == "teacher") {
                const courseIds = user.courses.map(course => course._id);

                Course.deleteMany({ _id: { $in: courseIds } }).then(
                    (deleteResponse) => {
                        console.log("Courses deleted:", deleteResponse);
                    });

                User.updateMany(
                    { role: "student", "studentCourses.courseId": { $in: courseIds } },
                    { $pull: { studentCourses: { courseId: { $in: courseIds } } } }
                ).then((updateResponse) => {
                    console.log("Students' courses updated:", updateResponse);
                });
            } else if (user.role == "student") {
                const deletedChildTel = user.tel;
                User.deleteMany({ role: 'parent', childTel: deletedChildTel }).then(
                    (deleteResponse) => {
                        console.log("Parents deleted:", deleteResponse);
                    })
                Course.updateMany(
                    { "students.studentId": userId },
                    { $pull: { students: { studentId: userId } } }
                ).then((updateResponse) => {
                    console.log("Student removed from courses:", updateResponse);
                })

            }

            User.deleteOne({ _id: userId }).then(
                (deleteResponse) => {
                    console.log("Here delete response", deleteResponse);
                    if (deleteResponse.deletedCount == 1) {
                        return res.json({
                            msg: "success"
                        })
                    } else {
                        res.json({
                            msg: "echec"
                        })
                    }
                }
            )



        }
    )


});

// validate teacher
app.put("/users/:id", (req, res) => {
    let userId = req.params.id;
    console.log("Here into BL : validateTeacher");
    User.findById(userId).then(
        (teacher) => {
            if (!teacher) {
                return res.json({
                    msg: "Teacher Not Found"
                })
            }
            teacher.status = "validate";
            teacher.save();
            res.json({
                msg: "Teacher validated with success"
            })

        }
    );
});

// affect to course
app.put("/users/:courseId/:id", (req, res) => {
    let userId = req.params.id;
    let courseId = req.params.courseId;
    console.log("Here into BL : addToCourse", courseId);
    User.findById(userId).then(
        (student) => {
            if (!student) {
                return res.json({
                    msg: "Student Not Found"
                })
            }
            const courseExists = student.studentCourses.find(course => course.courseId.equals(courseId))

            if (courseExists) {
                return res.json({
                    msg: "Student already affected"
                })
            } else {
                Course.findById(courseId).then(
                    (course) => {
                        if (!course) {
                            return res.json({
                                msg: "Course Not Found"
                            })
                        }
                        student.studentCourses.push(
                            {
                                courseId: course._id,
                                note: null,
                                evaluation: ""
                            }
                        )
                        student.save();

                        course.students.push(
                            {
                                studentId: student._id,
                                note: null,
                                evaluation: ""
                            }
                        )
                        course.save();
                        res.json({
                            msg: "Student added to course with success"
                        })
                    }
                )
            }




        }
    );
});


// add/editNoteEval
app.put("/users/:courseId/id/:id", (req, res) => {
    let userId = req.params.id;
    let courseId = req.params.courseId;
    let obj = req.body;
    console.log("Here into BL : addNoteEval", obj);
    User.findById(userId).then(
        (student) => {
            if (!student) {
                return res.json({
                    msg: "Student Not Found"
                })
            }
            const courseIndex = student.studentCourses
                .findIndex(course => course.courseId == courseId);

            if (courseIndex === -1) {
                return res.status(404).json({ msg: "Student is not enrolled in the specified course" });
            }

            // Update the note and evaluation for the specific course
            student.studentCourses[courseIndex].note = obj.note;
            student.studentCourses[courseIndex].evaluation = obj.evaluation;
            console.log("Here student ", student);
            student.save();

            Course.findById(courseId).then(
                (course) => {
                    if (!course) {
                        return res.json({
                            msg: "Course Not Found"
                        })
                    }

                    const studentIndex = course.students
                        .findIndex(student => student.studentId == userId);

                    if (studentIndex === -1) {
                        return res.status(404).json({ msg: "Student is not associated with the specified course" });
                    }

                    // Access the specific student using the index
                    const courseStudent = course.students[studentIndex];

                    // Update the note and evaluation
                    courseStudent.note = obj.note;
                    courseStudent.evaluation = obj.evaluation;
                    course.save();
                    res.json({
                        msg: "Note added to course with success"
                    })
                }
            )


        }
    );
});


// BL addCourse
app.post("/courses", multer({ storage: storage }).single("img"), (req, res) => {
    console.log("Here into BL: addCourse", req.body);
    User.findById(req.body.teacherId).then(
        (teacher) => {
            if (!teacher) {
                return res.json({
                    msg: "Teacher Not Found"
                })
            }
            req.body.avatar = `http://localhost:3000/images/${req.file.filename}`;
            let course = new Course(req.body);
            console.log("Here course obj", course);
            course.save((err, doc) => {
                if (err) {
                    return res.json({ msg: "Error" });
                }
                teacher.courses.push(doc._id);
                teacher.save();
                res.json({
                    msg: "Course added with success"
                })

            })


        }
    )
});

// get allCourses
app.get("/courses", (req, res) => {
    console.log("Here into BL : getAllCourses");
    Course.find()
        .populate({ path: 'teacherId', model: 'User' })
        .populate({ path: 'students.studentId', model: 'User' })
        .then(
            (docs) => (
                res.json({
                    T: docs,

                })
            )
        )
});

// get courseById
app.get("/courses/:id", (req, res) => {
    console.log("Here into BL:getCourseById");
    let courseId = req.params.id;
    Course.findById(courseId)
        .populate({ path: 'teacherId', model: 'User' })
        .populate({ path: 'students.studentId', model: 'User' })
        .then(
            (doc) => (
                console.log("here courseFound", doc),
                res.json({
                    courseFound: doc
                })
            )
        )

});


// deleteCourse
app.delete("/courses/:id", (req, res) => {
    let courseId = req.params.id;
    User.updateMany(
        { $or: [{ courses: courseId }, { "studentCourses.courseId": courseId }] },
        { $pull: { courses: courseId, studentCourses: { courseId: courseId } } }
    ).then((updateResponse) => {
        console.log("Users' courses updated:", updateResponse);
    });
    Course.deleteOne({ _id: courseId }).then(
        (deleteResponse) => {
            console.log("Here delete response", deleteResponse);
            if (deleteResponse.deletedCount == 1) {
                res.json({
                    msg: "success"
                })
            } else {
                res.json({
                    msg: "echec"
                })
            }
        }
    )
});

// editCourse
app.put("/courses", multer({ storage: storage }).single("img"), (req, res) => {
    console.log("Here into BL: courseEdit");
    let course = req.body;
    // Convert _id back to ObjectId
    course._id = mongoose.Types.ObjectId(course._id);
    if (req.file) {
        course.avatar = `http://localhost:3000/images/${req.file.filename}`;
    }
    console.log("course", course);
    Course.updateOne({ _id: course._id }, course).then(
        (updateResponse) => {
            console.log("here update response", updateResponse);
            if (updateResponse.nModified == 1) {
                res.json({
                    msg: "success"
                })
            } else {
                res.json({
                    msg: "error"
                })
            }
        }
    )

}
);











// in the end to impot app
module.exports = app;