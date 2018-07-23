import {Component} from '@angular/core';
import { NavController,LoadingController,Events } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { CheckoutPage } from '../../pages/checkout/checkout';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  
  userCart:any={};
  cartID:any;
  cart:any;
  isCartEmpty:boolean=false;
  public loading = this.loadingCtrl.create({
    content: `
             Please wait...`
    
  });
  constructor(public navCtrl: NavController,public storage:Storage, public restProvider:RestProvider,
    public loadingCtrl:LoadingController,private spinnerProvider: SpinnerProvider, public event:Events) {
    this.getCartDetails(true);
   // this.storage.remove('cart');
  }

  getCartDetails(showLoader)
  {
    
    this.storage.get('cart').then((cart) => {
      if(cart!=null){
       if(showLoader)
        this.spinnerProvider.LoadSpinner();

    this.restProvider.getCart(cart.CartID)
    .then(data => {
      this.userCart = data;
      this.isCartEmpty=false;

      if(showLoader)
	      this.spinnerProvider.DestroySpinner();
    });
  }else{
    
    this.isCartEmpty=true;
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

  deleteCart(userCart,productID)
  {
    this.spinnerProvider.LoadSpinner();
    this.restProvider.deleteCart(userCart.CartID).then(result=>{
      if(result==null)
      {
        this.storage.remove('cart');
        this.isCartEmpty=true;  
        this.event.publish('cart:udpated',0);
      }else{
        this.isCartEmpty=false;
      }
    });

    this.spinnerProvider.DestroySpinner();
  }

  deleteProduct(userCart,product)
  {
    this.spinnerProvider.DestroySpinner();

    this.restProvider.deleteProduct(userCart.CartID,product.ProductID).then(result=>{
      console.log(result);
      if(result!=null)
      {
        this.restProvider.setCart(result);
        this.getCartDetails(false);
      }else{
        this.storage.remove('cart');
        this.event.publish('cart:udpated',0);
        this.isCartEmpty=true;
      }
    });
  }

  goToHome(){

    this.navCtrl.setRoot(HomePage);
  }
  
}
