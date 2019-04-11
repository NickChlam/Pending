import { Component, OnInit, Input } from '@angular/core';
import { Pending } from '../models/pending';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { DataService } from '../services/data-service.service';
import { User } from '../models/user';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PendEditComponent } from '../pend-edit/pend-edit.component';


@Component({
  selector: 'app-pend-detail',
  templateUrl: './pend-detail.component.html',
  styleUrls: ['./pend-detail.component.css']
})
export class PendDetailComponent implements OnInit {
  users: User[] = [];
  pending = [];
  items: Observable<any[]>;
  userOffice = localStorage.getItem('office')
  updateFormData: FormGroup;
  clicked: boolean;
  row: number;
  prevRow: number;
  show = false;

  pending2: Observable<any[]>;
  users2 = [];


  constructor(private dataService: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {

    this.route.data.subscribe(data => {

      this.pending = data.data;
      this.users = data.users;

      this.convertUIDtoName(this.pending)

    })
  }

  ngOnInit() {

    console.log(this.pending)
    // this.pending2 = this.afs.collection("items").snapshotChanges().pipe(
    //   map(actions => {
    //    return actions.map(a => {
    //      const data = a.payload.doc.data() as Pending;
    //       //Get document id
    //      const id = a.payload.doc.id;
    //      //Use spread operator to add the id to the document data
    //      data.jobOwner = this.getUserName(data.jobOwner, this.users2)
    //      this.pending.push({id, data})

    //    return { id, ...data };
    //  })
    // }))

    //

    this.updateFormData = this.fb.group({
      office: ['',],
      users: [this.userOffice,]
    })



  }

  test() {

  }

  delete(i){
    this.dataService.deletePending(this.pending[i].id);
    this.pending.splice(i, 1);
  }

  open() {
    const modalRef = this.modalService.open(PendEditComponent,
       { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdropClass: 'light-blue-backdrop' });
    // pass pending into modal window
    modalRef.componentInstance.pending = this.pending;

  }
  edit(i) {
    const modalRef = this.modalService.open(PendEditComponent, 
      { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdropClass: 'light-blue-backdrop' });
    modalRef.componentInstance.edit = this.pending[i];
  }

  getData(office: string) {
    this.dataService.getPendData('items', office).subscribe(data => {
      this.pending = data;
      this.convertUIDtoName(this.pending);
    }, err => {
      // TODO : log errors
    });
  }

  getUsers() {
    this.dataService.getUsers().subscribe(data => {
      this.users = data;

    }, err => {
      // TODO: error logger 
    });

  }

  updateData() {
    // console.log(this.data.data)
    this.pending = [];
    let off = this.updateFormData.controls['office'].value;
    this.getData(off);


  }



  convertUIDtoName(pend: any) {

    pend.map(element => {
      element.jobOwner = this.getUserName(element.jobOwner, this.users);
      element.cand.map(e => e.uid = this.getUserName(e.uid, this.users))
    });
    return pend;
  }



  getUserName(uid: string, userData: any) {

    var x = userData.map(x => {
      return x.uid
    }).indexOf(uid)

    return userData[x].knownAs;
  }


  calcFeeAmount(pend: Pending) {
    if (pend.feePercent < 1)
      return pend.baseSalary * pend.feePercent;
    else
      return pend.baseSalary * (pend.feePercent / 100);
  }

  calcAvgFee(pend: Pending[]) {
    const sum = pend.reduce((accumulator, Currentvalue) => {
      return accumulator + Number(Currentvalue.feePercent)
    }, 0)

    return (sum / pend.length);
  }

  calcTotal(pend: Pending[]) {
    const sum = pend.reduce((accumulator, Currentvalue) => {
      return accumulator + Number(Currentvalue.baseSalary * (Currentvalue.feePercent / 100))
    }, 0)

    return (sum);
  }

  toggle(num: number) {
    this.row = num;

    if (!this.clicked)
      this.prevRow = -1;

    if (this.prevRow === num) {
      this.clicked = false;
    } else this.clicked = true;

    this.prevRow = num;

  }


}
