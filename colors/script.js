const newColor = () => {
    let alphabet = '0123456789abcdef'
    let color = alphabet.split('')
    let result = ["#"]

    for (let i = 0; i < 6; i++) {
        let random = Math.ceil(Math.random() * 15)
        result.push(color[random])
    }

    return result.join('')
}

let buttons = document.querySelectorAll('button')

buttons.forEach(element => {
    element.addEventListener('click', () => 
        element.closest('div').style.backgroundColor = newColor()
    )
});