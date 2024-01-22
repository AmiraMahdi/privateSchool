import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-students-tab',
  templateUrl: './students-tab.component.html',
  styleUrls: ['./students-tab.component.css']
})
export class StudentsTabComponent implements OnInit {
  users: any = [];
  path: any = "";
  courseId: any;
  student: any;
  


  constructor(
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.allStudents();
    this.path = this.router.url;
    this.courseId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log("path", this.path)

  }

  allStudents() {
    this.usersService.getUsersByRole('student').subscribe(
      (data: any) => {
        this.users = data.T;
        console.log("Here all students", this.users);
      }
    )
  };

  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe(
      (data) => {
        console.log("Here is delete response", data.msg);
        this.allStudents();
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
