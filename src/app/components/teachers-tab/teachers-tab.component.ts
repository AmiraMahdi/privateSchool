import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-teachers-tab',
  templateUrl: './teachers-tab.component.html',
  styleUrls: ['./teachers-tab.component.css']
})
export class TeachersTabComponent implements OnInit {
  users: any = [];
  constructor(
    private usersService: UsersService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.allTeachers();
  }
  allTeachers() {
    this.usersService.getUsersByRole('teacher').subscribe(
      (data: any) => {
        this.users = data.T;
        this.users.sort((a, b) => {
          // Sort by status (notValidated on top)
          if (a.status == 'notValidated' && b.status != 'notValidated') {
            return -1; // 'notValidated' comes first
          } else if (a.status != 'notValidated' && b.status == 'notValidated') {
            return 1; // 'notValidated' comes first
          } else {
            // For other statuses, use default alphabetical sorting
            return a.status.localeCompare(b.status);
          }
        });
        console.log("Here all teachers", this.users);
      }
    )
  };
  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe(
      (data) => {
        console.log("Here is delete response", data.msg);
        this.allTeachers();
      }
    )
  }
  validateTeacher(id: number) {
    this.usersService.validateTeacher(id).subscribe(
      (data) => {
        console.log("Here is validation response", data.msg);
        this.allTeachers();
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
