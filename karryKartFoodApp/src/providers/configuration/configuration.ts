import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConfigurationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigurationProvider {
  //Dev URL
  // public apiurl = 'http://localhost:13518/api';
  // public paymentURL = 'http://localhost:13518/PaymentRedirect/Index';
  // public successURL = 'http://localhost:13518/PaymentRedirect/Success';
  // public webURL =  'http://test.karrykart.com';
  
  // Test URL
  
  // public apiurl = 'http://testapi.karrykart.com/api';
  // public paymentURL = 'http://testapi.karrykart.com/PaymentRedirect/Index';
  // public successURL = 'http://testapi.karrykart.com/PaymentRedirect/Success';
  // public webURL =  'http://test.karrykart.com';
 
  public apiurl = 'http://api.karrykart.com/api';
  public paymentURL = 'http://api.karrykart.com/PaymentRedirect/Index';
  public successURL = 'http://api.karrykart.com/PaymentRedirect/Success';
  public webURL =  'http://www.karrykart.com';
  
  constructor(public http: HttpClient) {
    //console.log('Hello ConfigurationProvider Provider');
  }

}
