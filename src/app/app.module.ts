import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CoursesComponent } from './components/courses/courses.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { InfoComponent } from './components/info/info.component';
import { BannerComponent } from './components/banner/banner.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { TeachersTabComponent } from './components/teachers-tab/teachers-tab.component';
import { AdminsTabComponent } from './components/admins-tab/admins-tab.component';
import { ParentsTabComponent } from './components/parents-tab/parents-tab.component';
import { StudentsTabComponent } from './components/students-tab/students-tab.component';
import { AddCourseComponent } from './components/add-course/add-course.component';
import { CoursesTabComponent } from './components/courses-tab/courses-tab.component';
import { CourseInfoComponent } from './components/course-info/course-info.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { StudentComponent } from './components/student/student.component';
import { CustomFilterPipe } from './pipes/custom-filter.pipe';
import { SingleTeacherComponent } from './components/single-teacher/single-teacher.component';
import { SingleCourseComponent } from './components/single-course/single-course.component';
import { QuotesComponent } from './components/quotes/quotes.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CoursesComponent,
    TeachersComponent,
    InfoComponent,
    BannerComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    TeachersTabComponent,
    AdminsTabComponent,
    ParentsTabComponent,
    StudentsTabComponent,
    AddCourseComponent,
    CoursesTabComponent,
    CourseInfoComponent,
    SignupComponent,
    ProfileComponent,
    TeacherComponent,
    StudentComponent,
    CustomFilterPipe,
    SingleTeacherComponent,
    SingleCourseComponent,
    QuotesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
