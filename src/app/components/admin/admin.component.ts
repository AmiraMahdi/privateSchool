import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  page = "Admin Dashboard";
  user :any;
  constructor() { }

  ngOnInit() {
    this.connectedUser()
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

}
