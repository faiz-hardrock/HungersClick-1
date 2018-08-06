import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../../pages/tabs/tabs';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AddressPage } from '../address/address';
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
  constructor(public navCtrl: NavController,public storage: Storage, public toastCtrl: ToastController,
    public restProvider:RestProvider, public navParams: NavParams, private authProvider:AuthenticationProvider) {
    this.checkUserLogin();
  }

  checkUserLogin()
  {
    this.storage.get('user').then((result)=>{
      if(result!=null){
        this.isLogin=true;
        this.authProvider.getUserDetails(result.UserID).then(res=>{
        if(res!=null){
          this.userDetails = res;
        }
        console.log(this.userDetails);
        if(this.userDetails.AddressList.length > 0)
        {
          this.isDetailsExist =true;
        }
        console.log(this.isDetailsExist);
        });
      }
    });
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
    this.navCtrl.push(AddressPage,{AddAddress:addAddress,UserDetails:this.userDetails}); 
  }

  placeOrder()
  {
    this.storage.get('cart').then((cart) => {
    var data = {
      "CartID":cart.CartID,
      "Email":this.email,
      "Name":this.name,
      "Contact":this.contact
    };
    this.restProvider.placeOrder(data).then((result) => {
     
        this.restProvider.removeCart();
     
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