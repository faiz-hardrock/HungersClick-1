import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,LoadingController } from 'ionic-angular';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { Storage } from '@ionic/storage';
import { RestProvider } from '../../providers/rest/rest';
/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  prod:any;
	cart:any;
	public loading = this.loadingCtrl.create({
    content: `
             Please wait...`
    
  });
	constructor(public navCtrl: NavController, public navParams: NavParams,private spinnerProvider:SpinnerProvider,
		private storage:Storage, private restProvider:RestProvider, private toastCtrl:ToastController,
		public loadingCtrl:LoadingController ) {
	this.prod = this.navParams.get('data') ; 
	//console.log(this.prod);
	this.setUpImages(this.prod);
  }
	
  
	presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Item added to cart',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
	
	setUpImages(product)
  {
	  
	product.Images.forEach(function(record) {
		console.log(record);
		if (record.ImageLink != null) {
			//url=record.ImageLink;
			//url=url.replace("../..",apiUrl);
			//record.ImageLink=record.ImageLink.replace("../..","http://test.karrykart.com");
			record.ImageLink=record.ImageLink.replace("../..","http://www.karrykart.com");
			console.log(record.ImageLink);
		}else{
			record.ImageLink="assets/imgs/snacks.jpg";
			
		}
	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
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

}
