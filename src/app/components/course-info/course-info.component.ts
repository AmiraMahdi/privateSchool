import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from 'src/app/services/courses.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {
  page = "Course Info";
  noteError = "";
  eval = "";
  noteForm = FormGroup;
  showForm: boolean = false;
  selectedStudent: any;
  courseId: any;
  course: any = {};
  obj: any = { note: null, evaluation: '' };
  users: any;
  user: any;
  successMessages: { [id: string]: string } = {};
  errorMessages: { [id: string]: string } = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.connectedUser()
    this.courseId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("here is course id", this.courseId);
    this.courseDisplayed()
    this.allStudents()

  }
  connectedUser() {
    let token = sessionStorage.getItem("jwt");
    if (token) {
      this.user = this.decodeToken(token);
      console.log("here user", this.user);

    }
    return !!token;
  }
  decodeToken(token: string) {
    return jwtDecode(token);
  }

  allStudents() {
    this.usersService.getUsersByRole('student').subscribe(
      (data: any) => {
        this.users = data.T;
        console.log("Here all students", this.users);
      }
    )
  };
  showNoteForm(student: any): void {
    this.showForm = true;
    this.selectedStudent = student;
  }

  addNote(id) {
    if (this.obj.note == null || isNaN(this.obj.note) || this.obj.note < 0 || this.obj.note > 20) {
      return this.noteError = 'Invalid note. Please enter a number between 0 and 20.';
    }
    if (this.obj.note >= 0 && this.obj.note < 10) {
      this.eval = 'Bad';
    } else if (this.obj.note >= 10 && this.obj.note <= 15) {
      this.eval = 'Good';

    } else if (this.obj.note > 15 && this.obj.note <= 20) {
      this.eval = 'Verry Good';

    }
    this.obj.evaluation = this.eval
    console.log("here is student's note and eval", this.obj);
    this.usersService.addNoteEval(id, this.courseId, this.obj).subscribe
      ((data: any) => {
        console.log("here is data", data.msg);
        this.courseDisplayed()
      })


  }
  courseDisplayed() {
    this.coursesService.getCourseById(this.courseId).subscribe(
      (courseData: any) => {
        this.course = courseData.courseFound;
        console.log("here course",this.course);
        
      })
  }
  affectToCourse(id: number) {

    this.usersService.addToCourse(id, this.courseId).subscribe(
      (data) => {
        if (data.msg == "Student already affected") {
          this.allStudents()

          this.errorMessages[id] = 'Already affected!'
          this.successMessages[id] = ''
        } else {
          this.allStudents()
          this.errorMessages[id] = ''
          this.successMessages[id] = 'Student affected'
        }
        this.allStudents()
        console.log("Here is addToCourse response", data.msg);
      })
  }



}

