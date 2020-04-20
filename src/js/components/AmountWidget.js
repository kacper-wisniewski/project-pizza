import {settings, select} from '../settings.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.initActions();
    thisWidget.value = settings.amountWidget['defaultValue'];
    thisWidget.setValue(thisWidget.input.value);
  }
  getElements(element) {
    const thisWidget = this;
    
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  initActions() {
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function() {
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function(event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function(event) {
      event.preventDefault();
      const value = parseInt(thisWidget.value + 1);
      thisWidget.setValue(value);
    });
  }
  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);
    if(newValue >= settings.amountWidget['defaultMin'] && newValue <= settings.amountWidget['defaultMax']) {
      thisWidget.value = newValue;
    } else if(newValue > settings.amountWidget['defaultMax']) {
      thisWidget.value = settings.amountWidget['defaultMax'];
    } else if(newValue < settings.amountWidget['defaultMin']) {
      thisWidget.value = settings.amountWidget['defaultMin'];
    }
    thisWidget.announce();
    thisWidget.input.value = thisWidget.value;
  }
  announce() {
    const thisWidget = this;
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}
export default AmountWidget;