import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../../pages/tabs/tabs';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { AddressPage } from '../address/address';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { InAppBrowser , InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { ConfigurationProvider } from '../../providers/configuration/configuration';
import { OrderProvider } from '../../providers/order/order';
/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
 cartID:any;
 email:any;
 contact:any;
 name:any;
 isLogin:boolean=false;
 userDetails = <any>{};
 paymentRedirecResponse= <any>{};
 isDetailsExist:boolean=false; 
 selectedAddressID:number=-1;
 isAddressSelected:boolean=false;
 cod:boolean=false;
 guestCheckout:boolean=false;
 online:boolean=false;
 payString:string='';
 options : InAppBrowserOptions = {
  location : 'yes',//Or 'no' 
  hidden : 'no', //Or  'yes'
  clearcache : 'yes',
  clearsessioncache : 'yes',
  zoom : 'yes',//Android only ,shows browser zoom controls 
  hardwareback : 'yes',
  mediaPlaybackRequiresUserAction : 'no',
  shouldPauseOnSuspend : 'no', //Android only 
  closebuttoncaption : 'Close', //iOS only
  disallowoverscroll : 'no', //iOS only 
  toolbar : 'yes', //iOS only 
  enableViewportScale : 'no', //iOS only 
  allowInlineMediaPlayback : 'no',//iOS only 
  presentationstyle : 'pagesheet',//iOS only 
  fullscreen : 'yes',//Windows only    
};

  constructor(public navCtrl: NavController,public storage: Storage, public toastCtrl: ToastController,
    public restProvider:RestProvider, public navParams: NavParams, private authProvider:AuthenticationProvider,
    private spinnerProvider:SpinnerProvider,private theInAppBrowser: InAppBrowser, private configurationProvider:ConfigurationProvider,
    private orderProvider:OrderProvider) {
   
     
     // this.storage.remove('guestuser');
       
      // console.log(this.navParams.get("GuestCheckout"))
       if(this.navParams.get("GuestCheckout")!=null){
        this.guestCheckout=this.navParams.get("GuestCheckout");
       if(this.guestCheckout){
        if(this.navParams.get("GuestAddressSelected")==true)
        {
        this.checkUserLogin(0);
        }
      }
       }

      if(this.navParams.get("AddressID")!=null){
        this.selectedAddressID=this.navParams.get("AddressID");
        if(this.selectedAddressID!=0)
        this.checkUserLogin(this.selectedAddressID);
      }
      else{
        if(!this.guestCheckout)
           this.checkUserLogin(-1);
      
           console.log(this.isDetailsExist);
  }
  
  }

  checkUserLogin(addressID)
  {
    
    this.spinnerProvider.LoadSpinner();
    if(!this.guestCheckout){
    this.storage.get('user').then((result)=>{
      if(result!=null){
        this.isLogin=true;
        this.authProvider.getUserDetails(result.UserID,addressID,this.guestCheckout).then(res=>{
        if(res!=null){
          this.userDetails = res;
        }
        console.log(this.userDetails.AddressList);
        if(this.userDetails.AddressList.length > 0)
        {
          this.isDetailsExist =true;
          
          this.isAddressSelected=true;
          this.selectedAddressID=this.userDetails.AddressList[0].AddressID;
          this.spinnerProvider.DestroySpinner();
        }else{
          this.spinnerProvider.DestroySpinner();
        }
  
        });
      }
    });
  }else{
    
    this.storage.get('guestuser').then((result)=>{
      if(result!=null){
        console.log(result);
        this.isLogin=true;
        this.authProvider.getUserDetails(result.UserID,addressID,this.guestCheckout).then(res=>{
        if(res!=null){
          this.userDetails = res;
        }
  
        if(this.userDetails.AddressList.length > 0)
        {
          this.isDetailsExist =true;
          console.log(this.isDetailsExist);
          this.isAddressSelected=true;
          this.selectedAddressID=this.userDetails.AddressList[0].AddressID;
          this.spinnerProvider.DestroySpinner();
        }
  
        });
      }
    });
  }
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Your order has been placed successfully. Please check your email for more details.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  navigateToAddress(addAddress){
    this.navCtrl.push(AddressPage,{AddAddress:addAddress,GuestCheckout:this.guestCheckout}); 
  }

  placeOrder()
  {
    this.spinnerProvider.LoadSpinner();
    if(this.online)
    { 
      this.storage.get('cart').then((cart) => {
      var data = {
        "CartID":cart.CartID,
        "UserID":this.userDetails.UserID,
      };
    //  this.spinnerProvider.DestroySpinner();
      var browser = this.theInAppBrowser.create(this.configurationProvider.paymentURL+"?UserID="+this.userDetails.UserID+"&CartID="+cart.CartID+"&GuestCheckout="+this.guestCheckout+"&AddressID="+this.selectedAddressID, "_blank", this.options);
      
      browser.on('loadstart').subscribe(
        (payment_result) => {
          console.log(payment_result);
          if (payment_result.url === this.configurationProvider.successURL) {
          //  console.log('order id: ', orderResult.orderId);
         ///   this.utilityService.openPage(OrderDetail, { id: orderResult.orderId });
            browser.close();
            browser.on('exit').subscribe(() => {
              //Do whatever here
              this.orderProvider.getOrderByCartID(this.userDetails.UserID,cart.CartID).then((o)=>{
                  if(o!=null)
                  {
                    if(o[0].OrderStatusID==1)
                    {
                      this.restProvider.removeCart();
        
                      this.storage.get('guestuser').then(g=>{
                        if(g!=null){
                        this.storage.remove('guestuser');
                        }
                      });
                      this.spinnerProvider.DestroySpinner();
                      this.presentToast();
                      this.navigateToHome();
                    }else{
                      //order not placed successfully.
                     
                    }
                  }
              });
          });
          }
        }, (error) => {
          console.log(error);
        }
      );
      
      // browser.on("loadstart", (event) => {
      //   if ((event.url).indexOf("http://localhost/callback") === 0) {

      //     browser.removeEventListener("exit", (event) => {});
      //     browser.close();

      //     // do things with `event.url` here
      //   }
      // });
     // this.restProvider.makeOnlinePayment(data).then((r)=>{
      // if(r!=null)
      // {
      //   console.log(r);
      //   this.paymentRedirecResponse =r;
      // }
      //   var script = 'var form = document.createElement("form");';
      //   script += 'var url = "'+this.paymentRedirecResponse.URL+'";';
      //   script += 'form.method="post";';
      //   script += 'form.setAttribute("action",url);';
      //  for (var data in this.paymentRedirecResponse.options) {
      //    script += 'var hiddenField = document.createElement("input");';
      //    script += 'hiddenField.setAttribute("type", "hidden");';
      //    script += 'hiddenField.setAttribute("name","' + data +'");';
      //    script += 'hiddenField.setAttribute("value","' + this.paymentRedirecResponse.options[data] + '");';
      //    script += 'form.appendChild(hiddenField);';
      //  }
      //  let target = "_blank";
      // var ref=  this.theInAppBrowser.create(this.paymentRedirecResponse.URL,target,this.options);
      // script += 'form.submit();';
      // console.log(script);
      // // ref.on('loadstop', function(){
      // //   ref.executeScript({ code: script });
      // // });

      // ref.executeScript({code:script});

      // ref.on('loadstop').subscribe((event: InAppBrowserEvent) => {
      //     if (event.url === this.paymentRedirecResponse.surl) {
      //     //  this.paymentSuccess();
      //     } else if (event.url === this.paymentRedirecResponse.furl) {
      //     //  this.paymentFailure();
      //     }
      //   });

      //  this.openWithInAppBrowser(r.URL);
        // this.restProvider.redirectToPayment(r).then((p)=>{
        //   console.log(p);
        // });
    //     this.payString = '<html><body>'
    //   +'<form action="'+this.paymentRedirecResponse.URL+'" method="post" id="payu_form">'
    //   +'<input type="hidden" name="firstname" value="'+this.paymentRedirecResponse.options.firstname+'"/>'
    //   +'<input type="hidden" name="email" value="'+this.paymentRedirecResponse.options.email+'"/>'
    //   +'+<input type="hidden" name="phone" value="'+this.paymentRedirecResponse.options.phone+'"/>'
    //   +'<+input type="hidden" name="surl" value="'+this.paymentRedirecResponse.options.surl+'"/>'
    //   // +'<input type="hidden" name="curl" value="${this.paymentRedirecResponse.options.curl}"/>'
    //   +'<input type="hidden" name="furl" value="'+this.paymentRedirecResponse.options.furl+'"/>'
    //   +'<input type="hidden" name="key" value="'+this.paymentRedirecResponse.options.key+'"/>'
    //   +'<input type="hidden" name="hash" value="'+this.paymentRedirecResponse.options.hash+'"/>'
    //   +'<input type="hidden" name="txnid" value="'+this.paymentRedirecResponse.options.txnid+'"/>'
    //   +'<input type="hidden" name="productinfo" value="'+this.paymentRedirecResponse.options.productinfo+'"/>'
    //   +'<input type="hidden" name="amount" value="'+this.paymentRedirecResponse.options.amount+'"/>'
    //   +'<input type="hidden" name="service_provider" value="'+this.paymentRedirecResponse.options.service_provider+'"/>'
    //  //  +'<button type="submit" value="submit" #submitBtn></button>'
    //   +'</form>'
    //   +'<script type="text/javascript">document.getElementById("payu_form").submit();</script>'
    //   +'</body></html>';
    //   console.log(this.payString);
    //   this.payString= 'data:text/html;base64,' + btoa(this.payString);

    //   var browser = this.theInAppBrowser.create(this.payString, "_blank", this.options);

      // browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
      //   if (event.url === this.paymentRedirecResponse.surl) {
      //   //  this.paymentSuccess();
      //   } else if (event.url === this.paymentRedirecResponse.furl) {
      //   //  this.paymentFailure();
      //   }
      // });
     // })
     
      
    });
     
    }
    else
  {
   //  this.spinnerProvider.LoadSpinner();
    this.storage.get('cart').then((cart) => {
    var data = {
      "CartID":cart.CartID,
      "UserID":this.userDetails.UserID,
      "AddressID":this.selectedAddressID,
      "GuestCheckout":this.guestCheckout,
      "PaymentType":this.cod?1:this.online?2:0
    };
    this.restProvider.placeOrder(data).then((result) => {
     
        this.restProvider.removeCart();
        
        this.storage.get('guestuser').then(g=>{
          if(g!=null){
          this.storage.remove('guestuser');
          }
        });
        this.spinnerProvider.DestroySpinner();
     this.presentToast();
     this.navigateToHome();
     }, (err) => {
       console.log(err);
     });
  }
);
}
}

navigateToHome()
{
  this.navCtrl.setRoot(TabsPage);
  this.navCtrl.popToRoot();
}

public openWithInAppBrowser(url : string){
  let target = "_blank";
  this.theInAppBrowser.create(url,target,this.options);
}
}