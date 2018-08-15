import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Nav,NavController,Events } from 'ionic-angular';

import { LoginPage } from '../../pages/login/login';
import {ViewChild} from '@angular/core';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { StoreProvider } from '../../providers/store/store';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { MyordersPage } from '../../pages/myorders/myorders';
/**
 * Generated class for the MenuHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu-header',
  templateUrl: 'menu-header.html'
})
export class MenuHeaderComponent {
  
  nav: NavController;

  userName: string = "Welcome, Guest";
  isAuthUser:any;
  constructor(public storage:Storage, public authProvider:AuthenticationProvider, 
    public storeProvider:StoreProvider, public spinnerProvider:SpinnerProvider,public events: Events//,
  //  private navCtrl:NavController
    ) {
   
   this.checkLogin();
   //event that listens to the user login
   events.subscribe('user:logged', (result) => {
    this.isAuthUser = true;
    this.userName=result.Name;
    
    });
  }
  openLoginPage(){
	
	  
  }
  GotoLogin()
  {

  }
  
  navigateToMyOrders()
  {
    this.nav.setRoot(MyordersPage);
  }

  checkLogin()
  {
    
    this.storage.get('user').then((result)=>{
      if(result!=null){
      this.userName=result.Name;
      this.isAuthUser=true;
      }
      });
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
     })
    
    });
  }
}
