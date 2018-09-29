import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConfigurationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigurationProvider {

 // public apiurl = 'http://localhost:13518/api';
 public apiurl = 'http://testapi.karrykart.com/api';
  
  constructor(public http: HttpClient) {
    //console.log('Hello ConfigurationProvider Provider');
  }

}
