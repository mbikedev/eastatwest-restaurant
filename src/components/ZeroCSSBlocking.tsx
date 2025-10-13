'use client'

import { useEffect, useState } from 'react'

// Ultra-minimal critical CSS - only absolute essentials for first paint
export const ultraCriticalCSS = `
/* Reset and base */
*,::before,::after{box-sizing:border-box;border-width:0}
html,body{margin:0;padding:0}
body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased}
h1,h2,p{margin:0}
button{font:inherit;cursor:pointer;border:0;background:0 0}
:root{--bg:#fff;--fg:#000}
@media(prefers-color-scheme:dark){:root{--bg:#000;--fg:#fff}}
body{background:var(--bg);color:var(--fg)}

/* Layout utilities */
.relative{position:relative}
.absolute{position:absolute}
.fixed{position:fixed}
.inset-0{top:0;right:0;bottom:0;left:0}
.z-20{z-index:20}
.z-50{z-index:50}
.w-full{width:100%}
.h-screen{height:100vh}
.min-h-screen{min-height:100vh}
.flex{display:flex}
.flex-col{flex-direction:column}
.items-center{align-items:center}
.justify-center{justify-content:center}
.overflow-hidden{overflow:hidden}
.aspect-square{aspect-ratio:1/1}
.object-cover{object-fit:cover}

/* Typography */
.text-center{text-align:center}
.font-black{font-weight:900}
.font-bold{font-weight:700}
.text-white{color:#fff}
.text-transparent{color:transparent}

/* Spacing */
.mx-auto{margin-left:auto;margin-right:auto}
.mb-2{margin-bottom:.5rem}
.mb-4{margin-bottom:1rem}
.mb-6{margin-bottom:1.5rem}
.mb-8{margin-bottom:2rem}
.px-4{padding-left:1rem;padding-right:1rem}
.px-6{padding-left:1.5rem;padding-right:1.5rem}
.py-2{padding-top:.5rem;padding-bottom:.5rem}
.py-3{padding-top:.75rem;padding-bottom:.75rem}

/* Sizing */
.text-3xl{font-size:1.875rem;line-height:2.25rem}
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.text-5xl{font-size:3rem;line-height:1}
.text-sm{font-size:.875rem;line-height:1.25rem}
.text-base{font-size:1rem;line-height:1.5rem}
.text-lg{font-size:1.125rem;line-height:1.75rem}
.text-xl{font-size:1.25rem;line-height:1.75rem}

/* Effects */
.bg-clip-text{background-clip:text}
.opacity-90{opacity:.9}
.shadow-2xl{box-shadow:0 25px 50px -12px rgba(0,0,0,.25)}
.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms}
.duration-300{transition-duration:300ms}
.transform{transform:translate(0,0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)}
.hover\\:scale-105:hover{transform:scale(1.05)}
.focus\\:scale-105:focus{transform:scale(1.05)}
.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}
.focus\\:ring-4:focus{box-shadow:0 0 0 4px var(--tw-ring-color)}

/* Responsive */
@media(min-width:640px){
.sm\\:flex-row{flex-direction:row}
.sm\\:gap-4{gap:1rem}
.sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}
.sm\\:py-3{padding-top:.75rem;padding-bottom:.75rem}
.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}
.sm\\:text-6xl{font-size:3.75rem;line-height:1}
.sm\\:text-base{font-size:1rem;line-height:1.5rem}
.sm\\:text-lg{font-size:1.125rem;line-height:1.75rem}
.sm\\:rounded-2xl{border-radius:1rem}
.sm\\:mb-4{margin-bottom:1rem}
.sm\\:mb-6{margin-bottom:1.5rem}
.sm\\:mb-8{margin-bottom:2rem}
}
`

