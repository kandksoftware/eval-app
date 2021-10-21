'use strict'

class Timer{
  constructor(interval){
    this._interval = interval
    this._time = null
    this._running = false
    this._callback = null
  }

  isRunning(){
		return this._running
	}
  
  addCallback(callback){
    this._callback = callback
  }

  setInterval(interval){
    this._interval = interval
  }

  exec(){
    this._time = setTimeout(() => {
      if(this._callback !== null) this._callback(this)
    },this._interval)
  }

  start(){
    if(!this._running){
      this._running = true
      this.exec()
    }
  }

  stop(){
    clearTimeout(this._time)
    this._running = false
  }
}