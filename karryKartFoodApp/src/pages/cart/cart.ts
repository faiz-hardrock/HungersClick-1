import {Component} from '@angular/core';
import { NavController,LoadingController,Events,ActionSheetController  } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { CheckoutPage } from '../../pages/checkout/checkout';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
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
    public loadingCtrl:LoadingController,private spinnerProvider: SpinnerProvider, public event:Events,
    private actionSheetCtrl:ActionSheetController) {
    this.getCartDetails(true);
   // this.storage.remove('cart');
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Please choose',
      buttons: [
        {
          text: 'Sign In',
          icon:'log-in',
          role: 'signin',
          cssClass:'actionButtons',
          handler: () => {
            this.navCtrl.push(LoginPage,{fromCart:true});
          }
        },{
          text: 'Continue as Guest',
          icon:'person',
          cssClass:'actionButtons',
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon:'close-circle',
          cssClass:'actionButtons',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ],
      cssClass:'actionPanel'
    });
    
    actionSheet.present();
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
    this.storage.get('user').then((result)=>{
      if(result!=null){
      //this.authProvider.checkLogin(result).then(res=>{
      //})
      this.navCtrl.push(CheckoutPage,{data:cart.cartID});
    }
    else
    {
      this.presentActionSheet();
    }
    });
    
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
