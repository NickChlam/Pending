import { Component, OnInit, Output, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Pending } from '../models/pending';
import { DataService } from '../services/data-service.service';
import { AngularFireAuth } from '@angular/fire/auth';


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
  candidates = [];
  candidateNum = 0;
  candOwners = [];
  



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
    jobOwner: ['',Validators.required],
    baseSalary: ['',Validators.required],
    feePercent: ['',Validators.required],
    status: ['',Validators.required],
    user: [''],
    office: ['']
  })

  //get current users uid
  this.user =  this.afAuth.auth.currentUser;
  
  // get user from FireStore set users from office;
  // TODO: refactor 
  this.dataService.getOfficeUser(this.user.uid)
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
    var data = [];
    
    this.pendForm.controls['user'].setValue(this.user.uid)
    this.pendForm.controls['office'].setValue(this.office)
    data.push(this.pendForm.value);
        

    this.pending.push(this.pendForm.value);
    this.modalService.dismissAll() ;
    //save data 
    this.dataService.saveData(this.pendForm.value, 'items');
    console.log(data)
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

  AddCandidate(){
    
    this.candidateNum++;
    this.candidates.push({candidate: 'candidate' + this.candidateNum, sendOut: 'sendOut' + this.candidateNum})

   // this.candidates.push('candidate' + this.candidateNum)
   
    this.pendForm.addControl('candidate' + this.candidateNum, new FormControl('', Validators.required));
    this.pendForm.addControl('sendOut' + this.candidateNum, new FormControl('', Validators.required));
    console.log('Add Candidates')
   // this.candidates.push({name: this.pendForm.controls['candidate' + this.candidateNum].value, uid:  this.pendForm.controls['sendOut' + this.candidateNum].value})
    console.log(this.pendForm.controls)
    console.log(this.candidates)
    
  }
 // <li class="btn btn-primary" [routerLink]="['/members/', user.id]" routerLinkActive="router-link-active" ><i class="fa fa-user"></i></li>

   

}
