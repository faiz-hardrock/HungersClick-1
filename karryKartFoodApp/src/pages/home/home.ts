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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
isAuthUser:any=false;
userName:any=null;
showSearchResult:boolean=false;
searchResults:any=null;
  constructor(public navCtrl: NavController,private callNumber: CallNumber,private alertCtrl: AlertController, public storeProvider:StoreProvider,public storage:Storage
   , public authenticationProvider:AuthenticationProvider, menuCtrl:MenuController, public events:Events,
   private searchProvider:SearchProvider
  ) {
    //this.storeProvider.removeStore('user');
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
}
