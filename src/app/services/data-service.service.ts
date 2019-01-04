import { Injectable } from '@angular/core';
import { Pending } from '../models/pending';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getViewData } from '@angular/core/src/render3/instructions';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  pendingCollection: AngularFirestoreCollection<Pending>;
  userCollection: AngularFirestoreCollection; //TODO : create model for User 
  
  user;

  constructor(private afs: AngularFirestore) { }

  
  getData(collection: string){
    var pendingData: Observable<Pending[]>;
    this.pendingCollection = this.afs.collection(collection)
    pendingData = this.pendingCollection.valueChanges();
    return pendingData;

  }

  saveData(object: any,collection: string){
    this.pendingCollection = this.afs.collection(collection)
    this.pendingCollection.add(object);
  }

  getUserData(user: string){
    this.pendingCollection = this.afs.collection('items', ref => {
      return ref
        .where('jobOwner', '==', user)
        .where('sendOut', '==', user)
    });

    return this.pendingCollection.valueChanges();

  }

  getUsersFromOffice(office:string){
    this.userCollection = this.afs.collection('users', ref => {
      return ref
        .where('office', '==', office)
        
    });

    return this.userCollection.valueChanges();
  }

  getOfficeUser(uid: string){
    
    this.userCollection = this.afs.collection('users', ref => {
      return ref
        .where('uid', '==', uid)
        
    });

    return this.userCollection.valueChanges();
  } 

  

  


}


