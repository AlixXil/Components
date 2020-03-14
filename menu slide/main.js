let menuBtn = document.querySelector('.menu-btn')
let menu = document.querySelector('.menu')
let content = document.querySelector('.content')

menuBtn.addEventListener('click', () => {
  menu.style.top = (window.scrollY + 10) + 'px'
  menu.classList.toggle("show")
  content.classList.toggle("show")
})

document.addEventListener("scroll", () => {
  menu.style.top = (window.scrollY + 10) + 'px'
})
