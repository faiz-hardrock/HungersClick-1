import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup, Validators,ValidatorFn,AbstractControl } from '@angular/forms';
import { ValidatorProvider } from '../../providers/validator/validator';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { CheckoutPage } from '../checkout/checkout';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the AddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  
  IsAddEditAddress:boolean=false;
  IsSelectAddress:boolean=false;
  addAddress: FormGroup;
  email:string ='';
  firstName:string='';
  lastName:string ='';
  mobile:string ='';
  AddressLine1:string='';
  AddressLine2:string='';
  landmark:string='';
  pincode:string='';
  city:number=-1;
  country:number=-1;
  state:number=-1;
  userDetails = <any>{};
  isAdd:boolean=false;
  isEdit:boolean=false;
  addressID:number=-1;
  guestCheckout:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder, 
              private validationsProvider:ValidatorProvider, private authProvider: AuthenticationProvider,
              private spinnerProvider:SpinnerProvider,public storage: Storage ) {
    
    this.IsAddEditAddress=this.navParams.get('AddAddress');
    this.IsSelectAddress=!this.navParams.get('AddAddress');
    this.guestCheckout=this.navParams.get('GuestCheckout');
    
    if(!this.guestCheckout)
        this.checkUserLogin(-1);
    
    if(this.IsAddEditAddress)
        this.isAdd=true;

    this.addAddress = this.formBuilder.group({
       email: [this.userDetails.Email,Validators.compose([Validators.email,Validators.required])],
       firstName: [this.userDetails.FirstName!=null?this.userDetails.FirstName:'',Validators.compose([Validators.required])],
       lastName: [this.userDetails.LastName!=null?this.userDetails.LastName:'',Validators.compose([Validators.required])],
       mobile: ['',Validators.compose([Validators.required,Validators.minLength(10)])],
       AddressLine1: ['',Validators.compose([Validators.required])],
       AddressLine2: ['',Validators.compose([Validators.required])],
       landmark: ['',Validators.compose([Validators.required])],
       pincode: ['',Validators.compose([Validators.required])],
       city: [-1,Validators.compose([Validators.required])],
       state: [-1,Validators.compose([Validators.required])],
       country: [-1,Validators.compose([Validators.required])]

    });

  }

  checkUserLogin(addressID)
  {
    this.spinnerProvider.LoadSpinner();
    if(!this.guestCheckout){
    this.storage.get('user').then((result)=>{
      if(result!=null){
       
        this.authProvider.getUserDetails(result.UserID,addressID,this.guestCheckout).then(res=>{
        if(res!=null){
          this.userDetails = res;
        }

        this.firstName = this.userDetails.FirstName;
        this.lastName=this.userDetails.LastName;
        this.email=this.userDetails.Email;
        this.mobile=this.userDetails.Phone;

        
        this.spinnerProvider.DestroySpinner();
        });
      }
    });
  }
  else
  {
    this.storage.get('guestuser').then((result)=>{
      if(result!=null){
       
        this.authProvider.getUserDetails(result.UserID,addressID,this.guestCheckout).then(res=>{
        if(res!=null){
          this.userDetails = res;
        }

        this.firstName = this.userDetails.FirstName;
        this.lastName=this.userDetails.LastName;
        this.email=this.userDetails.Email;
        this.mobile=this.userDetails.Phone;

        
        this.spinnerProvider.DestroySpinner();
        });
      }
    });
  }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressPage');
   }

  addUserAddress(){
    var user={
      'FirstName':this.firstName,
      'LastName':this.lastName,
      'UserID':this.userDetails.UserID,
      'Phone':this.mobile,
      'Email':this.email,
      'AddressLine1':this.AddressLine1,
      'AddressLine2':this.AddressLine2,
      'LandMark':this.landmark,
      'Pincode':this.pincode,
      'CityID':this.city,
      'StateID':this.state,
      'CountryID':this.country,
      'GuestCheckout':this.guestCheckout
    }
    this.spinnerProvider.LoadSpinner();

    this.authProvider.addUserAddress(user).then(result=>{
      if(result!=null){
        this.userDetails = result;
        this.IsAddEditAddress=false;
        this.IsSelectAddress=true;
        this.isAdd=false;
        this.resetAddressFields();
        this.storage.set('guestuser', this.userDetails).then((data) =>{
        });
        this.spinnerProvider.DestroySpinner();
        
      }
    });
    
    
  }

  showAddress()
  {
    this.isEdit=false;
    this.IsAddEditAddress=true;
    this.IsSelectAddress=false;
    this.resetAddressFields();
    this.firstName=this.userDetails.FirstName;
    this.lastName=this.userDetails.LastName;
    this.email = this.userDetails.Email;
    this.mobile=this.userDetails.Phone;
    this.isAdd=true;
  }

  editAddress(userAddress)
  {
    this.isEdit=true;
    this.isAdd=false;
    this.IsAddEditAddress=true;
    this.IsSelectAddress=false;
    if(!this.guestCheckout)
      this.checkUserLogin(userAddress.AddressID); 
    else
      this.checkUserLogin(0);

    this.addressID=userAddress.AddressID;
    this.AddressLine1 = userAddress.AddressLine1;
    this.AddressLine2 = userAddress.AddressLine2;
    this.landmark = userAddress.LandMark;
    this.pincode= userAddress.PinCode;
    this.city= userAddress.CityID;
    this.state= userAddress.StateID;
    this.country= userAddress.CountryID;
  }



  resetAddressFields(){

    this.email='';
    this.firstName='';
    this.lastName='';
    this.mobile='';
    this.AddressLine1='';
    this.AddressLine2='';
    this.landmark='';
    this.pincode='';
  }
  hideAddress(){
    this.IsAddEditAddress=false;
    this.IsSelectAddress=true;
    this.resetAddressFields();

  }

  selectAddress(addressID){
    
    this.navCtrl.setRoot(CheckoutPage,{AddressID:addressID,GuestCheckout:this.guestCheckout,GuestAddressSelected:true});
    
  }

  removeAddress(userID,addressID){
    this.spinnerProvider.LoadSpinner();

    this.authProvider.removeUserAddress(userID, addressID).then(result=>{
      if(result!=null)
      {
        this.userDetails=result;
        
        if(this.userDetails.AddressList.length ==0){
          this.navCtrl.setRoot(CheckoutPage);
        }
      }
      this.spinnerProvider.DestroySpinner();
    });
  }

  editUserAddress(){
    var user={
      'FirstName':this.firstName,
      'LastName':this.lastName,
      'UserID':this.userDetails.UserID,
      'Phone':this.mobile,
      'Email':this.email,
      'AddressID':this.addressID,
      'AddressLine1':this.AddressLine1,
      'AddressLine2':this.AddressLine2,
      'LandMark':this.landmark,
      'Pincode':this.pincode,
      'CityID':this.city,
      'StateID':this.state,
      'CountryID':this.country,
      'GuestCheckout':this.guestCheckout
    }
    this.spinnerProvider.LoadSpinner();

    this.authProvider.editUserAddress(user).then(r=>{
      if(r!=null){
        this.userDetails = r;
        this.IsAddEditAddress=false;
        this.IsSelectAddress=true;
        this.isEdit=false;
        this.addressID= this.guestCheckout?0:-1;
        this.storage.remove('guestuser').then(d=>{
          this.storage.set('guestuser', this.userDetails).then((data) =>{
          });
        });
        
        this.resetAddressFields();
        this.spinnerProvider.DestroySpinner();
        
        
      }
    });
  }

}
