import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: any;
  page: any ="Courses";

  constructor(private router: Router,
     private coursesService:CoursesService) { }

  ngOnInit() {
    this.coursesService.getAllCourses().subscribe(
      (data) => {
        this.courses = data.T;
      }
    )
  }
  
}
