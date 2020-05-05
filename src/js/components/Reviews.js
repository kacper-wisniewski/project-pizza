import { select } from '../settings.js';

class Reviews {
  constructor(element) {
    const thisReview = this;
    
    thisReview.getElements(element);
    console.log('constructor');
    thisReview.changeReview(0);
  }
  getElements(element) {
    const thisReview = this;
    thisReview.reviews = element.querySelectorAll(select.reviews.review);
    //console.log(thisReview.reviews);
  }
  changeReview(start) {
    const thisReview = this;
    
    let indexStart = start;
    let indexNext = indexStart + 1;
    //console.log(thisReview.reviews.length);

    setTimeout(function() {
      thisReview.reviews[indexStart].classList.remove('active');
      if(indexStart == thisReview.reviews.length - 1) {
        thisReview.reviews[0].classList.add('active');
        thisReview.changeReview(0);
      } else {
        thisReview.reviews[indexNext].classList.add('active');
        thisReview.changeReview(indexNext);
      }
    },5000);
  }
}

export default Reviews;