import { Component } from '@angular/core';
import { NavController, AlertController,Events } from 'ionic-angular';
//import { AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { FavouritesPage } from '../favourites/favourites';
import { LoginPage } from '../login/login';
import { StoreProvider } from '../../providers/store/store';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { ProductPage } from '../product/product';
import { HomeProvider } from '../../providers/home/home';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { AlertProvider } from '../../providers/alert/alert';
import { CategoryproductsPage } from '../categoryproducts/categoryproducts';
import { OfferproductsPage } from '../offerproducts/offerproducts';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
isAuthUser:any=false;
userName:any=null;
showSearchResult:boolean=false;
searchResults:any=null;
panels:any=null;
  constructor(public navCtrl: NavController,private callNumber: CallNumber,private alertCtrl: AlertController, public storeProvider:StoreProvider,public storage:Storage
   , public authenticationProvider:AuthenticationProvider, menuCtrl:MenuController, public events:Events,
   private searchProvider:SearchProvider, private homeProvider:HomeProvider, private spinnerProvider:SpinnerProvider,
    private alertProvider:AlertProvider) {
    //this.storeProvider.removeStore('user');
    this.getPanels();
    this.checkLogin();
    events.subscribe('user:logged', (result) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.isAuthUser = true;
      this.setUserName(result);
      
      });
    
    events.subscribe('user:signout', (logout) => {
      this.isAuthUser = !logout;
      this.userName='User';
      });  
  }

  
  checkLogin()
  {
    
    this.storage.get('user').then((result)=>{
      
        if(result!=null){
          this.isAuthUser=true;
         this.setUserName(result);
      }
    });
  
}

private setUserName(result){
  if(result.Name.length>10)
  {
  this.userName = result.Name.substring(0,4)+"..";
  }else{
   this.userName = result.Name;
  }

}
  openFavouritesPage(){
	  this.navCtrl.push(FavouritesPage);
	  
  }
  
  openLoginPage(){
	  this.navCtrl.push(LoginPage);
	  
  }

  openCategoryProducts(ID,name)
  {
    //console.log(ID);
    this.navCtrl.push(CategoryproductsPage, {categoryID:ID,Name:name});
  }

  openOfferProducts(ID)
  {
    this.navCtrl.push(OfferproductsPage, {itemID:ID});
  }
  
  callHungerClick() {
  let alert = this.alertCtrl.create({
    title: 'Call Us',
    message: 'Do you want to place order on call?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
         
        }
      },
      {
        text: 'Yes',
        handler: () => {
          this.callNumber.callNumber("+918860795399", true)
        }
      }
    ]
  });
  alert.present();
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

openProductPage(product){
  this.navCtrl.push(ProductPage,{data:product});
  
}

onCancel(ev: any)
  {
    this.searchResults=null;
    this.showSearchResult=false;

  }

  getPanels()
  {
    this.spinnerProvider.LoadSpinner();

    this.homeProvider.getPanels().then((result)=> {

      if(result!=null)
      {
        this.panels=result;
        this.spinnerProvider.DestroySpinner();
        console.log(this.panels);
      }else{
        this.spinnerProvider.DestroySpinner();
        this.alertProvider.presentAlert("Error Message","We are experiencing technical issues. Please try again.");
      }

    })

  }

}
