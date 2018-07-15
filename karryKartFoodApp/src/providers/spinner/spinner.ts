import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController,LoadingController,ToastController,Events } from 'ionic-angular';
/*
  Generated class for the SpinnerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SpinnerProvider {
  
  public loading;

  constructor(public http: HttpClient,public loadingCtrl: LoadingController) {
    console.log('Hello SpinnerProvider Provider');
  }

  LoadSpinner()
  {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

  }

  DestroySpinner()
  {

    this.loading.dismiss();
  }

  // presentLoadingDefault(time) {
   
  
  //   loading.present();
  
  //   setTimeout(() => {
  //     loading.dismiss();
  //   }, time);
  // }
}
