let slider = (function() {
	let currentSlide = 0
	let slider = null
	let slides = null
	let track = null
	let dots = null

	// принимает элемент контейнер с классом slider
	function setSlider(sliderID) {
		slider = document.querySelector("#" + sliderID)
		slides = slider.querySelectorAll(".slide")
		// создаем полосу для слайдов
		track = document.createElement('div')
		track.classList.add('slider-track')

		// изменение размеров
		window.addEventListener('resize', function() {
			resizeSlider(slider, track, slides)
		})
		resizeSlider(slider, track, slides)

		// переносим слайды на полосу
		slides.forEach((s, index) => {
			track.append(s)
		})
		slider.innerHTML = '';
		// добавляем полосу
		slider.append(track)

		//добавляем кнопки
		addButtons()

		// добавляем точки
		addDots();

		slides.forEach((s) => {
			s.addEventListener('click', (e) => {
				setCurrentSlide(currentSlide + 1)
			})
		})
	}

	function addButtons() {
		let nextBtn = document.createElement('button')
		nextBtn.classList.add('slider-next-btn')
		nextBtn.addEventListener('click', (e) => {
				setCurrentSlide(currentSlide + 1, slides, track)
			})
		let prevBtn = document.createElement('button')
		prevBtn.classList.add('slider-prev-btn')
		prevBtn.addEventListener('click', (e) => {
				setCurrentSlide(currentSlide - 1, slides, track)
			})
		slider.append(prevBtn)
		slider.append(nextBtn)
	}

	function addDots() {
		dots = document.createElement('div')
		dots.classList.add('slider-dots-list')

		for(let i = 0; i < slides.length; i++) {
			let dot = document.createElement('span')
			dot.classList.add('slider-dot')
			if(currentSlide == i) dot.classList.add('active')
			dot.setAttribute('data-slide', i)
			dot.addEventListener('click', dotClick)

			dots.append(dot)
		}

		slider.append(dots)
	}

	// клик на точке
	function dotClick(e) {
		setCurrentSlide(e.target.dataset.slide)
	}

	function setCurrentSlide(index) {
		if(index >= slides.length) { currentSlide = 0 }
			else if(index < 0) {currentSlide = slides.length - 1}
				else { currentSlide = index }

		//передвинуть дорожку
		let left = slides[currentSlide].offsetWidth * currentSlide
		track.style.left = -left + 'px'

		//обновить точки
		if(dots) {
			for(let i = 0; i < dots.children.length; i++) {
				dots.children[i].classList.remove('active')
			}
			dots.children[currentSlide].classList.add('active')
		}
	}

	function resizeSlider(slider, track, slides) {
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
		setCurrentSlide(currentSlide, slides, track)		
	}

	return {
		set: function(sliderID) { setSlider(sliderID) }
	}
})()


window.addEventListener('load', () => {
	slider.set('slider')
})