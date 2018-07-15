import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
/*
  Generated class for the StoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StoreProvider {

  constructor(public http: HttpClient, public storage:Storage) {
    console.log('Hello StoreProvider Provider');
  }

  setStore(key,value)
  {
      
    this.storage.set(key, value).then((data) =>{
    return true; 

    });
    
  }

  removeStore(key)
  {
    this.storage.remove(key).then((result)=>{
      return true;
    });
  }

  getStore(key){
    return new Promise((resolve, reject) => {
      this.storage.get(key).then((result)=>{
     
      });
    });
  }

}
