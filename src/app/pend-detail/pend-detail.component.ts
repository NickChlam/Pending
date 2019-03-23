import { Component, OnInit, Input } from '@angular/core';
import { Pending } from '../models/pending';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DataService } from '../services/data-service.service';
import { User } from '../models/user';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-pend-detail',
  templateUrl: './pend-detail.component.html',
  styleUrls: ['./pend-detail.component.css']
})
export class PendDetailComponent implements OnInit   {
  users: User[] = [];
  pending: Pending[] = [];
  items: Observable<any[]>;
  userOffice = localStorage.getItem('office')
  updateFormData: FormGroup;
  data: any;
  clicked: boolean ;
  row: number;
  prevRow : number;
 
  
  constructor( private afs: AngularFirestore, private dataService: DataService,
               private fb: FormBuilder,
               private route: ActivatedRoute
               ) {
                
                this.route.data.subscribe(data => {
                  this.data = data;
                  this.pending = data.data;
                  this.users = data.users
                  // TODO: fix converting to names on load 
                  this.convertUIDtoName(this.pending)
                  this.convertUIDtoName
                  console.log(this.pending[1].cand)
                  })  

                  
                  
   }  

  ngOnInit() {
    
    // TODO:  remove subscribe hack to force load the rest of user data 
   this.afs.collection('users').valueChanges().subscribe()
    
  
    //
    console.log(this.data)
    this.updateFormData = this.fb.group({
      office: ['',],
      users:[this.userOffice,]
    })

  
 
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
    //console.log(this.data.data)
    this.pending = [];
    let off = this.updateFormData.controls['office'].value;
    this.getData(off);
    

  }


  
   convertUIDtoName(pend: Pending[]){
    
    pend.map(element => {
        
    element.jobOwner = this.getUserName(element.jobOwner, this.data.users);
    //TODO: FIX 
      //element.sendOut = this.getUserName(element.sendOut, this.data.users);
    });
    
    return pend;
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout( ()=>resolve(), ms)).then(()=> this.convertUIDtoName(this.pending));
}

  getUserName(uid: string, userData){
    
    var x = userData.map(x => {
      return x.uid
    }).indexOf(uid)

  
      return userData[x].knownAs;
    
  
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

  toggle(num: number){
    this.row = num;

    if (!this.clicked)
      this.prevRow = -1;

    if(this.prevRow === num){
      this.clicked = false;
    }else this.clicked = true;

    this.prevRow = num;

  }


}
