import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { DataService } from '../services/data-service.service';
import { Observable } from 'rxjs';
import { take , first} from 'rxjs/operators';



@Injectable()
export class GetUsersResolver implements Resolve<any> {

  constructor(private dataService: DataService) { }
  
    resolve(): Observable<any>{
     
      console.log('resolving2')
      
      var office = localStorage.getItem('office')
       return this.dataService.getUsersFromOffice(office)
      // return this.dataService.getUsers().pipe(first());
      
    }
}
