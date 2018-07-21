import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MessagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessagesProvider {
   email_validation:string= 'Please enter a valid Email Address.';
   otp_validation:string='Please enter otp.';
   password_validation:string='Please enter valid password.';
   invalid_user:string='Invalid username/password, please try again.';
   user_exist:string = 'User already exist, please try rest password.';
  constructor(public http: HttpClient) {
    console.log('Hello MessagesProvider Provider');
  }

}
