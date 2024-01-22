import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  obj: any = {};
  page = "Login";
  erreur: string = "";
  constructor(private usersService: UsersService,
    private router: Router) { }

  ngOnInit() {
  }
  login() {
    // console.log("login clicked",this.obj);
    this.erreur = ""
    this.usersService.login(this.obj).subscribe(
      (data) => {
        if (data.token) {
          sessionStorage.setItem("jwt", data.token);
          let user: any = this.decodeToken(data.token)
          if (user.role == "admin") {
            this.router.navigate([`admin`]);

          } else if (user.role == "teacher") {
            this.router.navigate([`teacher`]);

          } else if (user.role == "student") {
            this.router.navigate([`student`]);
          } else{
            this.router.navigate([``]);
          }
            
            // profile/${user.id}
          } else {
            if (data.msg == "Teacher not yet validated") {
              this.erreur = "Sorry teacher account not yet validated!"
            } else {
              this.erreur = "Please check your phone number/password!"
            }
          }


        });
    //  console.log("here is user obj", this.obj);
  }
  decodeToken(token: string) {
    return jwtDecode(token);
  }

}
