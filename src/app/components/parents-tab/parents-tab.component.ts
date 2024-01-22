import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-parents-tab',
  templateUrl: './parents-tab.component.html',
  styleUrls: ['./parents-tab.component.css']
})
export class ParentsTabComponent implements OnInit {
  users: any = [];

  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.allParents();
  }
  allParents() {
    this.usersService.getUsersByRole('parent').subscribe(
      (data: any) => {
        this.users = data.T;
        console.log("Here all parents", this.users);
      }
    )
  };
  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe(
      (data) => {
        console.log("Here is delete response", data.msg);
        this.allParents();
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
