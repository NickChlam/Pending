import { Component, OnInit, Input } from '@angular/core';
import { Pending } from '../models/pending';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DataService } from '../services/data-service.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-pend-detail',
  templateUrl: './pend-detail.component.html',
  styleUrls: ['./pend-detail.component.css']
})
export class PendDetailComponent implements OnInit {
  
  pending: Pending[] = [];
  items: Observable<any[]>;
  data1: any;
  
  constructor( private afs: AngularFirestore, private dataService: DataService,
               private auth: AuthService,
               private afAuth: AngularFireAuth) {
    
   }

  ngOnInit() {
    this.dataService.getData('items').subscribe(data => {
      this.pending = data;
    })
  }

  calcFeeAmount(pend: Pending){ 
    if(pend.feePercent < 1)
      return pend.baseSalary * pend.feePercent;
    else
    return pend.baseSalary * (pend.feePercent / 100);

  }

 


}
