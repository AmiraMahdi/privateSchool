import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userUrl: string = "http://localhost:3000/users";
  constructor(private httpClient: HttpClient) {
  }



  signup(obj: any, img: File, doc: File | String) {
    let fData = new FormData();
    if (doc instanceof File) {
      fData.append("doc", doc);
    }
    fData.append("img", img);
    fData.append("firstName", obj.firstName);
    fData.append("lastName", obj.lastName);
    fData.append("email", obj.email);
    fData.append("gender", obj.gender);
    fData.append("tel", obj.tel);
    fData.append("password", obj.password);
    fData.append("address", obj.address);
    fData.append("role", obj.role);
    if (obj.role == "teacher") {
      fData.append("status", obj.status);
      fData.append("speciality", obj.speciality);
    } else if (obj.role == "parent") {
      fData.append("childTel", obj.childTel);
    }

    return this.httpClient.post<{ msg: any }>(`${this.userUrl}/signup`, fData);
  }
  updateUser(obj: any, img: File | String, doc: File | String) {
    let fData = new FormData();
    if (doc instanceof File) {
      fData.append("doc", doc);
    }
    if (img instanceof File) {
      fData.append("img", img);
    }
    fData.append("_id", String(obj._id));
    fData.append("firstName", obj.firstName);
    fData.append("lastName", obj.lastName);
    fData.append("email", obj.email);
    fData.append("gender", obj.gender);
    fData.append("tel", obj.tel);
    fData.append("password", obj.password);
    fData.append("address", obj.address);
    fData.append("role", obj.role);
    if (obj.role == "teacher") {
      fData.append("speciality", obj.speciality);
    }


    return this.httpClient.put<{ msg: any }>(`${this.userUrl}/editUser`, fData);
  }

  login(obj: any) {
    return this.httpClient.post<{ msg: any, token: any }>(`${this.userUrl}/login`, obj);
  }

  getUsersByRole(role: any) {
    return this.httpClient.get<{ T: any }>(`${this.userUrl}/role/${role}`)
  }

  getUserById(id: number) {
    return this.httpClient.get<{ userFound: any, msg: any }>(`${this.userUrl}/id/${id}`);
  }

  getAllUsers() {
    return this.httpClient.get<{ T: any }>(this.userUrl)
  }

  deleteUser(id: number) {
    return this.httpClient.delete<{ msg: string }>(`${this.userUrl}/${id}`)
  }

  validateTeacher(id: number) {
    const obj = {};
    return this.httpClient.put<{ msg: any }>(`${this.userUrl}/${id}`, obj)
  }

  addToCourse(id: number, courseId: number) {
    const obj = {};
    return this.httpClient.put<{ msg: any }>(`${this.userUrl}/${courseId}/${id}`, obj)
  }

  addNoteEval(id: number, courseId: number, obj: any) {
    return this.httpClient.put<{ msg: any }>(`${this.userUrl}/${courseId}/id/${id}`, obj)
  }

  addChild(id: number, obj: any) {
    return this.httpClient.put<{ msg: any }>(`${this.userUrl}/parentId/${id}`, obj)
  }
  // getStudentByTel(tel) {
  //   return this.httpClient.get<{ child: any,msg: any }>(`${this.userUrl}/student/${tel}`);
  // }


}
