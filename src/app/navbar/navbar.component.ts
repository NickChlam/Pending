import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { getLocaleDayNames } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user1;
  
  constructor(private auth: AuthService, private afAuth: AngularFireAuth) { }
  
  ngOnInit() {
    return this.afAuth.user.pipe(
      map(data => {
        this.user1 = data
        console.log("hello")
  }))
  }

  ngAfterViewInit(){
   
}
  
  

}
