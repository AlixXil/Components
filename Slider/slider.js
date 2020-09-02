class Slider {

  constructor(sliderID) {
    this.currentSlide = 0
    this.slider = null
    this.slides = null
    this.track = null
    this.dots = null

    this.slider = document.querySelector("#" + sliderID)
    this.slides = this.slider.querySelectorAll(".slide")
      // создаем полосу для слайдов
    this.track = document.createElement('div')
    this.track.classList.add('slider-track')

    // изменение размеров
    window.addEventListener('resize', function() {
      this.resizeSlider(this.slider, this.track, this.slides)
    })
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
    this.addDots();

    this.slides.forEach((s) => {
      s.addEventListener('click', (e) => {
        this.setCurrentSlide(this.currentSlide + 1)
      })
    })
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
    this.setCurrentSlide(this.currentSlide - 1, this.slides, this.track)
  }
  btnNextClick(e, step) {
    this.setCurrentSlide(this.currentSlide + 1, this.slides, this.track)
  }

  setCurrentSlide(index) {
    if (index >= this.slides.length) { this.currentSlide = 0 } else if (index < 0) { this.currentSlide = this.slides.length - 1 } else { this.currentSlide = index }

    //передвинуть дорожку
    let left = this.slides[this.currentSlide].offsetWidth * this.currentSlide
    this.track.style.left = -left + 'px'

    //обновить точки
    if (this.dots) {
      for (let i = 0; i < this.dots.children.length; i++) {
        this.dots.children[i].classList.remove('active')
      }
      this.dots.children[this.currentSlide].classList.add('active')
    }
  }

  resizeSlider(slider, track, slides) {
    let sliderWidth = slider.offsetWidth
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
    this.setCurrentSlide(this.currentSlide, slides, track)
  }
}