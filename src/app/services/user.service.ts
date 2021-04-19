import { Injectable } from '@angular/core';
import { User } from '../model/User.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[];
  userSubject = new Subject<User[]>();

  constructor(private httpClient: HttpClient) {}

  emitUsers() {
    this.userSubject.next(this.users);
  }

  getUser() {
    this.httpClient.get<any[]>('http://localhost:61580/api/User').subscribe(
      (response) => {
        this.users = response;
        this.emitUsers();
      },
      (error) => {
        console.log('Erreur de chargement !' + error);
      }
    );
  }

  addUser(user: User) {
    return this.httpClient.post('http://localhost:61580/api/User/', user);
  }

  putUser(id: number, user: User) {
    return this.httpClient.put('http://localhost:61580/api/User/' + id, user);
  }
  
  deleteUser(id: number) {
    return this.httpClient.delete('http://localhost:61580/api/User/' + id);
  }
}
