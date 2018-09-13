import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { OrderProvider } from '../../providers/order/order';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { AlertProvider } from '../../providers/alert/alert';
/**
 * Generated class for the MyordersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myorders',
  templateUrl: 'myorders.html',
})
export class MyordersPage {
  userOrders :any;
  statusColor:string='primary';
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, private orderProvider:OrderProvider,
              private spinnerProvider:SpinnerProvider, private alertProvider:AlertProvider) {
                this.getMyOrders();
  }

  getMyOrders()
  {
    this.spinnerProvider.LoadSpinner();
    this.storage.get('user').then((result)=>{
      this.orderProvider.getUserOrders(result.UserID).then(res=>{
        if(res!=null){
          this.userOrders=res;
          this.spinnerProvider.DestroySpinner();
        }
        else{
          this.alertProvider.presentAlert('Your orders',"Sorry, no orders exist for you.");
          this.spinnerProvider.DestroySpinner();
        }
      })
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyordersPage');
  }

}
