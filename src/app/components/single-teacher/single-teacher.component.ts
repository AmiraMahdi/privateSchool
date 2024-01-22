import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-teacher',
  templateUrl: './single-teacher.component.html',
  styleUrls: ['./single-teacher.component.css']
})
export class SingleTeacherComponent implements OnInit {
@Input() teacher:any;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  goToDisplay(id: number) {
    this.router.navigate([`profile/${id}`])

  }
}
