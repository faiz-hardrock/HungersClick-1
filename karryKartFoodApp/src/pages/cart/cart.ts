import {Component} from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { CheckoutPage } from '../../pages/checkout/checkout';
import { SpinnerProvider } from '../../providers/spinner/spinner';
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  
  userCart:any={};
  cartID:any;
  cart:any;
  public loading = this.loadingCtrl.create({
    content: `
             Please wait...`
    
  });
  constructor(public navCtrl: NavController,public storage:Storage, public restProvider:RestProvider,
    public loadingCtrl:LoadingController,private spinnerProvider: SpinnerProvider) {
      this.getCartDetails(true);
  //  this.storage.remove('cart');
  }

  getCartDetails(showLoader)
  {
    
    this.storage.get('cart').then((cart) => {
      if(cart!=null){
       if(showLoader)
        this.spinnerProvider.LoadSpinner();

    this.restProvider.getCart(cart.CartID)
    .then(data => {
      
     // console.log(data);
      this.userCart = data;
      
      if(showLoader)
	      this.spinnerProvider.DestroySpinner();
    });
  }
  });
  
  }

  goToCheckout(cart)
  {
    console.log("Go to checkout");
    this.navCtrl.push(CheckoutPage,{data:cart.cartID});
  }

  updateProductQuantity(product,userCart,isIncrement){
    
    if(product.QuantitySelected>1 || isIncrement){
    this.cart={
      "ProductID":product.ProductID,
      "CreateCart": false,
      "Quantity":isIncrement?(++product.QuantitySelected):(--product.QuantitySelected),
      "CartID":userCart.CartID,
      "IsQuantityUpdate":true
      };
    
    
    
    this.restProvider.updateCart(this.cart).then(result =>{
      this.restProvider.setCart(result);
      this.getCartDetails(false);
    })
  }
  }
  
}
