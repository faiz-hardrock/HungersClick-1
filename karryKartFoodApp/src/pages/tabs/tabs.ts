import { Component } from '@angular/core';
import { NavController, Spinner } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { CartPage } from '../cart/cart';
//import { UserPage } from '../user/user';
import { TiffinPage } from '../tiffin/tiffin';
import { FoodmenuPage } from '../foodmenu/foodmenu';
import { RestProvider } from '../../providers/rest/rest';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { Storage } from '@ionic/storage';
import { HomeProvider } from '../../providers/home/home';
import { AlertProvider } from '../../providers/alert/alert';
@Component({
	  selector: 'page-tabs',
	templateUrl:'tabs.html'
})

export class TabsPage
{
tabCount: any = 0;	
tabHome = HomePage;
tabCart = CartPage;
//tabUser = UserPage;
tabTiffin = TiffinPage;
tabFoodmenu = FoodmenuPage;
userCart:any={};
  cartID:any;
	cart:any;
	tabsInfo:any;
  isCartEmpty:boolean=false;
constructor(public restProvider: RestProvider,private storage: Storage,public events: Events,
			public spinnerProvider:SpinnerProvider, private homeProvider:HomeProvider, private alertProvider:AlertProvider){
 //this.restProvider.removeCart();
 //this.getCartCount();
 //this.getPanels();
 events.subscribe('cart:udpated', (count) => {
	// user and time are the same arguments passed in `events.publish(user, time)`
	this.tabCount=count;
  });

  if(this.tabCount==0)
  {
	this.getCartCount();	
	}
	
	
}

getPanels()
  {
   

    this.homeProvider.getPanels().then((result)=> {

      if(result!=null)
      {
        this.tabsInfo=result;
       
      }else{
        this.alertProvider.presentAlert("Error Message","We are experiencing technical issues. Please try again.");
      }

    })

  }

getCartCount(){
	this.storage.get('cart').then((cart) => {
		if(cart!=null){
			this.tabCount=cart.ProductCount;	
		}else
		{
			this.tabCount=0;
		}
		
	});
  
 
}

getCartDetails(showLoader)
{
  console.log('Calling from tabs');
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



}