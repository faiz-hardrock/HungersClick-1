import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '../configuration/configuration';
/*
  Generated class for the HomeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HomeProvider {

  constructor(public http: HttpClient, public configurationProvider:ConfigurationProvider) {
    console.log('Hello HomeProvider Provider');
  }

  public getPanels(){
    return new Promise(resolve => {
      this.http.get(this.configurationProvider.apiurl+'/panel?IncludeDeactive=false&'+'Platform=Mobile').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
