import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  page: any = "";
  path: any;
  user: any;
  note: any;
  child: any;
  children: any;
  evaluation: any;
  courses: any;
  userObj: any = {};
  showNote: boolean = false;
  selectedCourse: any;
  searchForm: FormGroup;
  obj: any = {};
  msg: any = "";
  success: any = "";
  constructor(
    private usersService: UsersService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.path = this.router.url;
    this.connectedUser();
    this.usersService.getUserById(this.user.id).subscribe(
      (data) => {
        this.userObj = data.userFound
        if (this.userObj.role == 'parent') {
          this.children = this.userObj.children
          console.log("children", this.children);
        } else {
          this.courses = this.userObj.studentCourses
        }
        console.log("userFound", this.userObj);
        console.log("courses", this.courses);
      }

    )
    if (this.path == '/student') {
      this.page = "Student"


    } else {
      this.page = "Parent"
    }

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
  
  seeResult(obj) {
    if (!obj.note && obj.note!=0) {
      this.note = '--'
      this.evaluation = '--'

    } else {
      this.note = obj.note
      this.evaluation = obj.evaluation
    }
    this.showNote = true;
    this.selectedCourse = obj;
  }
  search() {
    this.success = ""
    this.msg = ""
    this.child = this.children.find(
      (child) => (child.tel == this.obj.tel)

    )
    console.log("childFound", this.child);
    if (!this.child) {
      this.msg = "Please check your child's phone!"
      this.success = ""

    } else {
      this.msg = ""
      this.usersService.getUserById(this.child._id).subscribe(
        (data) => {
          this.child = data.userFound
          this.courses = this.child.studentCourses
          this.success = `Here your child: ${this.child.firstName} ${this.child.lastName}`

          console.log("userFound", this.child);
          console.log("courses", this.courses);
        }

      )

    }


  }
  goToDisplay(id: number) {
    this.router.navigate([`courseInfo/${id}`])
  }

}
