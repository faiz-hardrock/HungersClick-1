import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Spinner } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

import { SpinnerProvider } from '../../providers/spinner/spinner';
/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
  enableOtp:boolean=false;
  enableChangePassword:boolean=false;
  enableMsg:boolean=false;
  forgotMessage:string=null;
  email:string=null;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider:AuthenticationProvider,private spinnerProvider:SpinnerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  checkForValidUser(){
    if(this.email!=null || this.email.length!=0){
      this.authProvider.forgotPassword(this.email).then(result=>{
        if(result!=false){
          //enable otp panel
        }
      })
    }
  }

}
