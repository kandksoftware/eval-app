'use strict'

class Autocomplete{
  constructor(config){
    this._init(config)
  }
  
  _init(config){
    this._config = config
    this._operators = this._config.operators
    this._operators.push('(')
    this._operators.push(' ')
  }
  
  exec(cl,str){
    for(let i = str.slice(0,cl).length;i >= 0;i--){
      if(this._operators.includes(str.charAt(i))){
       return this._remove(str.slice(i + 1,cl))
      } 
    }
    return str.slice(0,cl)
  }

  getFiltered(array,str){
    return array.filter(cf => cf.toLowerCase().indexOf(str.toLowerCase()) === 0)
  }

  _remove(str){
    for(let i = str.length;i >= 0;i--){
      if(str.charAt(i) === '\n'){
        return str.slice(i + 1)
      } 
    }
    return str
  }
}