import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-courses-tab',
  templateUrl: './courses-tab.component.html',
  styleUrls: ['./courses-tab.component.css']
})
export class CoursesTabComponent implements OnInit {
  courses: any;
  showStudents: boolean = false;
  constructor(private router: Router,
    private coursesService: CoursesService) { }

  ngOnInit() {
    this.allCourses();
  }

  toggleStudents() {
    this.showStudents = !this.showStudents;
  }

  allCourses() {
    
      this.coursesService.getAllCourses().subscribe(
        (data) => {
          return this.courses = data.T;
        }
      )
    

  };

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
        this.allCourses();
      }
    );
  }
  

}
