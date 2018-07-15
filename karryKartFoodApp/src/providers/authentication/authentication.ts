import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '../../providers/configuration/configuration';
import { Events } from 'ionic-angular';
/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  constructor(public http: HttpClient, public configurationProvider:ConfigurationProvider) {
    console.log('Hello AuthenticationProvider Provider');
  }

  login(key,value)
  {
    return new Promise(resolve => {
      this.http.get(this.configurationProvider.apiurl +'/Login?key='+key+'&value='+value).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  
  logOut(key,token)
  {
    return new Promise(resolve => {
      this.http.get(this.configurationProvider.apiurl +'/Logout?key='+key+'&token='+token).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  checkLogin(user)
  {
    return new Promise((resolve, reject) => {
      this.http.post(this.configurationProvider.apiurl+'/CheckLogin', JSON.stringify(user),{ 
        headers: { 
           'Content-Type': 'application/json'
        }
     })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  signUpUser(name,email,key ){
    var user = {
      'user':email,
      'Name':name,
      'pwd':key
    };
    return new Promise((resolve, reject) => {
      this.http.post(this.configurationProvider.apiurl+'/SignUp', JSON.stringify(user),{ 
        headers: { 
           'Content-Type': 'application/json'
        }
     })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  verifyUser(usr,userID,otp){
    var user = {
      'user':usr,
      'UserID':userID,
      'Otp':otp
    };

    return new Promise((resolve, reject) => {
      this.http.put(this.configurationProvider.apiurl+'/SignUp', JSON.stringify(user),{ 
        headers: { 
           'Content-Type': 'application/json'
        }
     })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
}
