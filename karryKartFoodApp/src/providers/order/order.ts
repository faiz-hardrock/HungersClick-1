import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '../configuration/configuration';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {

  constructor(public http: HttpClient, public configurationProvider:ConfigurationProvider) {
   
  }

  getUserOrders(userID)
  {
    return new Promise(resolve => {
      this.http.get(this.configurationProvider.apiurl+'/order?OrderID=&'+'UserID='+userID+'&CartID=').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getOrderByCartID(cartID,userID)
  {
    return new Promise(resolve => {
      this.http.get(this.configurationProvider.apiurl+'/order?OrderID=&'+'UserID='+userID+'&CartID='+cartID).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
