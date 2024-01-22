import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  teachers: any;
  dataNotfilted: any;
  page: any = "Teachers";
  path: any;
  searchTeacherForm: FormGroup;
  obj: any = {};

  constructor(
    private usersService: UsersService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.path = this.router.url
    if (this.path == "/teachers") {
      this.usersService.getUsersByRole('teacher').subscribe(
        (data: any) => {
          this.teachers = data.T;
          this.teachers = this.teachers.filter(
            (teacher) => {
              return teacher.status == 'validate'
            }
          )
          console.log("Here all teachers", this.teachers);
        }
      )
    } else {
      this.search()
    }


  }
  search() {
    this.usersService.getUsersByRole('teacher').subscribe(
      (data: any) => {
        this.dataNotfilted = data.T;
        this.dataNotfilted = this.dataNotfilted.filter(
          (teacher) => {
            return teacher.status == 'validate'
          }
        )
        if (this.obj.speciality) {
          console.log("Here obj.speaciality", this.obj.speciality);
          this.teachers = this.dataNotfilted.filter(
            (teacher) => {
              return (teacher.speciality.toLowerCase().includes(this.obj.speciality.toLowerCase()));
            }
          );
        } else {
          this.teachers = this.dataNotfilted;
        }
        console.log("Here all teachers after search", this.teachers);
      })
  }
}
