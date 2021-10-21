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
    const s = this._removeMultipleWhitespace(this._convert(str)).trim()
    for(let i = s.slice(0,cl).length - 1;i >= 0;i--){
      if(this._operators.includes(s.charAt(i))){
        return this._remove(s.slice(i + 1,cl))
      } 
    }
    return s.slice(0,cl)
  }

  getFiltered(array,str){
    return array.filter(cf => cf.toLowerCase().indexOf(str.toLowerCase()) === 0)
  }

  _convert(str){
    let ns = ''
    for(let i = 0,l = str.length;i < l;i++){
      ns += str.charAt(i) === '\n' ? ' ' : str.charAt(i)
    }
    return ns
  }

  _removeMultipleWhitespace(str){
    let ns = ''
    for(let i = 0,l = str.length;i < l;i++){
      if(str.charAt(i) !== ' ' || str.charAt(i) === ' ' && str.charAt(i - 1)){
        ns += str.charAt(i)
      }
    }
    return ns
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