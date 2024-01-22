import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CoursesService } from 'src/app/services/courses.service';


@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  page = "Add Course";
  addCourseForm: FormGroup;
  courseId: any;
  user: any;
  teachers: any = [];
  users: any = [];
  obj: any = {};
  imagePreview: any;
  msgError: string = "";
  msgImg: string = "";
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
  ) { }

  ngOnInit() {
    this.addCourseForm = this.formBuilder.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      duration: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      img: [''],
      teacherId: [''],

    })
    this.courseId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.page = "Edit Course"
      this.coursesService.getCourseById(this.courseId).subscribe(
        (data) => {
          this.obj = data.courseFound;
          this.imagePreview = this.obj.avatar;
          console.log("course obj", data.courseFound)
        }

      );

    };
  }
  addOrEditCourse() {
    if (this.courseId) {
      this.obj.img = this.addCourseForm.value.img
      console.log("editCourse obj", this.obj);
      this.coursesService.updateCourse(this.obj, this.obj.img).subscribe(
        (data) => {

          console.log("Here edit data", data.msg);
          if (this.user.role=='admin') {
            this.router.navigate(['admin'])
          }else{
            this.router.navigate(['teacher'])

          }
        }
      );
    } else {
      this.isLoggedIn()

      this.addCourseForm.value.teacherId = this.user.id;
      this.coursesService.addCourse(this.addCourseForm.value, this.addCourseForm.value.img).subscribe(
        (data) => {
          console.log("here add data", data.msg)
          this.router.navigate(['teacher'])

        })

    }
  }
  isLoggedIn() {
    let token = sessionStorage.getItem("jwt");
    if (token) {
      this.user = this.decodeToken(token);
    }
    return !!token;
  }
  decodeToken(token: string) {
    return jwtDecode(token);

  }

  onImageSelected(event: Event) {
    const img = (event.target as HTMLInputElement).files[0];
    if (img) {
      this.msgImg = "Photo added with success!";
      this.msgError = "";
    }
    this.addCourseForm.patchValue({ img: img });
    this.addCourseForm.updateValueAndValidity();
    console.log("img", this.addCourseForm.value.img)
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    };
    reader.readAsDataURL(img);
  }


}
