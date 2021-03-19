
const {app, BrowserWindow, ipcMain} = require('electron')
const globals = require('./globals')

function createWindow () {

	const mainWindow = new BrowserWindow({
		width: globals.WIN_WIDTH,
		height: globals.WIN_HEIGHT,
		autoHideMenuBar: true,
		transparent: true,
		frame: false,
		maximizable: false,
		icon: __dirname + '/icon.png',
		webPreferences: {
			nodeIntegration: true
		}
	})

	mainWindow.loadFile('index.html')
	
}

app.whenReady().then(() => {
	createWindow()
	
	ipcMain.on('close',(event,data) => {
		app.quit()
	})

}).catch((e)=>{
	console.log(e)
})

app.on('window-all-closed',  () => {
	app.quit()
})