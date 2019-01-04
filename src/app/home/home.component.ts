import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data-service.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  constructor() { }
  
  ngOnInit() {
   
  }

  execute(){
    
  }

}
