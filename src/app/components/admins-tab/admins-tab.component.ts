import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admins-tab',
  templateUrl: './admins-tab.component.html',
  styleUrls: ['./admins-tab.component.css']
})
export class AdminsTabComponent implements OnInit {
  users: any = [];
  constructor(
    private usersService: UsersService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.allAdmins();
 

  }
  allAdmins() {
    this.usersService.getUsersByRole('admin').subscribe(
      (data: any) => {
        this.users = data.T;
        console.log("Here all admins", this.users);
      }
    )
  };
  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe(
      (data) => {
        console.log("Here is delete response", data.msg);
        this.allAdmins();
      }
    )
  }
  goToDisplay(id: number) {
    this.router.navigate([`profile/${id}`])
  }
  goToEdit(id: number) {
    this.router.navigate([`/editProfile/${id}`])
  }
}
