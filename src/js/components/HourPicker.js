import BaseWidget from './BaseWidget.js';
import { settings, select } from '../settings.js';
import utils from '../utils.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    
    thisWidget.value = thisWidget.dom.input.value;
    thisWidget.renderValue();
    thisWidget.initPlugin();
  }
  initPlugin() {
    const thisWidget = this;
    console.log(thisWidget);
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('change', function() {
      thisWidget.value = thisWidget.dom.input.value;
      thisWidget.renderValue();
    })
  }
  parseValue(value) {
    return utils.numberToHour(value);
  }
  isValid() {
    return true;
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}
export default HourPicker;