window.SwiperAnimate = class SwiperAnimate {

  constructor() {
    this.__handlerArr = []
  }


  swiperAnimateCache() {
    var allBoxes = window.document.documentElement.querySelectorAll(".ani");
    for (var i = 0; i < allBoxes.length; i++) {
      if (allBoxes[i].attributes["style"]) {
        allBoxes[i].setAttribute("swiper-animate-style-cache", allBoxes[i].attributes["style"].value);
      } else {
        allBoxes[i].setAttribute("swiper-animate-style-cache", " ");
      }
      allBoxes[i].style.visibility = "hidden";
    }
  }

  _addAniStyle(ele, effect, duration, delay, iterationCount) {
    var style = '';
    ele.style.visibility = "visible";
    ele.className = ele.className + " " + effect + " " + "animated";
    style = ele.attributes["style"].value;
    if (duration) {
      style = style + "animation-duration:" + duration + ";-webkit-animation-duration:" + duration + ";";
    }
    if (delay) {
      style = style + "animation-delay:" + delay + ";-webkit-animation-delay:" + delay + ";";
    }
    if (iterationCount) {
      style = style + "animation-iteration-count:" + iterationCount + ";-webkit-animation-iteration-count:" + iterationCount + ";";
    }
    ele.setAttribute("style", style);
  }

  swiperAnimate(swiper) {
    this._clearSwiperAnimate();
    var element = swiper.slides[swiper.activeIndex].querySelectorAll(".ani");
    for (var i = 0; i < element.length; i++) {
      var effect, duration, delay, iterationCount;
      effect = element[i].attributes["swiper-animate-effect"] ? element[i].attributes["swiper-animate-effect"].value : "";
      duration = element[i].attributes["swiper-animate-duration"] ? element[i].attributes["swiper-animate-duration"].value : "";
      delay = element[i].attributes["swiper-animate-delay"] ? element[i].attributes["swiper-animate-delay"].value : "";
      iterationCount = element[i].attributes["swiper-animation-iteration-count"] ? element[i].attributes["swiper-animation-iteration-count"].value : "1";

      var aniVector = this._aniVectorGenerator(effect, duration, delay, iterationCount);

      for (var j = 0; j < aniVector.length; j++) {
        let self = this;
        (function (i, j, aniVector) {
          var handler = setTimeout(function () {
            self._clearEleAnimate(element[i], j > 0 ? aniVector[j - 1].effect : '');
            self._addAniStyle(element[i], aniVector[j].effect, aniVector[j].duration, 0, aniVector[j].iterationCount);
          }, aniVector[j].delay);
          self.__handlerArr.push(handler);
        })(i, j, aniVector);
      }

    }
  }

  /**
  * effect: [fadeInLeft, fadeInRight, ...]
  * duration: [3s, 1s, ...]
  * delay: [1s, 2s, ...]
  * iterationCount: [2, infinite, ...]
  *
  * @return
  * [{
      effect: 'fadeInLeft',
      duration: '3s',
      delay: 1000,
      iterationCount: 2
  }, {
      effect: 'fadeInRight',
      duration: '1s',
      delay: ( 1 + 3 * 2 + 2 ) * 1000,
      iterationCount: 1
  }]
  */
  _aniVectorGenerator(effect, duration, delay, iterationCount) {
    effect = effect.replace(/\s/g, "").split(",");
    duration = duration.replace(/\s/g, "").split(",");
    delay = delay.replace(/\s/g, "").split(",");
    iterationCount = iterationCount.replace(/\s/g, "").split(",");

    var vector = [], delaySum = 0;
    for (var i = 0; i < effect.length; i++) {
      if (i === 0) {
        delaySum = parseFloat(delay[i]);
      } else {
        delaySum = delaySum + parseFloat(duration[i - 1]) * (iterationCount[i - 1] === 'infinite' ? 999999 : parseInt(iterationCount[i - 1])) + parseFloat(delay[i]);
      }
      vector.push({
        effect: effect[i],
        duration: duration[i],
        delay: delaySum * 1000,
        iterationCount: iterationCount[i]
      });
    }
    return vector;
  }

  _clearEleAnimate(ele, effect) {
    if (ele.attributes["swiper-animate-style-cache"]) {
      ele.setAttribute("style", ele.attributes["swiper-animate-style-cache"].value);
    }
    ele.style.visibility = "hidden";
    ele.className = ele.className.replace("animated", "");
    if (effect) {
      ele.className = ele.className.replace(effect, "");
    }
  }

  _clearSwiperAnimate() {
    for (var i = 0; i < this.__handlerArr.length; i++) {
      clearTimeout(this.__handlerArr[i]);
    }
    var allBoxes = window.document.documentElement.querySelectorAll(".ani");
    for (var i = 0; i < allBoxes.length; i++) {
      if (allBoxes[i].attributes["swiper-animate-style-cache"]) {
        allBoxes[i].setAttribute("style", allBoxes[i].attributes["swiper-animate-style-cache"].value);
      }
      allBoxes[i].style.visibility = "hidden";
      allBoxes[i].className = allBoxes[i].className.replace("animated", "");
      if (allBoxes[i].attributes["swiper-animate-effect"]) {
        var effect = allBoxes[i].attributes["swiper-animate-effect"].value;
        effect = effect.replace(/\s/g, "").split(",");
        for (var j = 0; j < effect.length; j++) {
          allBoxes[i].className = allBoxes[i].className.replace(effect[j], "");
        }
      }
    }
  }

}