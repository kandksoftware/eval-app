'use strict'

class FakeThread extends Timer{
  constructor(cycleLength = 20){
    super()
    this.cg = new Config()
    this.config = this.cg.get()
    this.setInterval(0)
    this.cycleLength = cycleLength
    this.reset()
    this.init()
  }

  reset(){
    this.lines = []
    this.counter = 0
    this.blockCallback = null
    this.isRunnigCallback = null
    this.isDoneCallback = null
    this.isRun = false
  }

  init(){
    this.addCallback(t => {
      if(this.counter >= this.lines.length){
        t.stop()
        this.isRun = false
        if(this.isDoneCallback !== null) this.isDoneCallback()
      }else{
        if(this.isRunnigCallback !== null){
          //to run only once use isRun before update a state
          if(!this.isRun) this.isRunnigCallback()
        }
        this.isRun = true
        this.counter = this.loop(this.lines,this.counter)
        t.exec()
      }
    })
  }

  setLines(lines){
    this.lines = lines
  }

  loop(lines,startLine){
    let i = startLine
    let stopIn = startLine + this.cycleLength
    if(stopIn > lines.length) stopIn = lines.length
    
    for(;i < stopIn;i++){
      if(this.blockCallback !== null) this.blockCallback(lines[i],i,lines)
    }
    return stopIn
  }

  run(){
    this.stop()
    this.start()
  }

  setBlockCallback(blockCallback){
    this.blockCallback = blockCallback
  }

  onRunningCallback(isRunnigCallback){
    this.isRunnigCallback = isRunnigCallback
  }

  onDoneCallback(isDoneCallback){
    this.isDoneCallback = isDoneCallback
  }
}





