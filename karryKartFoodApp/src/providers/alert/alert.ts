import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(public http: HttpClient, public toastCtrl:ToastController) {
    console.log('Hello AlertProvider Provider');
  }

  presentToast(msg,timeInMiliSecs,pos) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: timeInMiliSecs,
      position: pos
    });
    toast.present();
  }
}
