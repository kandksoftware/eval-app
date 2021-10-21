'use strict'

class Runner extends FakeThread{
  constructor(str){
    super(50)
    this.setInterval(1)
    this._lines = removeMultipleComments(removeOneLineComments(str)).split('\n')
    this.init()
  }

  init(){
    this.interpreter = new Interpreter(this._config)
    this.addCallback(t => {
      if(this.interpreter.getLine() >= this._lines.length){//done
        t.stop()
        this._isRun = false
        if(this._isDoneCallback !== null) this._isDoneCallback(this)//insert result when is done
      }else{//execute
        if(this._isRunnigCallback !== null){
          //to run only once use isRun before update a state
           this._isRunnigCallback(this)
        }
        this._isRun = true
        this._loop(this._lines)
        t.exec()
      }
    })
  }

  _loop(codelines){
    let limiter = this.interpreter.getLine() + this._atOnce
    let breakApart = 50
    if(limiter > codelines.length) limiter = codelines.length
    
    for(;this.interpreter.getLine() < limiter;){
      const line = this.interpreter.getLine()
      breakApart--
      const rt = new RecursiveTokenizer()
      rt.exec(codelines[line])
      const tokens = rt.get()
      this.interpreter.exec(tokens)
      
      if(this.interpreter.getError().length() !== 0){
        this.interpreter.setLine(this._lines.length)
        break
      }
      this.interpreter.incrementLine()
      if(breakApart === 0) break
    }
  }
}


