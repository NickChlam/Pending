import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { validateConfig } from '@angular/router/src/config';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; 
import { Offices } from '../models/offices';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { take, map } from 'rxjs/operators';


@Component({
  selector: 'signUp',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  
  signupForm: FormGroup;
  detailForm: FormGroup;
  offices = Offices;
  constructor(public fb: FormBuilder, public auth: AuthService, private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
        email: ['', [
          Validators.required, 
          Validators.email 
          ]
        ], 
        password: ['', [
          Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
          Validators.minLength(6),
          Validators.maxLength(25),
          ]
        ],
        confirmPassword: ['', Validators.required],
        knownAs: ['', Validators.required],
        office: ['', Validators.required]

    },  {validator: this.passwordMatchValidator});

    this.detailForm = this.fb.group({
        'catchPhrase': ['', [Validators.required]]
    });

  }

  passwordMatchValidator(g: FormGroup){
    
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }

  // getters for form
  get email() { return this.signupForm.get('email')}
  get password() { return this.signupForm.get('password')}

  get knownAs() { return this.signupForm.get('knownAs')};
  get office() { return this.signupForm.get('office')};

  signup() {
    
    this.auth.emailSignUp(this.email.value, this.password.value, this.knownAs.value,
                          this.office.value);
  }

}
