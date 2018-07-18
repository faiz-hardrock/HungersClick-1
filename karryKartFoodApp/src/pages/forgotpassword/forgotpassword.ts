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
  otpValue:string=null;
  pValue:string=null;
  cValue:string=null;
  constructor(public navCtrl: NavController, public navParams: NavParams, private authProvider:AuthenticationProvider,private spinnerProvider:SpinnerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  checkForValidUser(){
    this.spinnerProvider.LoadSpinner();
    if(this.email!=null || this.email.length!=0){
      this.authProvider.forgotPassword(this.email).then(result=>{
        if(result!=null){
          if(result){
          //enable otp panel
          this.enableOtp=true;
          this.forgotMessage='Please enter the otp sent to your email.';
          this.enableMsg=true;
          }
        }
        this.spinnerProvider.DestroySpinner();
      })
    }
  }

  verifyUser(){
    this.spinnerProvider.LoadSpinner();
    if(this.email.length>0 && this.otpValue.length>0){
    this.authProvider.verifyForgotPasswordUser(this.email,this.otpValue).then(result=>{
      if(result!=null){
        if(result){
          this.enableOtp=false;
          this.enableChangePassword=true;
          this.forgotMessage='Please set new password for yourself.';

        }
      }
      this.spinnerProvider.DestroySpinner();
    });
  }
  }

  changePassword(){
    if(this.pValue==this.cValue){
      
    }

  }

}
