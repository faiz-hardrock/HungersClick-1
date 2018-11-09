import { Component } from '@angular/core';
import { NavController,LoadingController,ToastController,Events,IonicPage,NavParams } from 'ionic-angular';
import { FavouritesPage } from '../favourites/favourites';
import { RestProvider } from '../../providers/rest/rest';
import { ProductPage } from '../product/product';
import { Storage } from '@ionic/storage';
import { SearchProvider } from '../../providers/search/search';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HomePage } from '../home/home';
/**
 * Generated class for the CategoryproductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categoryproducts',
  templateUrl: 'categoryproducts.html',
})
export class CategoryproductsPage {
  products: any;
  cart:any;
  private count: number = 0;
  showSearchResult:boolean=false;
  searchResults:any=null;
  categoryID:number=-1;
  categoryName:string='';
  productsAvailable:boolean=true;
  constructor(public navParams: NavParams,public navCtrl: NavController,public restProvider: RestProvider, public loadingCtrl:LoadingController,
    public toastCtrl: ToastController,public storage: Storage,public events: Events, private searchProvider:SearchProvider,
    private spinnerProvider:SpinnerProvider) {
    this.categoryID = this.navParams.get('categoryID') ; 
    this.categoryName=this.navParams.get('Name') ; 
    this.getProducts(this.categoryID);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryproductsPage');
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
  
  getProducts(ID) {
	  this.spinnerProvider.LoadSpinner();
    this.restProvider.getProductsByCategory(ID)
    .then(data => {
      this.products = data;
      
      if(this.products==null)
        this.productsAvailable=false;
      else if(this.products.length > 0 )
        this.productsAvailable=true;
      else
        this.productsAvailable=false;
      
     // console.log(this.products);
	  this.spinnerProvider.DestroySpinner();
    });
  }
  
  addToCart(productID)
  { 
    this.spinnerProvider.LoadSpinner();
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
           this.spinnerProvider.DestroySpinner();
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
             this.spinnerProvider.DestroySpinner();
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

  goToHome(){

    this.navCtrl.setRoot(HomePage);
  }
  

}
