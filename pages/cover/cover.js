import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'

const toSplit = document.querySelector('[data-split]')
const content = toSplit.innerText
const contentLength = content.length

const PPC = 10 // Pixels per character...
const BUFFER = 40

// Set CSS variables for sizing
document.documentElement.style.setProperty('--buffer', BUFFER)
document.documentElement.style.setProperty('--ppc', PPC)
document.documentElement.style.setProperty('--pad', 8)
document.documentElement.style.setProperty('--content-length', contentLength + 2)

// Split the text into individual spans
const words = toSplit.innerText.split(' ')
toSplit.innerHTML = ''

let cumulation = 10
words.forEach((word, index) => {
  const text = Object.assign(document.createElement('span'), {
    innerHTML: `<span>${word} </span>`,
    style: `
      --index: ${index};
      --start: ${cumulation};
      --end: ${cumulation + word.length};
    `,
  })
  text.dataset.index = index
  text.dataset.start = cumulation
  text.dataset.end = cumulation + word.length
  cumulation += word.length + 1
  toSplit.appendChild(text)
})

// Fallback for browsers that don't support scroll-driven animations
if (!CSS.supports('animation-timeline: scroll()')) {
  gsap.registerPlugin(ScrollTrigger)
  console.info('GSAP ScrollTrigger: Registered')
  
  // Animate the words
  const reader = document.querySelector('.reader')
  const readerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.reader',
      start: 'top bottom-=100', // Start when the reader section enters view from bottom
      end: 'bottom center',
      scrub: 1
    }
  })
  
  // Add each word to the timeline with staggered delays
  toSplit.children.forEach((word, index) => {
    readerTimeline.fromTo(
      word,
      {
        '--active': 0,
        opacity: 0.3,
        filter: 'blur(5px)'
      },
      {
        '--active': 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.1, 
        ease: 'power2.out'
      },
      index * 0.03 // Slightly stagger each word
    )
  })
  
  // Animate the header
  gsap.to('header', {
    scale: 0.8,
    scrollTrigger: {
      trigger: 'header',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
}