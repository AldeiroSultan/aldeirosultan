const update = ({ x, y }) => {
    document.documentElement.style.setProperty('--x', x)
    document.documentElement.style.setProperty('--y', y)
}

const list = document.querySelector('ol')
list.addEventListener('pointermove', update)

// Make the entire list area trigger the image display
const listItems = document.querySelectorAll('li')
listItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.setProperty('--active', '1')
    })
    item.addEventListener('mouseleave', () => {
        item.style.setProperty('--active', '0')
    })
})