import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup, Validators,ValidatorFn,AbstractControl } from '@angular/forms';
import { ValidatorProvider } from '../../providers/validator/validator';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { CheckoutPage } from '../checkout/checkout';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder, 
              private validationsProvider:ValidatorProvider, private authProvider: AuthenticationProvider,
              private spinnerProvoder:SpinnerProvider ) {
    console.log(this.navParams.get('AddAddress'));
    this.IsAddEditAddress=this.navParams.get('AddAddress');
    this.IsSelectAddress=!this.navParams.get('AddAddress');
    this.userDetails=this.navParams.get('UserDetails');

   
    this.firstName = this.userDetails.FirstName;
    this.lastName=this.userDetails.LastName;
    this.email=this.userDetails.Email;
          
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
      'CountryID':this.country
    }
    this.spinnerProvoder.LoadSpinner();

    this.authProvider.addUserAddress(user).then(result=>{
      if(result!=null){
        this.userDetails = result;
        this.IsAddEditAddress=false;
        this.IsSelectAddress=true;
        this.spinnerProvoder.DestroySpinner();
      }
    });
    
    
  }

  showAddress()
  {
    this.IsAddEditAddress=true;
    this.IsSelectAddress=false;
    this.resetAddressFields();
    this.firstName=this.userDetails.FirstName;
    this.lastName=this.userDetails.LastName;
    this.email = this.userDetails.Email;
    this.mobile=this.userDetails.Phone;
  }
  resetAddressFields(){

    this.email='';
    this.firstName='';
    this.lastName='';
    this. mobile='';
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
    this.navCtrl.pop({AddressID:addressID});
  }

}
