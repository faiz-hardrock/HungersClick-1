import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../../pages/tabs/tabs';
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
  constructor(public navCtrl: NavController,public storage: Storage, public toastCtrl: ToastController,public restProvider:RestProvider, public navParams: NavParams) {
    
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