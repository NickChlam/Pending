import { Component, OnInit, Input } from '@angular/core';
import { Pending } from '../models/pending';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DataService } from '../services/data-service.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user';
import { Offices} from '../models/offices';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-pend-detail',
  templateUrl: './pend-detail.component.html',
  styleUrls: ['./pend-detail.component.css']
})
export class PendDetailComponent implements OnInit {
  users: User[] = [];
  pending: Pending[] = [];
  items: Observable<any[]>;
  userOffice = localStorage.getItem('office')
  Offices = Offices;
  updateFormData: FormGroup;
 
  
  constructor( private afs: AngularFirestore, private dataService: DataService,
               private auth: AuthService,
               private afAuth: AngularFireAuth,
               private fb: FormBuilder
               ) {

                
    
   }

  ngOnInit() {
    
    this.getData(this.userOffice);
    this.updateFormData = this.fb.group({
      office: ['',],
      users:[this.userOffice]
    })

    this.getUsers();
  }
  
  getData(office: string){
    this.dataService.getPendData('items', office).subscribe(data => {
      this.pending = data;
      this.convertUIDtoName(this.pending);
    }, err => {
      //TODO : log errors
    });
  }

  getUsers(){
    this.dataService.getUsers().subscribe(data => {
      this.users = data;
      
    }, err => {
      // TODO: error logger 
    });
    
  }

  updateData(){
    this.pending = [];
    let off = this.updateFormData.controls['office'].value;
    this.getData(off);
    

  }

  getUserName(uid: string, userData: User[]){
    var x = userData.map(x => {
      return x.uid
    }).indexOf(uid)

    return userData[x].knownAs;
  }

  convertUIDtoName(pend: Pending[]){
   pend.map(element => {
      element.jobOwner = this.getUserName(element.jobOwner, this.users);
      element.sendOut = this.getUserName(element.sendOut, this.users);
    });
  }

  calcFeeAmount(pend: Pending){ 
    if(pend.feePercent < 1)
      return pend.baseSalary * pend.feePercent;
    else
    return pend.baseSalary * (pend.feePercent / 100);
  }

  calcAvgFee(pend: Pending[]){
    const sum = pend.reduce((accumulator, Currentvalue) => {
      return accumulator + Number(Currentvalue.feePercent)
    }, 0)
 
    return ( sum / pend.length ) ;
  }

  calcTotal(pend: Pending[]){
    const sum = pend.reduce((accumulator, Currentvalue) => {
      return accumulator + Number(Currentvalue.baseSalary * (Currentvalue.feePercent/100))
    }, 0)
 
    return ( sum  ) ;
  }

  

 


}
