import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = false;

    for(let page of thisApp.pages) {
      if(page.id == idFromHash) {
        pageMatchingHash = true;
        //pageMatchingHash = idFromHash;
        break;
      }
      /* else {
        pageMatchingHash = thisApp.pages[0].id;
      } */
    }

    //thisApp.activePage(pageMatchingHash);

    if(pageMatchingHash) {
      thisApp.activatePage(idFromHash);
    } else {
      thisApp.activatePage(thisApp.pages[0].id);
    }

    for(let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();
        
        const pageId = clickedElement.getAttribute('href').replace('#', '');
        
        //const pageId = href.replace('#', '');
        //console.log(pageId);
        
        thisApp.activatePage(pageId);

        /* change URL hash */
      
        window.location.hash = `#/${pageId}`;
      });
    }
  },
  activatePage: function(pageId) {
    const thisApp = this;
    
    /* add class 'active' to matching pages, remove from non-matching */
  
    /* add class 'active' to matching link, remove from non-matching */

    for(let page of thisApp.pages) {
      /* if(page.id == pageId) {
        page.classList.add(classNames.pages.active);
      } else {
        page.classList.remove(classNames.pages.active);
      } */
      page.classList.toggle(classNames.pages.active, page.id == pageId);  
    }
    for(let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == `#${pageId}`
      );
    }
  },
  initMenu: function() {
    const thisApp = this;
    for(let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function() {
    const thisApp = this;

    thisApp.data = {};
    const url = `${settings.db.url}/${settings.db.product}`;
      
    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        console.log('parsedResponse:', parsedResponse);

        thisApp.data.products = parsedResponse;

        app.initMenu();
      });
    //console.log('thisApp.data', JSON.stringify(thisApp.data)); 
  },
  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event) {
      app.cart.add(event.detail.product);
    });
  },
  initBooking: function() {
    const thisApp = this;
    const bookingElem = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(bookingElem);
  },
  init: function(){
    const thisApp = this;
    /*console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);*/
    
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  }
};

app.init();