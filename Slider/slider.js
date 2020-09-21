class Slider {

  constructor(sliderID, options = { showSlides: 1, slideCount: 1, showDots: true }) {
    this.showSlides = options.showSlides ? options.showSlides : 1; // показывать слайдов
    this.slideCount = options.slideCount ? options.slideCount : 1; // прокрутка слайдов

    //отображение точек
    if (options.showDots != null) this.showDots = options.showDots;
    else this.showDots = true;

    this.currentSlide = 0; // текущий слайд
    this.slider = null; // контейнер
    this.slides = null; // элементы с классом slide
    this.track = null; //дорожка со сладами
    this.dots = null; // точки
    this.left = 0; // отступ слева

    //для тача
    this.touch = false;
    this.touchStartPosition = 0;

    this.slider = document.querySelector("#" + sliderID)
    this.slides = this.slider.querySelectorAll(".slide")
    // создаем полосу для слайдов
    this.track = document.createElement('div')
    this.track.classList.add('slider-track')

    // изменение размеров
    this.windowResizeHandler = this.windowResizeHandler.bind(this)
    window.addEventListener('resize', this.windowResizeHandler)
    this.resizeSlider(this.slider, this.track, this.slides)

    // переносим слайды на полосу
    this.slides.forEach((s, index) => {
      this.track.append(s)
    })
    this.slider.innerHTML = '';
    // добавляем полосу
    this.slider.append(this.track)

    //добавляем кнопки
    this.addButtons()

    // добавляем точки
    if (this.showDots) this.addDots();

    // клик по слайду
    // this.slides.forEach((s) => {
    //   s.addEventListener('click', (e) => {
    //     this.setCurrentSlide(this.currentSlide + this.slideCount)
    //   })
    // })

    this.touchStart = this.touchStart.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.touchMove = this.touchMove.bind(this);

    this.slider.addEventListener('touchstart', this.touchStart);
    this.slider.addEventListener('touchend', this.touchEnd);
    this.slider.addEventListener('touchmove', this.touchMove);
  }

  windowResizeHandler() {
    this.resizeSlider(this.slider, this.track, this.slides)
  }

  addButtons() {
    let nextBtn = document.createElement('button')
    nextBtn.classList.add('slider-next-btn')
    this.btnNextClick = this.btnNextClick.bind(this)
    nextBtn.addEventListener('click', this.btnNextClick)

    let prevBtn = document.createElement('button')
    prevBtn.classList.add('slider-prev-btn')
    this.btnPrevClick = this.btnPrevClick.bind(this)
    prevBtn.addEventListener('click', this.btnPrevClick)

    this.slider.append(prevBtn)
    this.slider.append(nextBtn)
  }

  addDots() {
    this.dots = document.createElement('div')
    this.dots.classList.add('slider-dots-list')

    for (let i = 0; i < this.slides.length; i++) {
      let dot = document.createElement('span')
      dot.classList.add('slider-dot')
      if (this.currentSlide == i) dot.classList.add('active')
      dot.setAttribute('data-slide', i)
      this.dotClick = this.dotClick.bind(this)
      dot.addEventListener('click', this.dotClick)

      this.dots.append(dot)
    }

    this.slider.append(this.dots)
  }

  // клик на точке
  dotClick(e) {
    this.setCurrentSlide(Number(e.target.dataset.slide))
  }
  // клик на кнопке
  btnPrevClick(e) {
    this.setCurrentSlide(this.currentSlide - this.slideCount)
  }
  btnNextClick(e) {
    this.setCurrentSlide(this.currentSlide + this.slideCount)
  }

  setCurrentSlide(index) {
    let isEnd = false; //флаг выхода за крайний слайд
    // let step = index - this.currentSlide; // шаг пролистывания, + следующий, - предыдущий 

    if (this.slideCount >= this.showSlides) {
      if (
        index >= this.slides.length &&
        index - this.slideCount + this.showSlides >= this.slides.length) this.currentSlide = 0;
      else if (
        index + this.slideCount <= this.showSlides &&
        this.currentSlide != 0) this.currentSlide = 0;
      else if (index + this.slideCount > this.slides.length || index < 0) this.currentSlide = this.slides.length - this.showSlides;
      else this.currentSlide = index;
    } else {
      if (index > this.slides.length - this.showSlides && this.currentSlide == this.slides.length - this.showSlides) this.currentSlide = 0;
      else if (index + this.slideCount <= this.slideCount && this.currentSlide != 0) this.currentSlide = 0;
      else if (index > this.slides.length - this.showSlides || index < 0) this.currentSlide = this.slides.length - this.showSlides;
      else this.currentSlide = index;
    }

    this.left = this.slides[this.currentSlide].offsetWidth * this.currentSlide
    this.track.style.left = -this.left + 'px'

    //обновить точки
    if (this.dots) {
      for (let i = 0; i < this.dots.children.length; i++) {
        this.dots.children[i].classList.remove('active')
      }
      this.dots.children[this.currentSlide].classList.add('active')
    }
  }

  resizeSlider(slider, track, slides) {
    let sliderWidth = slider.offsetWidth / this.showSlides;
    // растягиваем слайды на все ширину
    slides.forEach((s) => {
      s.style.width = sliderWidth + 'px'
    })
    // устанавливаем высоту дорожки
    slider.style.height = track.style.height = slides[0].offsetHeight + 'px'
    // track.style.height = slides[0].offsetHeight + 'px'
    // устанавливаем ширину дорожки 
    // исходя из предположения что все слайды одной ширины
    track.style.width = sliderWidth * slides.length + 'px'

    // передвигаем
    this.setCurrentSlide(this.currentSlide)
  }

  // обработка тач событий
  touchStart(e) {
    this.touch = true;
    this.touchStartPosition = e.touches[0].clientX;
  }
  touchEnd(e) {
    this.touch = false;
    this.left = this.left + Math.ceil(this.touchStartPosition - e.changedTouches[0].clientX);

    //обновление текущего слайда
    let slide = Math.floor(this.left / this.slides[0].offsetWidth);
    if (this.left % this.slides[0].offsetWidth > this.slides[0].offsetWidth / 2) {
      slide += 1;
    }

    this.setCurrentSlide(slide);
  }
  touchMove(e) {
    if (this.touch) {
      let delta = Math.ceil(this.touchStartPosition - e.touches[0].clientX);
      this.track.style.left = -this.left - delta + 'px';
    }
  }
}