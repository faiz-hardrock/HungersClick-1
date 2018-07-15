import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,ToastController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { StoreProvider } from '../../providers/store/store';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { ForgotpasswordPage } from '../../pages/forgotpassword/forgotpassword';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  selectedSegment:any;
  login:any=true;
  signup:any;
  email:any;
  value:any;
  EnableOtp:boolean=false;
  SignUpOtp:any;
  SignUpValue:any;
  signUpEmail:any;
  signUpName:any;
  userID:any;
  signUpMessage:any;
  signUPDetails=<any>{};
  constructor(public navCtrl: NavController, public toastCtrl: ToastController,  public navParams: NavParams, public authProvider:AuthenticationProvider, public storeProvider:StoreProvider, public spinnerProvider: SpinnerProvider, public events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onSegmentChanged(segmentButton: any) {
    this.selectedSegment = segmentButton._value; //all, read, unread
    switch(segmentButton._value){
    case "login":
    this.login = true;
    this.signup = false;
    
    break;
    case "signup":
    this.login = false;
    this.signup = true;
    break;
   
  }
   

    
  }

  loginUser()
  {
    this.spinnerProvider.LoadSpinner();
    this.authProvider.login(this.email,this.value).then(result=>{
      //console.log('from login.ts');
    this.storeProvider.setStore("user",result);
    this.events.publish('user:logged', result);
    this.spinnerProvider.DestroySpinner(); 
    this.navCtrl.pop();
    });

  }
  signUpUser(){
    this.spinnerProvider.LoadSpinner();
    
    this.authProvider.signUpUser(this.signUpName,this.signUpEmail,this.SignUpValue).then(result=>{
      console.log(result);
      if(result!=null){
        this.signUPDetails = result;
      if(this.signUPDetails.Message=='user_created'){
        this.userID=this.signUPDetails.UserID;
        this.signUpName = this.signUPDetails.Name;
        this.signUpEmail = this.signUPDetails.user;
        this.signUpMessage = 'Hello '+this.signUPDetails.Name+', please enter the otp we have sent to your email.'; 
        this.EnableOtp=true;
      }
    }
      this.spinnerProvider.DestroySpinner();
    });
  }

  verifyUser(){
    this.spinnerProvider.LoadSpinner();

    this.authProvider.verifyUser(this.signUpEmail,this.userID,this.SignUpOtp).then(result => {
        if(result==true){
        this.signUpName = '';
        this.signUpEmail = '';
        this.SignUpValue = '';
        this.SignUpOtp = '';
        this.signUpMessage = ''; 
        this.EnableOtp=false;
        this.login=true;
        this.signup=false;
        this.spinnerProvider.DestroySpinner();
        this.presentToast();
        }else{
          this.signUpMessage = "We're unable to verify your email. Please try again.";
          this.spinnerProvider.DestroySpinner();
        }
       
    });

  }

  goToForgotPassword()
  {
    this.navCtrl.push(ForgotpasswordPage);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: "Thank you, we welcome you to hunger's click. You can login now.",
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
