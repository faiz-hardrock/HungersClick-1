import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,ToastController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { StoreProvider } from '../../providers/store/store';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { ValidatorProvider } from '../../providers/validator/validator';
import { ForgotpasswordPage } from '../../pages/forgotpassword/forgotpassword';
import { MessagesProvider } from '../../providers/messages/messages';
import { FormControl, FormBuilder, FormGroup, Validators,ValidatorFn,AbstractControl } from '@angular/forms';
import { CheckoutPage } from '../checkout/checkout';
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
  email:any='';
  value:any='';
  EnableOtp:boolean=false;
  SignUpOtp:any='';
  SignUpValue:any='';
  signUpEmail:any='';
  signUpName:any='';
  userID:any;
  signUpMessage:any;
  signUPDetails=<any>{};
  loginDetails = <any>{};
  userLogin: FormGroup;
  userSignUp: FormGroup;
  loginMsgEnabled:boolean=false;
  msgClass:string='';
  loginMessage:string='';
  msgSignUpColor:string='';
  enableSignUpMessage:boolean=false;
  fromCart:boolean=false;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController,  
    public navParams: NavParams, public authProvider:AuthenticationProvider, 
    public storeProvider:StoreProvider, public spinnerProvider: SpinnerProvider, 
    public events: Events, private formBuilder: FormBuilder, private validationsProvider:ValidatorProvider, 
    private messageProvider:MessagesProvider ) {
      this.userLogin = this.formBuilder.group({
        email: ['',Validators.compose([Validators.email,Validators.required])],
        value: ['',Validators.compose([Validators.required, Validators.minLength(8)])]
      });

      this.userSignUp = this.formBuilder.group({
        signUpEmail: ['',Validators.compose([Validators.email,Validators.required])],
        SignUpValue: ['',Validators.compose([Validators.required, Validators.minLength(8)])],
        signUpName:  ['',Validators.required],
        SignUpOtp:  ['',Validators.required]
      });

     this.fromCart=this.navParams.get('fromCart');
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
    //if( this.email.length >0 && this.value.length >0 ){
    this.spinnerProvider.LoadSpinner();
    this.authProvider.login(this.email,this.value).then(result=>{
      
      if(result!=null)
        this.loginDetails=result;
        
       console.log(this.loginDetails);

    if(this.loginDetails.Error==null){
      
    this.storeProvider.setStore("user",this.loginDetails);
    this.events.publish('user:logged', this.loginDetails);
    this.spinnerProvider.DestroySpinner(); 
    if(this.fromCart)
    {
      this.navCtrl.setRoot(CheckoutPage);
    }
    else
    {
      this.navCtrl.pop();
    }
    }
    else if(this.loginDetails.Error=='invalid_user'){
     
      this.loginMsgEnabled=true;
      this.msgClass="danger";
      this.loginMessage= this.messageProvider.invalid_user;
      this.spinnerProvider.DestroySpinner(); 
    }
    else{
      //handle some other error
    }
    });
  //}else{

  //}
  }


  signUpUser(){
    if(this.signUpEmail.length>0 && this.signUpName.length>0 && this.SignUpValue.length>0){
     // if(this.validationsProvider.validateEmail(this.email)){
          this.spinnerProvider.LoadSpinner();
          this.authProvider.signUpUser(this.signUpName,this.signUpEmail,this.SignUpValue).then(result=>{
      if(result!=null){
          this.signUPDetails = result;
          
      if(this.signUPDetails.Message=='user_created'){
          this.userID=this.signUPDetails.UserID;
          this.signUpName = this.signUPDetails.Name;
          this.signUpEmail = this.signUPDetails.user;
          this.enableSignUpMessage=true;
          this.msgSignUpColor='secondary';
          this.signUpMessage = 'Please enter the otp sent to your email.'; 
          this.EnableOtp=true;
      }else if(this.signUPDetails.Message='user_exist'){
          this.enableSignUpMessage=true;
          this.msgSignUpColor='danger';
          this.signUpMessage = this.messageProvider.user_exist; 
      }
    }
      this.spinnerProvider.DestroySpinner();
    });
 // }
}
  }

  verifyUser(){
    if(this.SignUpOtp.length > 0){
    this.spinnerProvider.LoadSpinner();

    this.authProvider.verifyUser(this.signUpEmail,this.userID,this.SignUpOtp).then(result => {
        if(result){
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
  }else{
    this.signUpMessage = "Please type otp."
  }

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
