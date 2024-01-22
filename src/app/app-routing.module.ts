import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CoursesComponent } from './components/courses/courses.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CourseInfoComponent } from './components/course-info/course-info.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { StudentComponent } from './components/student/student.component';
import { QuotesComponent } from './components/quotes/quotes.component';


const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"courses", component:CoursesComponent},
  {path:"teachers", component:TeachersComponent},
  {path:"searchTeachers", component:TeachersComponent},
  {path:"signupAdmin", component:SignupComponent},
  {path:"editProfile/:id", component:SignupComponent},
  {path:"signupTeacher", component:SignupComponent},
  {path:"signupStudent", component:SignupComponent},
  {path:"signupParent", component:SignupComponent},
  {path:"profile", component:ProfileComponent},
  {path:"profile/:id", component:ProfileComponent},
  {path:"teacher", component:TeacherComponent},
  {path:"student", component:StudentComponent},
  {path:"parent", component:StudentComponent},
  {path:"login", component:LoginComponent},
  {path:"admin", component:AdminComponent},
  {path:"addCourse", component:AddCourseComponent},
  {path:"courseInfo/:id", component:CourseInfoComponent},
  {path:"editCourse/:id", component:AddCourseComponent},
  { path: '**', redirectTo: '' } // Redirect unknown routes to the default route


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
