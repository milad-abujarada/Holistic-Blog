import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'

@Component({
  selector: 'app-product-all',
  templateUrl: './product-all.component.html',
  styleUrls: ['./product-all.component.scss']
})
export class ProductAllComponent implements OnInit {

  allProducts = []

  constructor(
    private productService : ProductService
  ) { }

  ngOnInit() {

    this.productService.getAllProducts()
      .subscribe (response => {
        console.log(response);
        console.log("retrieved all products")
          this.allProducts = response.json();

      })

  }

  // This function will check availability of the Product before adding to the cart
  addToCart(productID, i, productName){
    let qty = Number((<HTMLInputElement>document.getElementById(`card-${i}`)).value);
    
    // console.log(`You are trying to buy ${qty} items`)
    // console.log('product ID: ', productID);

    if(!qty){
      qty = 1;
    }


    this.productService.addToCart(productID, qty)
      .subscribe( response => {
        console.log(response.json());
        let availableQty = response.json().quantity;
        console.log(availableQty);

        if(qty > availableQty){
          alert(`Sorry, there are only ${availableQty} items left in our inventory.`);
        } else {
          let newCartItem = {
            'productName': productName,
            'productID': productID,
            'quantity': qty  
          }
      
          let currentItems = JSON.parse(localStorage.getItem('shoppingCart'));
      
          console.log(currentItems);
      
          if(currentItems == null){
            currentItems = [];
          } 
      
          currentItems.push(newCartItem);
      
          localStorage.setItem('shoppingCart', JSON.stringify(currentItems));

          console.log('Successfully added to cart');
        }

        
      })
  }

}
