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

class RotateFeature extends FakeThread{
  constructor(){
    super(40)
    this.x = 0
    this.y = 0
    this.i = 0
    this.j = 0
    this.setBlockCallback(lines => {
      let tokens = lines.split(' ')
      tokens = tokens.map(token => {
        console.log(token)
        if(token.length > 1){
          const key = token[0] 
          const value = token.slice(1)
          switch(key){
            case 'X':
              this.x = value
            break
            case 'Y':
              this.y = value
            break
            case 'I':
              this.i = value
            break
            case 'J':
              this.j = value
            break
          }

          const r = rotate(this.x,this.y,45)
          const r2 = rotate(this.i,this.j,45)

          if(key === 'X') return 'X'+ r.x
          else if(key === 'Y') return 'Y'+ r.y
          else if(key === 'I') return 'I'+ r2.x
          else if(key === 'J') return 'J'+ r2.y
          
          return token
        }else{
          return token
        }
      })

      console.log(tokens)
    })
  }
}



