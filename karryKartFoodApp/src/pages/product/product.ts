import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	this.prod = this.navParams.get('data') ; 
	//console.log(this.prod);
	this.setUpImages(this.prod);
  }

  setUpImages(product)
  {
	  
	product.Images.forEach(function(record) {
		console.log(record);
		if (record.ImageLink != null) {
			//url=record.ImageLink;
			//url=url.replace("../..",apiUrl);
			record.ImageLink=record.ImageLink.replace("../..","http://test.karrykart.com");
			console.log(record.ImageLink);
		}else{
			record.ImageLink="assets/imgs/snacks.jpg";
			
		}
	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
  }

}
