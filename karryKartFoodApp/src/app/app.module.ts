import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CallNumber } from '@ionic-native/call-number';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CartPage } from '../pages/cart/cart';
import { TiffinPage } from '../pages/tiffin/tiffin';
import { FavouritesPage } from '../pages/favourites/favourites';
import { FoodmenuPage } from '../pages/foodmenu/foodmenu';
import { RestProvider } from '../providers/rest/rest';
import { ProductPage } from '../pages/product/product';
import { LoginPage } from '../pages/login/login';
import { CheckoutPage } from '../pages/checkout/checkout';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { ConfigurationProvider } from '../providers/configuration/configuration';
import { StoreProvider } from '../providers/store/store';
import { MenuHeaderComponent } from '../components/menu-header/menu-header';
import {MainHeaderComponent} from '../components/main-header/main-header';
import { SpinnerProvider } from '../providers/spinner/spinner';
import { AlertProvider } from '../providers/alert/alert';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { ValidatorProvider } from '../providers/validator/validator';
import { MessagesProvider } from '../providers/messages/messages';
import { AddressPage } from '../pages/address/address';
import { MyordersPage } from '../pages/myorders/myorders';
import { OrderProvider } from '../providers/order/order';
import { SearchProvider } from '../providers/search/search';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HomeProvider } from '../providers/home/home';
import { CategoryproductsPage } from '../pages/categoryproducts/categoryproducts';
import { OfferproductsPage } from '../pages/offerproducts/offerproducts';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
	TabsPage,
	CartPage,
	FoodmenuPage,
	FavouritesPage,
	TiffinPage,
	ProductPage,
  LoginPage,
  CheckoutPage,
  ForgotpasswordPage,
  AddressPage,
  MyordersPage,
  MenuHeaderComponent,
  MainHeaderComponent,
  CategoryproductsPage,
  OfferproductsPage
  ],
  imports: [
    BrowserModule,
	  HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    CartPage,
    FoodmenuPage,
    FavouritesPage,
    TiffinPage,
    ProductPage,
    LoginPage,
    CheckoutPage,
    ForgotpasswordPage,
    AddressPage,
    MyordersPage,
    MenuHeaderComponent,
    MainHeaderComponent,
    CategoryproductsPage,
    OfferproductsPage
    
  ],
  providers: [  
    StatusBar,
    SplashScreen,
    IonicStorageModule,
	  CallNumber,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    AuthenticationProvider,
    ConfigurationProvider,
    StoreProvider,
    SpinnerProvider,
    AlertProvider,
    ValidatorProvider,
    MessagesProvider,
    OrderProvider,
    AlertProvider,
    SearchProvider,
    InAppBrowser,
    HomeProvider
  ]
})
export class AppModule {}
