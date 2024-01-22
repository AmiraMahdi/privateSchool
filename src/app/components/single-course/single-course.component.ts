import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent implements OnInit {
  @Input() course:any;
  path:any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.path=this.router.url
  }
  goToDisplay(id: number) {
    this.router.navigate([`courseInfo/${id}`])
  }

}
