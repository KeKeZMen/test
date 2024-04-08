const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
const track = document.querySelector('.slider-track')
const dots = document.querySelector('.slider-dots')

let trackPosition = 0
for (let i = 1; i < document.querySelectorAll('.slider-item').length; i++) {
    if(i == 1) dots.innerHTML += "<span class='active'></span>"
    
    dots.innerHTML += "<span></span>"
}

const setTrack = () => {
    if(trackPosition < (((track.childNodes.length - 1) / 2) - 1) *  -340) trackPosition = 0
    if(trackPosition > 0) trackPosition = (((track.childNodes.length - 1) / 2) - 1) *  -340 

    track.style.transform = `translateX(${trackPosition}px)`
    
    document.querySelector('.active').classList.remove('active')
    dots.childNodes[-trackPosition / 340].classList.add('active')
}

prev.addEventListener('click', () => setTrack(trackPosition += 340))

next.addEventListener('click', () => setTrack(trackPosition -= 340))

dots.addEventListener('click', e => {
    if(e.target === dots) return false
    trackPosition = (Array.from(dots.childNodes).indexOf(e.target)) * -340
    
    setTrack()
})


document.addEventListener('keydown', (e) => {
    if(e.key == 'z' || e.key == 'я'){
        const audio = new Audio()
        audio.src = './test/woo.mp3'
        audio.autoplay = true
    }

    if(e.key == 'v' || e.key == 'м'){
        const audio = new Audio()
        audio.src = './test/fucking-slaves-get-your-ass-back-here.mp3'
        audio.autoplay = true
    }

    if(e.key == 'x' || e.key == 'ч'){
        const audio = new Audio()
        audiosrc = './test/fuck-you1.mp3'
        audio.autoplay = true
    }

    if(e.key == 'c' || e.key == 'с'){
        const audio = new Audio()
        audio.src = './test/spank.mp3'
        audio.autoplay = true
    }
})
