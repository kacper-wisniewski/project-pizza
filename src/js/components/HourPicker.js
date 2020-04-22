import BaseWidget from './BaseWidget.js';
import { settings, select } from '../settings.js';
import utils from '../utils.js';

class HourPicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, settings.hours.open);
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    thisWidget.dom.input.addEventListener('change', function() {
      thisWidget.renderValue();
    });
  }
  initPlugin() {
    const thisWidget = this;
    console.log(thisWidget);
    rangeSlider.create(thisWidget.dom.input);
  }
  parseValue(value) {
    return utils.numberToHour(value);
  }
  isValid() {
    return true;
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output = thisWidget.value;
  }
}
export default HourPicker;