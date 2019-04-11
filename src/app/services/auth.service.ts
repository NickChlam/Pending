import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth} from '@angular/fire/auth';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AlertifyService } from './alertify.service';

interface User {
  uid: string;
  email: string;
  knownAs?: string;
  photoURL?: string;
  catchPhrase?: string;
  office?: string;
  LOB?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;
  
  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private alertify: AlertifyService  ){
      // TODO: refactor - this is bieng executed anytime the service is injected and used 
      this.user = this.afAuth.authState  
        .pipe(switchMap(user => {
          if(user) {
            console.log("injected user ")
            return this.afs.doc<User>('users/' + user.uid).valueChanges().pipe(take(1))
          } else {
            return EMPTY;
          }
        }))
        
    }
  /// Email/Password Auth 

  emailSignUp(email: string, password: string, displayName?: string,office?: string, LOB?: string, photoURL?:string  ) {
    
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.router.navigate(['/detail'])
        this.afAuth.auth.currentUser.updateProfile( { 'displayName': displayName, 'photoURL': photoURL});
        return this.setUserDoc(user, displayName, office, LOB)
      })
    
  }


  // sets user data to firestore after successful login

  private setUserDoc(user, displayName: string, off: string, lob:string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc('users/' + user.user.uid);
    
    const data: User = {
      uid: user.user.uid,
      email: user.user.email,
      knownAs: displayName,
      office: off,
      LOB: lob
    }
    console.log(data)
    return userRef.set(data)
  }

}
