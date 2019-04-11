import { Injectable } from '@angular/core';
import { Pending } from '../models/pending';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { map, take, first, takeUntil, tap, takeWhile, takeLast } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  pendingCollection: AngularFirestoreCollection<Pending>;
  userCollection: AngularFirestoreCollection<any>; 
  private pendingDoc: AngularFirestoreDocument<Pending>;
  

  constructor(private afs: AngularFirestore) {
    this.pendingCollection = afs.collection('items');

   }

  addPending(pend){
    this.pendingCollection.add(pend);
  }

  updatePending(id, update){
    this.pendingDoc = this.afs.doc(`items/${id}`);
   this.pendingDoc.update(update);
  }

  deletePending(id){
     // Get the task document
   this.pendingDoc = this.afs.doc(`items/${id}`);
   // Delete the document
   this.pendingDoc.delete();
  }








  getPendData(collection: string, office: string){
    var pendingData: Observable<any>;
     this.pendingCollection = this.afs.collection(collection, ref => {
      return ref 
        .where('office', '==', office)
    })
    // use snapshot chnages and map the id from the doc
    pendingData = this.pendingCollection.snapshotChanges().pipe(take(1),
        map(actions => {
         return actions.map(a => {
           const data = a.payload.doc.data() as Pending;
            //Get document id
           const id = a.payload.doc.id;
           //Use spread operator to add the id to the document data
         return { id, ...data };
       })
      }))
    return pendingData;
    
  }
  // TODO : delete this method and replace references with the above method  - above method can be renamed 
  getUsersFromOffice(office:string){
    var userData: Observable<any[]>;
    this.userCollection = this.afs.collection('users', ref => {
      return ref
        .where('office', '==', office)
        
    });

     userData =  this.userCollection.valueChanges()
    
   return userData;
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

  // TODO:  replace with AddPending Method above 
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

    userData =  this.userCollection.valueChanges();

    return userData;


    

    
  }

  
 
  


}


