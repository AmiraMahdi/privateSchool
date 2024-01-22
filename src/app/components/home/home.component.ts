import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/courses.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  teachers: any;
  lastTeachers: any = [];
  courses: any;
  lastCourses: any = [];
  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
  ) { }

  ngOnInit() {
    this.coursesService.getAllCourses().subscribe(
      (data) => {
        this.courses = data.T;
        if (this.courses.length >= 3) {
          for (let i = 0; i < 3; i++) {
            this.lastCourses[i] = this.courses[(this.courses.length - 1) - i];

          }
        } else {
          this.lastCourses = this.courses
        }
        console.log("Here all courses", this.lastCourses);



      }
    )


    this.usersService.getUsersByRole('teacher').subscribe(
      (data: any) => {
        this.teachers = data.T;
        this.teachers=this.teachers.filter(
          (teacher)=>{
            return teacher.status=='validate'
          }
        )
        if (this.teachers.length >= 4) {
          for (let i = 0; i < 4; i++) {
            this.lastTeachers[i] = this.teachers[(this.teachers.length - 1) - i];

          }
        } else {
          this.lastTeachers = this.teachers
        }

        console.log("Here all teachers", this.lastTeachers);
      }
    )
    




  }

  

}
