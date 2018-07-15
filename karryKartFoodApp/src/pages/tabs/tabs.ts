import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { CartPage } from '../cart/cart';
//import { UserPage } from '../user/user';
import { TiffinPage } from '../tiffin/tiffin';
import { FoodmenuPage } from '../foodmenu/foodmenu';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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

constructor(public restProvider: RestProvider,private storage: Storage,public events: Events){
 //this.restProvider.removeCart();
 //this.getCartCount();
 events.subscribe('cart:udpated', (count) => {
	// user and time are the same arguments passed in `events.publish(user, time)`
	this.tabCount=count;
  });

  if(this.tabCount==0)
  {
	this.getCartCount();	
  }
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



}