import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CoursesService } from 'src/app/services/courses.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  courses: any;
  path: any;
  page: any="Teacher"
  user: any;
  userObj: any = {};
  showStudents: boolean = false;

  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
    private router:Router) { }
  ngOnInit() {
    this.connectedUser()
    this.usersService.getUserById(this.user.id).subscribe(
      (data) => {
        this.userObj = data.userFound
        this.courses= this.userObj.courses
        console.log("userFound", this.userObj);
        console.log("userCourses", this.courses);

      }

    )
  }
  goToAddCourse(){
    this.router.navigate([`addCourse`])

  }
  toggleStudents() {
    this.showStudents = !this.showStudents;
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
  goToDisplay(id: number) {
    this.router.navigate([`courseInfo/${id}`])
  }

  goToEdit(id: number) {
    this.router.navigate([`editCourse/${id}`])
  }

  deleteCourse(id: number) {
    this.coursesService.deleteCourse(id).subscribe(
      (data) => {
        console.log("Here is delete data", data.msg)
        this.courses;
      }
    );
  }
}
