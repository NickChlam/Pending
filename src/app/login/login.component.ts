import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(public afAuth: AngularFireAuth, private fb: FormBuilder,
              private router: Router,
              private alertify : AlertifyService
              ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'email': ['', [
        Validators.required, 
        Validators.email 
        // TODO: Create Custom @rht email validator 
        ]
      ], 
      'password': ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        ]
      ]
  });
  }

  get email() { return this.loginForm.get('email')}
  get password() { return this.loginForm.get('password')}

  login() {
    
    
    this.afAuth.auth.signInWithEmailAndPassword(this.email.value, this.password.value)
        .then(value => {
          if(value)
            this.router.navigate(['/detail']);
           
            
    }, err => {
      this.alertify.error(err.message)
      this.loginForm.controls.password.reset();
      
    },) 

    
  }
  logout() {
    this.afAuth.auth.signOut();
  }

}

//TODO: notify user of incorrect credentials reset form. 

