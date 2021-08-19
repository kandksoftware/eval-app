'use strict'

class Config extends Observer{
  constructor(){
    super()
    this._KEY = 'eval1.0.0'
    this._data = {}
    this._setttings = {
      init:true,
      modeDeg:true,//id true = deg, false = rad
      variables:[],
      inBuildFunction:[],
      inBuildConstants:[],
      operators:['%','√','∛','^','‰','*','/','×','÷','MOD','**','+','-','AND','OR','XOR'],
      customFunctions:[],
      queue:[],//view queue
      textarea:{
        default:'print 88.3+6*88*tan(8)*(tan(tan(ln(sin(23)))))',
        caret:0,
      },
      showLabel:true,
      showEval:true,
      backup:{
        array:[],
        cursor:0
      },
      scope:'',
      libs:[],//extensions such as:diagram, object
      autocomplete:[]
    }

    if(localStorage.getItem(this._KEY) === 'null' || localStorage.getItem(this._KEY) === null) localStorage.setItem(this._KEY,JSON.stringify(this._setttings))
    
    if(localStorage.getItem(this._KEY) !== 'null' || localStorage.getItem(this._KEY) !== null) this._data = JSON.parse(localStorage.getItem(this._KEY))
    
    /* make a singleton*/
    if (!Config._instance) {
      Config._instance = this
    }
    return Config._instance
  }

  get(){
    return this._data
  }

  restore(){
    localStorage.setItem(this._KEY,'null')
  }

  save(listen = true){
    localStorage.setItem(this._KEY,JSON.stringify(this._data))
    if(listen) this.notify(Observer.UPDATE())
  }
}






