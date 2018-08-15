import { Component, ViewChild } from '@angular/core';
import { Nav,Platform,Events, NavController,MenuController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CartPage } from '../pages/cart/cart';
//import { UserPage } from '../pages/user/user';
import { FavouritesPage } from '../pages/favourites/favourites';
import { FoodmenuPage } from '../pages/foodmenu/foodmenu';
import { ProductPage } from '../pages/product/product';
import { LoginPage } from '../pages/login/login';
import { CheckoutPage } from '../pages/checkout/checkout';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { MyordersPage } from '../pages/myorders/myorders';
import { SpinnerProvider } from '../providers/spinner/spinner';
import { StoreProvider } from '../providers/store/store';

@Component({
  templateUrl: 'app.html',

})
export class MyApp {
  
  //@ViewChild(Menu) menu: Menu;
  @ViewChild('content') nav: NavController;
  rootPage:any = TabsPage; //HomePage
  
  userName: string = 'Welcome, Guest';
  isAuthUser:any;
  constructor(platform: Platform, public authProvider:AuthenticationProvider, statusBar: StatusBar, 
    splashScreen: SplashScreen,public storage:Storage, public events:Events, private spinnerProvider:SpinnerProvider,
    private storeProvider:StoreProvider, private menuCtrl:MenuController ) {
    
    this.checkLogin();
    //event that listens to the user login  
    events.subscribe('user:logged', (result) => {
    
      this.isAuthUser = true;
      this.userName=result.Name;
      
      });

      events.subscribe('user:signout', (logout) => {
        this.isAuthUser = !logout;
        this.userName='Welcome, Guest'
        
        });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    
  }
  
  openLoginPage()
  {
    this.nav.push(LoginPage);
    this.menuCtrl.close();
  }
  
  navigateToMyOrders()
  {
    this.nav.push(MyordersPage);
    this.menuCtrl.close();
  }
  
  signOut(){
    this.spinnerProvider.LoadSpinner();
    this.storage.get('user').then((result)=>{
      
     this.authProvider.logOut(result.UserID,result.Token).then((res)=>{
      
      this.storeProvider.removeStore('user');
      this.isAuthUser = false;
      
      this.userName= 'Welcome, Guest';
      this.events.publish('user:signout', true);
     this.spinnerProvider.DestroySpinner();
     this.menuCtrl.close();
     })
    
    });
  }
  checkLogin()
  {
    
    this.storage.get('user').then((result)=>{
      if(result!=null){
      this.authProvider.checkLogin(result).then(res=>{
        
        this.isAuthUser=true;
          
        this.userName = result.Name;
       
      })
     
    }
    });
  }

}

