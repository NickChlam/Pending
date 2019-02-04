import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { DataService } from '../services/data-service.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class UserResolverService implements Resolve<any> {

  constructor(private dataService: DataService, private http: HttpClient) { }
  
    resolve(): Observable<any>{
      var office = localStorage.getItem('office')
       return this.dataService.getPendData('items', office)
     

   
      
    }
}
