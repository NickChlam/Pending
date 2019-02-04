import { Injectable } from '@angular/core';
import { Pending } from '../models/pending';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { map, take, first, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  pendingCollection: AngularFirestoreCollection<Pending>;
  userCollection: AngularFirestoreCollection<User>; //TODO : create model for User 
  

  constructor(private afs: AngularFirestore) { }

  
  getPendData(collection: string, office: string){
    var pendingData: Observable<Pending[]>;
     this.pendingCollection = this.afs.collection(collection, ref => {
      return ref 
        .where('office', '==', office)
        
        
    })
    pendingData = this.pendingCollection.valueChanges().pipe(take(1))
    return pendingData;
    
  }

  getData(){
    return this.afs.collection(
      'items',
        ref => ref 
      .where('office', '==', '00610')
      
      
    ).snapshotChanges().pipe( map( x => {
      return x;
    }))
      
    
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
    var userData: Observable<User[]>;
    this.userCollection = this.afs.collection('users', ref => {
      return ref
        .where('office', '==', office)
        
    });

    userData =  this.userCollection.valueChanges().pipe(first(), map(user => {
      return user;
    }));
    return userData;
  }

  getOfficeUser(uid: string){
    
    this.userCollection = this.afs.collection('users', ref => {
      return ref
        .where('uid', '==', uid)
        
    });

    return this.userCollection.valueChanges();
  } 

  getUsers(){
    var userData: Observable<User[]>;
    
    this.userCollection = this.afs.collection('users');

    userData =  this.userCollection.valueChanges().pipe(take(1));

    return userData;


    

    
  }

  
 
  


}


