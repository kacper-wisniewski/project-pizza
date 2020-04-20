import {select, classNames, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import utils from '../utils.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
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
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
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
  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
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
      });
    }
    thisProduct.cartButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = thisProduct.data.params;
    let price = thisProduct.data.price;
    thisProduct.params = {};
    for(let param in params) {
      const options = params[param].options;
      for(let option in options) {
        const optionSelected = formData.hasOwnProperty(param) && formData[param].indexOf(option) > -1;
        if(optionSelected && !options[option].default) {
          price += options[option].price;
        } else if(!optionSelected && options[option].default) {
          price -= options[option].price;
        }
        if(optionSelected) {
          const thisImages = thisProduct.imageWrapper.querySelectorAll(`.${param}-${option}`);
          if(!thisProduct.params[param]) {
            thisProduct.params[param] = {
              label: params[param].label,
              options: {},
            };
          }
          thisProduct.params[param].options[option] = options[option].label;
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
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
    thisProduct.priceElem.innerHTML = thisProduct.price;
  }
  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }
}
export default Product;