import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '../configuration/configuration';

/*
  Generated class for the SearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchProvider {

  constructor(public http: HttpClient, private configurationProvider:ConfigurationProvider) {
    console.log('Hello SearchProvider Provider');
  }

  public searchItems(key){
    return new Promise(resolve => {
      this.http.get(this.configurationProvider.apiurl +'/Search?ProductName='+key).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }
}
