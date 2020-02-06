let menuBtn = document.querySelector('.menu-btn')
let menu = document.querySelector('.menu')
let content = document.querySelector('.content')

menuBtn.addEventListener('click', () => {
  menu.style.top = (window.scrollY + 10) + 'px'
  menu.classList.toggle("show")
  content.classList.toggle("show")
})

document.addEventListener("scroll", () => {
  // console.dir(e)
  // console.log('scroll', window.scrollY, 'offset', window.pageYOffset)
  menu.style.top = (window.scrollY + 10) + 'px'
})
// console.dir(window)