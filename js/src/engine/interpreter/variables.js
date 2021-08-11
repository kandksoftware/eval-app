'use strict'

class Variables{
  constructor(config,error){
    this._variables = []
    this._config = config
    this._error = error
    this._scope = null
    this._type = Variables.NORMAL()
    this._init()
  }

  static NORMAL(){
    return 'global'
  }

  static SEPARATOR(){
    return '.'
  }
  
  _init(){
    this._config.get().variables.forEach(v => this._variables.push(v))
  }

  replaceVariablesByValue(array,marker = null){
    for(let i = 0,l = array.length;i < l;i++){
      const foundVariable = this._variables.find(v => v.name === array[i])
      if(typeof foundVariable !== 'undefined'){
        if(marker) marker.addVariable({
          name:array[i],
          value:foundVariable.value
        })
        array[i] = foundVariable.value
      }
    }
    return array
  }

  _containesVariable(variable){
    return typeof this._variables.find(v => v.name === variable.name) !== 'undefined'
  }

  _updateVariableValue(variable){
    this._variables.forEach((v,i,arr) => {
      if(arr[i].name === variable.name){
        arr[i] = variable
      }
    })
  }

  _isReadOnly(variable){
    return typeof this._config.get().inBuildConstants.find(name => name === variable.name) !== 'undefined'
  }

  add(variable){
    if(this._scope === null){
      variable.name = this._getVariableFromScope(variable.name)
    } 
    else variable.name = this._scope + Variables.SEPARATOR() + variable.name

    variable.type = this._type
    
    if(this._isReadOnly(variable)){
      this._error.add('Read only variable!')
      return 
    }
    if(this._containesVariable(variable)){//update a variable value
      this._updateVariableValue(variable)
    }else{//create a new variable
      this._variables.push(variable)
    }
  }

  getValueByName(name){
    for(let i = 0,l = this._variables.length;i < l;i++){
      if(this._variables[i].name === name) return this._variables[i].value
    }
    return null
  }

  _getScope(str){
    for(let i = str.length;i >= 0;i--){
      if(str.charAt(i) === Variables.SEPARATOR()) return str.slice(0,i)
    }
    return str
  }

  _getVariableFromScope(str){
    for(let i = str.length;i >= 0;i--){
      if(str.charAt(i) === Variables.SEPARATOR()) return str.slice(i + 1)
    }
    return str
  }
  
  getByScope(scope){
    return this._variables.filter(v => this._getScope(v.name) === scope)
  }

  get(){
    return this._variables.slice(0)
  }

  addScope(scope){
    this._scope = scope
  }

  setType(type){
    this._type = type
  }

  removeScope(){
    this._scope = null
  }
}




