/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
    }
    renderInMenu() {
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);

      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }
    getElements() {
      const thisProduct = this;

      thisProduct.accordingTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    }
    initAccordion() {
      const thisProduct = this;

      /* START: click event listener to trigger */
      thisProduct.accordingTrigger.addEventListener('click', function(event) {
        
        /* prevent default action for event */
        event.preventDefault();
        
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');
        
        /* find all active products */
        const productsActive = document.querySelectorAll('.product.active');
        
        /* START LOOP: for each active product */
        for(let productActive of productsActive) {
          /* START: if the active product isn't the element of thisProduct */
          if(productActive != thisProduct.element) {
            
            /* remove class active for the active product */
            productActive.classList.remove('active');
          }

          /* END: if the active product isn't the element of thisProduct */
        }

        /* END LOOP: for each active product */
      });
      /* END: click event listener to trigger */  
    }
    initOrderForm() {
      const thisProduct = this;
      thisProduct.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
      for(let input of thisProduct.formInputs) {
        input.addEventListener('change', function() {
          thisProduct.processOrder();
        })
      }
      thisProduct.cartButton.addEventListener('click', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
    }
    processOrder() {
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      const params = thisProduct.data.params;
      //console.log('formData:', formData);
      let price = thisProduct.data.price;
      
      for(let param in params) {
        //console.log('params', params);
        //console.log('param', param);
        //console.log('params[param]', params[param]);
        //console.log('params[param].options', params[param].options);
        const options = params[param].options;
        const formOptions = formData[param];
        //console.log('options', options);
        //console.log('formOptions', formOptions);
        for(let option in options) {
          const optionSelected = formData.hasOwnProperty(param) && formData[param].indexOf(option) > -1;
          if(optionSelected && !options[option].default) {
            //console.log(options[option].price);
            price += options[option].price
          } else if(!optionSelected && options[option].default) {
            price -= options[option].price;
          }
          if(optionSelected) {
            const thisImages = thisProduct.imageWrapper.querySelectorAll(`.${param}-${option}`);
            console.log(thisImages);
            for(let thisImage of thisImages) {
              thisImage.classList.add(classNames.menuProduct.imageVisible);
            }
          } else {
            const thisImages = thisProduct.imageWrapper.querySelectorAll(`.${param}-${option}`);
            for(let thisImage of thisImages) {
              thisImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }
      thisProduct.priceElem.innerHTML = price;
    }
  }

  const app = {
    initMenu: function() {
      const thisApp = this;
      for(let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function() {
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function(){
      const thisApp = this;
      /*console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);*/
      thisApp.initData();
      app.initMenu();
    },
  };

  

  app.init();
}