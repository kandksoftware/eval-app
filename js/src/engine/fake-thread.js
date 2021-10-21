'use strict'

class FakeThread extends Timer{
  constructor(_atOnce = 20){
    super()
    this._cg = new Config()
    this._config = this._cg.get()
    this.setInterval(0)
    this._atOnce = _atOnce
    this.reset()
    this.init()
  }

  reset(){
    this._lines = []
    this._counter = 0
    this._blockCallback = null
    this._isRunnigCallback = null
    this._isDoneCallback = null
    this._isRun = false
  }

  init(){
    this._initGlobal()
    this.addCallback(t => {
      if(this._counter >= this._lines.length){
        t.stop()
        this._isRun = false
        if(this._isDoneCallback !== null) this._isDoneCallback(this)
      }else{
        if(this._isRunnigCallback !== null){
          //to run only once use isRun before update a state
          if(!this.isRun) this._isRunnigCallback(this)
        }
        this._isRun = true
        this._counter = this._loop(this._lines)
        t.exec()
      }
    })
  }

  _initGlobal(){}

  setLines(lines){
    this._lines = lines
  }

  _loop(lines,startLine){
    let i = startLine
    let stopIn = startLine + this._atOnce
    if(stopIn > lines.length) stopIn = lines.length
    
    for(;i < stopIn;i++){
      if(this._blockCallback !== null) this._blockCallback(lines[i],i,lines)
    }
    return stopIn
  }

  run(){
    this.stop()
    this.start()
  }

  setBlockCallback(blockCallback){
    this._blockCallback = blockCallback
  }

  onRunningCallback(isRunnigCallback){
    this._isRunnigCallback = isRunnigCallback
  }

  onDoneCallback(isDoneCallback){
    this._isDoneCallback = isDoneCallback
  }
}









