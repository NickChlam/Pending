import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map , take, switchMap } from 'rxjs/operators'
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';



@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private af: AngularFireAuth){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   
      return this.af.user.pipe(
        map(data => {
          if(data){
            
            return true;
          }
          else{
            this.router.navigate(['/home']);
            return false;
          }
      }))

    }
  }

      // return this.auth.user
      //       .pipe(
      //         take(1), 
      //         map( user => !!(user && user.catchPhrase)),
      //         tap( (loggedIn) => {
      //           console.log(loggedIn)
      //             if(!loggedIn) {
      //               console.log('you must be logged in');
      //               this.router.navigate(['/home']);
      //             }
      //         }),
      //       )
      //   }
  
  

