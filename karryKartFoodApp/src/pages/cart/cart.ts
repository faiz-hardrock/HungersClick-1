import {Component} from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { CheckoutPage } from '../../pages/checkout/checkout';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  
  userCart:any={};
  cartID:any;
  public loading = this.loadingCtrl.create({
    content: `
             Please wait...`
    
  });
  constructor(public navCtrl: NavController,public storage:Storage, public restProvider:RestProvider,public loadingCtrl:LoadingController) {
      this.getCartDetails();
  }

  getCartDetails()
  {
    this.loading.present();
    this.storage.get('cart').then((cart) => {
    this.restProvider.getCart(cart.CartID)
    .then(data => {
      this.userCart = data;
     
	  this.loading.dismiss();
    });
  });
  console.log(this.userCart);
  }

  goToCheckout(cart)
  {
    console.log("Go to checkout");
    this.navCtrl.push(CheckoutPage,{data:cart.cartID});
  }
  
}
