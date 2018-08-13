import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../../pages/tabs/tabs';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AddressPage } from '../address/address';
import { SpinnerProvider } from '../../providers/spinner/spinner';
/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
 cartID:any;
 email:any;
 contact:any;
 name:any;
 isLogin:boolean=false;
 userDetails = <any>{};
 isDetailsExist:boolean=false; 
 selectedAddressID:number=-1;
 isAddressSelected:boolean=false;
 cod:boolean=false;
 guestCheckout:boolean=false;
  constructor(public navCtrl: NavController,public storage: Storage, public toastCtrl: ToastController,
    public restProvider:RestProvider, public navParams: NavParams, private authProvider:AuthenticationProvider,
    private spinnerProvider:SpinnerProvider) {
   
     
     // this.storage.remove('guestuser');
       
      // console.log(this.navParams.get("GuestCheckout"))
       if(this.navParams.get("GuestCheckout")!=null){
        this.guestCheckout=this.navParams.get("GuestCheckout");
       if(this.guestCheckout){
        if(this.navParams.get("GuestAddressSelected")==true)
        {
        this.checkUserLogin(0);
        }
      }
       }

      if(this.navParams.get("AddressID")!=null){
        this.selectedAddressID=this.navParams.get("AddressID");
        if(this.selectedAddressID!=0)
        this.checkUserLogin(this.selectedAddressID);
      }
      else{
        if(!this.guestCheckout)
           this.checkUserLogin(-1);
      
           console.log(this.isDetailsExist);
  }
  
  }

  checkUserLogin(addressID)
  {
    
    this.spinnerProvider.LoadSpinner();
    if(!this.guestCheckout){
    this.storage.get('user').then((result)=>{
      if(result!=null){
        this.isLogin=true;
        this.authProvider.getUserDetails(result.UserID,addressID,this.guestCheckout).then(res=>{
        if(res!=null){
          this.userDetails = res;
        }
  
        if(this.userDetails.AddressList.length > 0)
        {
          this.isDetailsExist =true;
          
          this.isAddressSelected=true;
          this.selectedAddressID=this.userDetails.AddressList[0].AddressID;
          this.spinnerProvider.DestroySpinner();
        }
  
        });
      }
    });
  }else{
    
    this.storage.get('guestuser').then((result)=>{
      if(result!=null){
        console.log(result);
        this.isLogin=true;
        this.authProvider.getUserDetails(result.UserID,addressID,this.guestCheckout).then(res=>{
        if(res!=null){
          this.userDetails = res;
        }
  
        if(this.userDetails.AddressList.length > 0)
        {
          this.isDetailsExist =true;
          console.log(this.isDetailsExist);
          this.isAddressSelected=true;
          this.selectedAddressID=this.userDetails.AddressList[0].AddressID;
          this.spinnerProvider.DestroySpinner();
        }
  
        });
      }
    });
  }
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Your order has been placed successfully. Please check your email for more details.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  navigateToAddress(addAddress){
    this.navCtrl.push(AddressPage,{AddAddress:addAddress,GuestCheckout:this.guestCheckout}); 
  }

  placeOrder()
  {
    this.spinnerProvider.LoadSpinner();
    this.storage.get('cart').then((cart) => {
    var data = {
      "CartID":cart.CartID,
      "UserID":this.userDetails.UserID,
      "AddressID":this.selectedAddressID,
      "GuestCheckout":this.guestCheckout,
      "PaymentType":this.cod?1:0
    };
    this.restProvider.placeOrder(data).then((result) => {
     
        this.restProvider.removeCart();
        
        this.storage.get('guestuser').then(g=>{
          if(g!=null){
          this.storage.remove('guestuser');
          }
        });
        this.spinnerProvider.DestroySpinner();
     this.presentToast();
     this.navigateToHome();
     }, (err) => {
       console.log(err);
     });
  }
);

}

navigateToHome()
{
  this.navCtrl.setRoot(TabsPage);
  this.navCtrl.popToRoot();
}
}