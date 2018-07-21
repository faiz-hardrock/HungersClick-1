import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
/*
  Generated class for the ValidatorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ValidatorProvider {
 emailPattern:any = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  constructor(public http: HttpClient) {
    console.log('Hello ValidatorProvider Provider');
  }

  validateEmail(email){
   console.log(this.emailPattern.test(email));
      return this.emailPattern.test(email);
  }
  
}
