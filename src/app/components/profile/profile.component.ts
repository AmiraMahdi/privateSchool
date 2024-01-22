import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsersService } from 'src/app/services/users.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  page = "Profile";
  path: any;
  user: any;
  userId: any;
  userObj: any = {};
  teacherCV: SafeResourceUrl;
  showTeacherCV: boolean = false;
  showStudents: boolean = false;
  childForm: FormGroup;
  obj: any = {};
  msg: any = "";

  constructor(private usersService: UsersService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.path = this.router.url;
    this.connectedUser()
    if (this.path == '/profile') {
      this.userId = this.user.id
    } else {
      this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.usersService.getUserById(this.userId).subscribe(
      (data) => {
        this.userObj = data.userFound
        console.log("userFound", this.userObj);
        if (this.userObj.role == 'teacher') {
          this.teacherCV = this.sanitizer.bypassSecurityTrustResourceUrl(this.userObj.cv);
        }

      }

    )
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

  toggleCv() {
    this.showTeacherCV = !this.showTeacherCV;
  }
  goToEdit(id: number) {
    this.router.navigate([`/editProfile/${id}`])
  }
  addChild(id) {
    this.msg = "";
    this.usersService.addChild(id, this.obj).subscribe(
      (data) => {
        if (data.msg == "Child added with success") {
          this.msg = "Child added!"
        } else {
          this.msg ="Please check phone number!"
        }
      }
    )
  }
}
