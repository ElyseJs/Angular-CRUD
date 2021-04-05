import { Component, OnInit, Input} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from '../model/User.model';
import { UserService } from '../services/user.service';
import { ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  users: User[] = [];
  userSubscription: Subscription;
  closeResult = '';
  id;
  nom;
  prenom;
  userUpdate: User;
  constructor(private userService: UserService,
    private toastrService: ToastrService,
    private modalService: NgbModal) { 
/*       NgbModalRef.prototype['c'] = NgbModalRef.prototype.close;
      NgbModalRef.prototype.close = function (reason: string) {
        document.querySelector('.modal-backdrop').classList.remove('­show');
        document.querySelector('.modal').classList.remove('show');
        setTimeout(() => { 
          this['c'](reason); }, 
          500); };
      NgbModalRef.prototype['d'] = NgbModalRef.prototype.dismiss;
      NgbModalRef.prototype.dismiss = function (reason: string) { 
        document.querySelector('.modal-backdrop').classList.remove('­show');
        document.querySelector('.modal').classList.remove('show'); 
        setTimeout(() => { 
          this['d'](reason); }, 
          500); }; */
    }
  /**
   * Fonction de subscription
   */
  subscription(){
    this.userSubscription = this.userService.userSubject.subscribe(
      (users: User[]) => {
        this.users = users;
      }
    );
    this.userService.emitUsers();
  }
  ngOnInit(): void {
    this.onFetch();
    this.subscription();
  }

  /**
   * Fonction qui sert à recupérer tous les utilisateurs
   */
  onFetch(){
    this.userService.getUser();
  }
  /**
   * Fonction qui sert à supprimer un utilisateurs
   */
  onDelete(id: number){
    if(confirm('Etes vous sur de vouloir supprimmé cette utilisateur?')){
      this.userService.deleteUser(id).subscribe(res => {
        console.log('Utilisateur supprimé !');
        this.toastrService.error('Utilisateur supprimé !','CRUD APP');
        this.onFetch();
        this.subscription();
      });
    }
  }

  open(content,user: User){
    console.log(user);
    this.id = user.id;
    this.nom = user.nom;
    this.prenom = user.prenom;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) =>{   this.closeResult = `Closed with: ${ result }`; 
    }, (reason) => { 
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });
  }

  private getDismissReason(reason: any): string {
     if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC'; 
     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
       return 'by clicking on a backdrop'; 
     } else { 
       return `with: ${reason}`; 
    } 
  }

  onUpdate(){
    this.userUpdate = {
      id : this.id,
      nom: this.nom,
      prenom: this.prenom
    }
    console.log('Données à modifier: ', this.userUpdate); 
    this.userService.putUser(this.id,this.userUpdate).subscribe(res =>{
      console.log('Utilisateur modifié !');
      this.modalService.dismissAll();
      this.toastrService.warning('Utilisateur modifié !','CRUD APP');
      this.onFetch();
      this.userSubscription = this.userService.userSubject.subscribe(
        (users: User[]) => {
          this.users = users;
        }
      );
      this.userService.emitUsers();
    })
  }

}