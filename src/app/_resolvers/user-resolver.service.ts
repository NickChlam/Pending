import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { DataService } from '../services/data-service.service';
import { Observable } from 'rxjs';



@Injectable()
export class UserResolverService implements Resolve<any> {

  constructor(private dataService: DataService) { }
  
    resolve(): Observable<any>{
      console.log("resolving items")
      var office = localStorage.getItem('office')
       return this.dataService.getPendData('items', office)
    }
}
