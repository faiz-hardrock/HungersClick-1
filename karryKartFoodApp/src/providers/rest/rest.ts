import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

//apiUrl = 'http://testapi.karrykart.com/api';

public apiUrl = 'http://localhost:13518/api';
cartID:any;

  constructor(public http: HttpClient,public storage: Storage, public events: Events) {
    console.log('Hello RestProvider Provider');
  }

  getProducts() {
  return new Promise(resolve => {
    this.http.get(this.apiUrl+'/product').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
}

  addToCart(data)
  {
	   return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl+'/cart', JSON.stringify(data),{ 
      headers: { 
         'Content-Type': 'application/json'
      }
   })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
  });
  }

  
  updateCart(data)
  {
    return new Promise((resolve, reject) => {
      this.http.put(this.apiUrl+'/cart', JSON.stringify(data),{ 
        headers: { 
           'Content-Type': 'application/json'
        }
     })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });

  }

  deleteCart(cartID)
  {
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl+'/cart?CartID='+cartID+'&ProductID='+'559B9891-FE58-49DD-A357-B7ADC2CC339A')
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  deleteProduct(cartID,productID){
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl+'/cart?CartID='+cartID+'&ProductID='+productID)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });

  }

  setCart(result)
  {
      
    this.storage.set('cart', result).then((data) =>{
      this.updateCartBadge();

    });
    
  }

  removeCart()
  {
    this.storage.remove('cart').then((cart)=>{
      this.events.publish('cart:udpated', 0);
    });
  }

  getCart(CartID)
  {
    
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/cart?CartID='+CartID).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });

  }
  
  updateCartBadge()
{
  this.storage.get('cart').then((cart) => {
		this.events.publish('cart:udpated', cart.ProductCount);
		});
  //console.log('Cart badge Updated!')
 
}

getCartID(){
  this.storage.get('cart').then((cart) => {
    this.cartID = cart.CartID;

  });

}

placeOrder(data)
{
   return new Promise((resolve, reject) => {
  this.http.post(this.apiUrl+'/order', JSON.stringify(data),{ 
    headers: { 
       'Content-Type': 'application/json'
    }
 })
    .subscribe(res => {
      resolve(res);
    }, (err) => {
      reject(err);
    });
});
}
  
}
