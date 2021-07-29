'use strict'

class Config extends Observer{
  constructor(){
    super()
    this._KEY = 'eval1.0.0'
    this._data = {}
    this._setttings = {
      modeDeg:true,//id true = deg, false = rad
      variables:[{
        name:'PI',
        value:Math.PI
      },{
        name:'E',
        value:Math.E
      },{
        name:'TRUE',
        value:1
      },{
        name:'FALSE',
        value:0
      }],
      inBuildFunction:[
        'tanh',
        'sinh',
        'cosh',
        'atan',
        'asin',
        'acos',
        'atanh',
        'asinh',
        'acosh',
        'cos',
        'sin',
        'tan',
        'abs',
        'round',
        'ln',
        'log',
        'exp',
      ],
      inBuildConstants:[
        'PI',
        'E',
        'TRUE',
        'FALSE'
      ],
      customFunctions:[],
      results:[],
      textarea:'88.3+6*88*tan(8)*(tan(tan(ln(sin(23)))))',
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






