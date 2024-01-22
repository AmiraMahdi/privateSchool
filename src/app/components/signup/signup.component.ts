import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  path: string;
  page: string;
  role: string;
  imagePreview: any;
  docPreview: any;
  teacherCV: SafeResourceUrl;
  msgImg: string = "";
  msgDoc: string = "";
  msgError: string = "";
  userId: any;
  userObj: any = {};


  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.path = this.router.url;

    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{4,9}')]],
      tel: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      childTel: [''],
      speciality: [''],
      doc: [''],
      img: [''],
    });

    this.page = (this.path == "/signupParent" ? "Signup Parent" :
      this.path == "/signupStudent" ? "Signup Student" :
        this.path == "/signupTeacher" ? "Signup Teacher" :
          this.path == "/signupAdmin" ? "Signup Admin" :
            "Edit Profile");
    this.role = (this.path == "/signupParent" ? "parent" :
      this.path == "/signupStudent" ? "student" :
        this.path == "/signupTeacher" ? "teacher" :
          "admin");

    if (this.role == 'teacher') {
      this.signupForm.get('speciality').setValidators([Validators.required]);
      this.signupForm.get('childTel').clearValidators();

    } else if (this.role == 'parent') {
      this.signupForm.get('childTel').setValidators([Validators.required, Validators.pattern('[0-9]{8}')]);
      this.signupForm.get('speciality').clearValidators();
    } else {
      this.signupForm.get('speciality').clearValidators();
      this.signupForm.get('childTel').clearValidators();
    }

    this.signupForm.get('speciality').updateValueAndValidity();
    this.signupForm.get('childTel').updateValueAndValidity();

    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.userId) {
      this.usersService.getUserById(this.userId).subscribe(
        (data) => {
          this.userObj = data.userFound;
          this.imagePreview = this.userObj.avatar;
          this.teacherCV = this.sanitizer.bypassSecurityTrustResourceUrl(this.userObj.cv);
          console.log("user obj", data.userFound)
        }

      );
    };


  }

  signupOrEdit() {
    if (this.userId) {
      this.userObj.img = this.signupForm.value.img
      this.userObj.doc = this.signupForm.value.doc
      console.log("editUser obj", this.userObj);
      this.usersService.updateUser(this.userObj, this.userObj.img, this.userObj.doc).subscribe(
        (data) => {
          console.log("Here edit data", data.msg);
          if (data.msg == "Error tel is not unique") {
            this.msgError = "Phone number already exists!"
          } else if (data.msg == "pwdNotCorrect") {
            this.msgError = "Please check your password!"
          } else if (data.msg == "success") {
            this.msgError = ""
            this.router.navigate(['']);
          }
        }
      );
    } else {
      this.msgError = "";
      console.log("Here is signup obj.value", this.signupForm.value);
      this.signupForm.value.role = this.role;
      if (this.signupForm.value.role == "teacher") {
        this.signupForm.value.status = "notValidated";
      }
      if (!this.signupForm.value.img) {
        return this.msgError = "You should upload your avatar first!"
      }
      if (this.signupForm.value.role == "teacher" && !this.signupForm.value.doc) {
        return this.msgError = "You should upload your cv first!"
      }
      // console.log("signup clicked", this.signupForm.value);
      this.usersService.signup(this.signupForm.value,
        this.signupForm.value.img,
        this.signupForm.value.doc).subscribe(
          (data) => {
            console.log("Here is signup obj", data.msg);
            if (data.msg == "Error tel is not unique") {
              this.msgError = "Phone number already exists!"
            } else if (data.msg == "Student not found") {
              this.msgError = "Please check childTel!"
            } else if (data.msg == "success") {
              this.msgError = ""
              this.router.navigate(['']);
            }
            console.log("Here is signup obj", data.msg);

          })
    }


  };

  onImageSelected(event: Event) {
    const img = (event.target as HTMLInputElement).files[0];
    if (img) {
      this.msgImg = "Photo added with success!";
    }
    this.signupForm.patchValue({ img: img });
    this.signupForm.updateValueAndValidity();
    console.log("img", this.signupForm.value.img)

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    };
    reader.readAsDataURL(img);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      this.msgDoc = "File added with success!";
      this.msgError = "";
    }
    this.signupForm.value.doc = file;
    console.log("doc", this.signupForm.value.doc)
    const reader = new FileReader();
    reader.onload = () => {
      this.docPreview = reader.result as string
      this.teacherCV = this.sanitizer.bypassSecurityTrustResourceUrl(this.docPreview);

    };
    reader.readAsDataURL(file);

  }






}
