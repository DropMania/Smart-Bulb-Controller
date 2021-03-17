const {ipcRenderer} = require('electron')
const globals = require('./globals')
const BulbController = require("magic-hue-controller");
 
const bulbController = new BulbController(globals.BULB_IP);


window.addEventListener('keyup',(e)=>{
    if(e.key === 'Escape') ipcRenderer.sendSync('close')
})


for(let color in globals.COLOR_MAP){
    let colorElement = document.createElement('div')
    let colorBar = document.createElement('div')
    colorElement.className = 'colorElement'
    colorElement.setAttribute('brightness','10')
    colorElement.style.backgroundColor = `rgb(${globals.COLOR_MAP[color]
        .split(',').map(c=>c-200).join(',')})`
    colorElement.style.width = `${globals.BLOCK_SIZE}px`
    colorElement.style.height = `${globals.BLOCK_SIZE}px`
    colorElement.style.margin = `5px`
    colorElement.style.webkitAppRegion = 'no-drag'
    colorElement.onclick = () => {
        if(color == 'WARM_WHITE'){
            setWarm(colorElement.getAttribute('brightness'))
        }else{
            colorChange(globals.COLOR_MAP[color],colorElement.getAttribute('brightness'))
        }
    }
    colorElement.onwheel = (e) => {
        let multiplier = ((e.deltaY/100) * -1) 
        if(colorElement.getAttribute('brightness')>=0 && colorElement.getAttribute('brightness')<=10){
            colorElement.setAttribute('brightness',
                parseInt(colorElement.getAttribute('brightness'))+multiplier)
            if(colorElement.getAttribute('brightness')>=11) colorElement.setAttribute('brightness',10)
            if(colorElement.getAttribute('brightness')<=-1) colorElement.setAttribute('brightness',0)
        }
        colorBar.style.height = `${(colorElement.getAttribute('brightness')/10)*100}%`
        if(color == 'WARM_WHITE'){
            setWarm(colorElement.getAttribute('brightness'))
        }else{
            colorChange(globals.COLOR_MAP[color],colorElement.getAttribute('brightness'))
        }
    }

    colorBar.className = 'colorBar'
    colorBar.style.backgroundColor = `rgb(${globals.COLOR_MAP[color]})`
    colorBar.style.width = '100%'
    colorBar.style.height = '100%'
    colorElement.appendChild(colorBar)
    document.body.appendChild(colorElement)
}

function colorChange(color,brightness){
    bulbController.isOnline().then(async (status) => {
        if(status) {
            await bulbController.sendPower(true)
            await bulbController.sendRGB(color.split(',').map(c=>{
                return c - (((10-brightness)/10)*255) < 0 ? 0 :c - (((10-brightness)/10)*255)
            }).join(','))
        }else {
            console.log("offline")
        }
    })
}

function setWarm(brightness){
    bulbController.isOnline().then(async (status) => {
        if(status) {
            await bulbController.sendPower(true)
            await bulbController.sendWarmLevel(255*brightness/10)
        }else {
            console.log("offline")
        }
    })
}