// All non-critical CSS that will be loaded asynchronously
const nonCriticalCSS = `
/* Complete application styles - loaded after first paint */
.py-12{padding-top:3rem;padding-bottom:3rem}
.px-4{padding-left:1rem;padding-right:1rem}
.px-6{padding-left:1.5rem;padding-right:1.5rem}
.mb-6{margin-bottom:1.5rem}
.mb-10{margin-bottom:2.5rem}
.mx-auto{margin-left:auto;margin-right:auto}
.gap-6{gap:1.5rem}
.max-w-3xl{max-width:48rem}
.max-w-6xl{max-width:72rem}
.text-xl{font-size:1.25rem;line-height:1.75rem}
.text-2xl{font-size:1.5rem;line-height:2rem}
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.text-5xl{font-size:3rem;line-height:1}
.text-6xl{font-size:3.75rem;line-height:1}
.font-bold{font-weight:700}
.font-light{font-weight:300}
.leading-relaxed{line-height:1.625}

/* Hero section complete styles */
.hero-section{
  height:100vh;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(135deg,#5C4300 0%,#000 100%);
}
.hero-video{
  position:absolute;
  top:0;left:0;
  width:100%;height:100%;
  object-fit:cover;
}
.hero-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 50%,rgba(0,0,0,0.2) 100%);
}
.hero-content{
  position:relative;z-index:20;
  text-align:center;padding:1rem;
  max-width:96rem;
}
.hero-title{
  font-size:3rem;font-weight:900;
  margin-bottom:1.5rem;
  font-family:"ZCOOL XiaoWei",serif;
  background:linear-gradient(to right,#f99747,#bc906b,#5C4300);
  -webkit-background-clip:text;
  background-clip:text;
  -webkit-text-fill-color:transparent;
  color:transparent;
}

/* Buttons */
.btn-hero{
  display:inline-block;
  background:linear-gradient(90deg,#f99747 0%,#bc906b 100%);
  color:#F5F1EC;
  padding:1.25rem 2.5rem;
  border-radius:1rem;
  font-size:1.25rem;
  font-weight:700;
  text-decoration:none;
  transition:all 0.3s ease;
  box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);
}
.btn-hero:hover{
  transform:scale(1.05);
  box-shadow:0 25px 50px -12px rgba(249,151,71,0.25);
}
.btn-secondary{
  display:inline-block;
  border:3px solid #F5F1EC;
  background:rgba(245,241,236,0.1);

  color:#F5F1EC;
  padding:1.25rem 2.5rem;
  border-radius:1rem;
  font-size:1.25rem;
  font-weight:700;
  text-decoration:none;
  transition:all 0.3s ease;
  box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);
}
.btn-secondary:hover{
  background:#F5F1EC;
  color:#5C4300;
  transform:scale(1.05);
}

/* Navigation */
.nav-header{
  position:fixed;top:0;left:0;right:0;
  z-index:50;

  background:rgba(92,67,0,0.9);
}

/* Responsive breakpoints */
@media(min-width:640px){
  .sm\\:text-6xl{font-size:3.75rem;line-height:1}
  .sm\\:text-8xl{font-size:6rem;line-height:1}
  .sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}
  .sm\\:flex-row{flex-direction:row}
  .hero-title{font-size:3.75rem}
}
@media(min-width:768px){
  .md\\:text-5xl{font-size:3rem;line-height:1}
  .md\\:text-6xl{font-size:3.75rem;line-height:1}
}
@media(min-width:1024px){
  .lg\\:text-6xl{font-size:3.75rem;line-height:1}
  .lg\\:text-7xl{font-size:4.5rem;line-height:1}
  .lg\\:px-8{padding-left:2rem;padding-right:2rem}
  .hero-title{font-size:4.5rem}
}
@media(min-width:1280px){
  .xl\\:text-8xl{font-size:6rem;line-height:1}
  .hero-title{font-size:5rem}
}

/* Add all remaining styles here... */
`

export default function ZeroCSSBlocking() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Critical CSS is already injected by layout.tsx - no need to inject here
    console.log('ZeroCSSBlocking: Critical CSS handled by layout')

    // Load non-critical CSS after first paint (removed duplicate loading)
    const loadNonCriticalCSS = () => {
      if (isLoaded) return
      
      const nonCriticalStyle = document.createElement('style')
      nonCriticalStyle.textContent = nonCriticalCSS
      nonCriticalStyle.setAttribute('data-non-critical', 'true')
      document.head.appendChild(nonCriticalStyle)
      
      setIsLoaded(true)
    }

    // Use requestIdleCallback for non-critical CSS if available
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadNonCriticalCSS, { timeout: 100 })
    } else {
      setTimeout(loadNonCriticalCSS, 50)
    }

    return () => {
      // Cleanup function
    }
  }, [isLoaded])

  // Preload critical resources
  useEffect(() => {
    const resourceHints = [
      { href: 'https://fonts.googleapis.com', rel: 'dns-prefetch' },
      { href: 'https://fonts.gstatic.com', rel: 'dns-prefetch' },
      { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
      { href: 'https://fonts.gstatic.com', rel: 'preconnect', crossOrigin: 'anonymous' },
      { href: '/videos/hero-video.mp4', rel: 'prefetch' },
    ]

    resourceHints.forEach(hint => {
      const link = document.createElement('link')
      Object.assign(link, hint)
      document.head.appendChild(link)
    })

    // Resource hints only - CSS loading is handled above
    return () => {
      // Cleanup function
    }
  }, [])

  return null
}

// ultraCriticalCSS is already exported above
