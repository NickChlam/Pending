import { Component, OnInit, Output, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbDatepicker, NgbDropdown, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Pending } from '../models/pending';
import { DataService } from '../services/data-service.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pend-edit',
  templateUrl: './pend-edit.component.html',
  styleUrls: ['./pend-edit.component.css']
})
export class PendEditComponent  {
  closeResult: string;
  pendForm: FormGroup;
  employees =  [];
  user;
  currUserFromFirebase = [];
  office;
  @Input() pending: Pending[];



  constructor(  config: NgbModalConfig, 
                private modalService: NgbModal,
                private fb: FormBuilder,
                private dataService: DataService,
                private afAuth: AngularFireAuth) 
  {
    config.backdrop = 'static';
    config.keyboard = false;
  }

 ngOnInit(){
  this.pendForm = this.fb.group({
    company: ['',Validators.required],
    candidate: ['',Validators.required],
    jobOwner: ['',Validators.required],
    sendOut: ['',Validators.required],
    baseSalary: ['',Validators.required],
    feePercent: ['',Validators.required],
    status: ['',Validators.required],
    user: ['']
  })

  //get current users uid
  this.user =  this.afAuth.auth.currentUser.uid
  
  // get user from FireStore set users from office;
  // TODO: refactor 
  this.dataService.getOfficeUser(this.user)
    .subscribe(data => {
              this.currUserFromFirebase = data;
              this.getOffice();
              this.getUsersFromOffice(this.office);
      })
 }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', backdropClass: 'light-blue-backdrop'})
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.pendForm.reset();
    });
    
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
      //this.pendForm.reset();
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
      //this.pendForm.reset();
    }
  }

  save(){
    this.pendForm.controls['user'].setValue(this.user)
    this.pending.push(this.pendForm.value);
    this.modalService.dismissAll() ;
    //save data 
    this.dataService.saveData(this.pendForm.value, 'items');
    this.pendForm.reset();
  }
  exit(){
    this.modalService.dismissAll();
    this.pendForm.reset();
    
  }

  getOffice(){
    this.currUserFromFirebase.forEach( value => {
      this.office = value.office
    })
  }

  getUsersFromOffice(office: string){
    this.dataService.getUsersFromOffice(office).subscribe( data => {
      this.employees = data;
    })
  }

 // <li class="btn btn-primary" [routerLink]="['/members/', user.id]" routerLinkActive="router-link-active" ><i class="fa fa-user"></i></li>

   

}
