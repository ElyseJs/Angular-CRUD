import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from '../model/User.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  users: User[] = [];
  userSubscription: Subscription;

  constructor(private userService: UserService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  insertRecord(form: NgForm){

    this.userService.addUser(form.value).subscribe(res =>{
      console.log('Utilisateur ajouté !');
      this.toastrService.success('Utilisateur ajouté !','CRUD APP');
      this.userSubscription = this.userService.userSubject.subscribe(
        (users: User[]) => {
          this.users = users;
        }
      );
      this.userService.emitUsers();
      form.resetForm();
    })
  }

  onSubmit(form: NgForm){
      this.insertRecord(form);
  }

}
