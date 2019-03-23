import { Component, OnInit, Output, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Pending } from '../models/pending';
import { DataService } from '../services/data-service.service';
import { AngularFireAuth } from '@angular/fire/auth';

interface Candidate {
  candidate: string;
  sendOut: string;
}

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
  candidates: Candidate[] = [];
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
    'company': ['',Validators.required],
    'jobOwner': ['',Validators.required],
    'baseSalary': ['',[
        Validators.required,
        Validators.pattern('^([0-9][0-9][0-9][0-9][0-9]|[1-9][0-9][0-9][0-9][0-9][0-9])$')
        ]
      ],
    'feePercent': ['',[
        Validators.required, 
        Validators.pattern('^([0-9]{2})+(\.[0-9]{1,2})?$')
      ]
    ],
    'status': ['',Validators.required],
    'user': [''],
    'office': ['']
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

 get feePercent() { return this.pendForm.get('feePercent')}
 get baseSalary() { return this.pendForm.get('baseSalary')}

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
    var test = [];
    var objData: any = {};
    this.pendForm.controls['user'].setValue(this.user.uid)
    this.pendForm.controls['office'].setValue(this.office)

    
    // add each formControl.value to test array as an object 
    this.candidates.forEach(element => {
        test.push({
         name: this.pendForm.controls[element.candidate].value,
         uid: this.pendForm.controls[element.sendOut].value
        })
      
    });

    // remove candidates and owners from pendForm Control
    this.removeCandFromControl(this.candidates, this.pendForm);
    //add pendFrom.value data as an object 
    objData = this.pendForm.value;
    // add candidates object array to objData 
    objData.cand = test;
    // add that data to the UI 
    this.pending.push(objData);
    // dismiss modal -
    this.modalService.dismissAll();
    //save data 
    this.dataService.saveData(objData, 'items');
    // reset the pendForm 
    this.pendForm.reset();
    // empty candidate array so that when adding a new pend modal form is fresh to add new candidates  
    this.candidates = [];
  }

  exit(){
    console.log(this.pendForm.value)
    this.modalService.dismissAll();
    if(this.candidates)
      this.removeCandFromControl(this.candidates, this.pendForm);
      
    this.candidates = [];
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
    this.pendForm.addControl('candidate' + this.candidateNum, new FormControl('', Validators.required));
    this.pendForm.addControl('sendOut' + this.candidateNum, new FormControl('', Validators.required));
  }
 
   removeCandidate(num: number, cand){
    this.candidates.splice(num,1);
    this.pendForm.removeControl(cand.candidate);
    this.pendForm.removeControl(cand.sendOut);

    
   }

   removeCandFromControl(cand: Candidate[], form: FormGroup){
      cand.forEach(element => { 
        form.removeControl(element.candidate);
        form.removeControl(element.sendOut)
      });    
   }

   AddCandArray(){

   }

}
