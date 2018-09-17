import {Component} from '@angular/core';
import { NavController,LoadingController,ToastController,Events } from 'ionic-angular';
import { FavouritesPage } from '../favourites/favourites';
import { RestProvider } from '../../providers/rest/rest';
import { ProductPage } from '../product/product';
import { Storage } from '@ionic/storage';
import { SearchProvider } from '../../providers/search/search';


@Component({
  selector: 'page-foodmenu',
  templateUrl: 'foodmenu.html'
})
export class FoodmenuPage {
  products: any;
  cart:any;
  private count: number = 0;
  showSearchResult:boolean=false;
  searchResults:any=null;
  public loading = this.loadingCtrl.create({
    content: `
             Please wait...`
    
  });
  
  constructor(public navCtrl: NavController,public restProvider: RestProvider, public loadingCtrl:LoadingController,
  public toastCtrl: ToastController,public storage: Storage,public events: Events, private searchProvider:SearchProvider) {
	// this.presentLoadingCustom();
 this.getProducts();
  }
  openFavouritesPage(){
	  this.navCtrl.push(FavouritesPage);
	  
  }
  openProductPage(product){
	  this.navCtrl.push(ProductPage,{data:product});
	  
  }
  
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Item added to cart',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  
  getProducts() {
	   this.loading.present();
    this.restProvider.getProducts()
    .then(data => {
      this.products = data;
      console.log(this.products);
	  this.loading.dismiss();
    });
  }
  
  presentLoadingCustom() {
  

  // loading.onDidDismiss(() => {
    // console.log('Dismissed loading');
  // });
  
}

addToCart(productID)
{ 
  var cartID:any;
  this.storage.get('cart').then((cart) => {
    
		if(cart!=null)
		{
      cartID = cart.CartID;
      this.storage.get('user').then((usr)=> {
      if(usr!=null){  
      this.cart={
        "ProductID":productID,
        "CreateCart": false,
        "Quantity":1,
        "ProductCount":1,
        "CartID":cartID,
        "User":usr.UserID
        };
      }else{
        this.cart={
          "ProductID":productID,
          "CreateCart": false,
          "Quantity":1,
          "ProductCount":1,
          "CartID":cartID
          };
      }
        this.restProvider.updateCart(this.cart).then((result) => {
         this.restProvider.setCart(result);
        this.presentToast();
        
        }, (err) => {
          console.log(err);
        });
      });
    }
    else
    {
      this.storage.get('user').then((usr)=>{
        if(usr!=null)
        {
        this.cart={
          "ProductID":productID,
          "CreateCart": true,
          "Quantity":1,
          "ProductCount":1,
          "User":usr.UserID
          };
        }else{
          this.cart={
            "ProductID":productID,
            "CreateCart": true,
            "Quantity":1,
            "ProductCount":1
            };
        }
           
          this.restProvider.addToCart(this.cart).then((result) => {
           this.restProvider.setCart(result);
          this.presentToast();
          
          }, (err) => {
            console.log(err);
          });
      });
     
		}
	  });

    
}

searchItems(ev: any){
  var key = ev.target.value;
if(key.length>2){
  this.searchProvider.searchItems(key).then(result=>{
    //this.searchResults=null;
    if(result!=null)
    {
      this.searchResults = result;
      this.showSearchResult=true;
    }
  })
}else{
  this.showSearchResult=false;
}

}

}
