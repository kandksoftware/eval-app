'use strict'

class Variables{
  constructor(config,error){
    this._variables = []
    this._config = config
    this._error = error
    this._scope = new Path()
    this._init()
  }

  static NULL(){
    return 0
  }

  static NUMBER(){
    return 1
  }

  static STRING(){
    return 2
  }

  static OBJECT(){
    return 3
  }

  static HIDDEN(){
    return 4
  }

  static typeof(str){
    if(!isNaN(str)) return Variables.NUMBER()
    else if(str[0] === '@') return Variables.HIDDEN()
    else if(str[0] === '\'' && str[str.length - 1] === '\'' || typeof str === 'string' && str !== 'null') return Variables.STRING()
    else if(str === 'null') return Variables.NULL()
  }

  static convertToJSString(str){
    if(str[0] === '\'' && str[str.length - 1] === '\'') return str.slice(1,str.length - 1)
    else return str
  }

  static retractVariable(str){
    for(let i = str.length;i >= 0;i--){
      if(str.charAt(i) === Path.SEPARATOR()) return str.slice(i + 1)
    }
    return str
  }

  _match(e,v){
    const path = Path.getDirectory(v.name)
    if(path.length === 0) return e.name === v.name && e.scope === this.getScope()
    else return e.name === Variables.retractVariable(v.name) && e.scope === path
  }
  
  _init(){
    this._config.variables.forEach(v => this._variables.push(v))
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

  replaceVariableByValue(name){
    for(let i = 0,l = this._variables.length;i < l;i++){
      if(this._match(this._variables[i],{name})){
        if(this._variables[i].type === Variables.STRING()) return this._variables[i].value.slice(1,this._variables[i].value.length - 1)
        else return this._variables[i].value
      }
    }
    return name
  }

  _containesVariable(variable){
    return typeof this._variables.find(v => this._match(v,variable)) !== 'undefined'
  }

  _updateVariableValue(variable){
    this._variables.forEach((v,i,arr) => {
      if(this._match(arr[i],variable)){
        arr[i] = variable
      }
    })
  }

  _isReadOnly(variable){
    return typeof this._config.inBuildConstants.find(name => name === variable.name) !== 'undefined'
  }

  add(variable){
    if(this._isReadOnly(variable)){
      this._error.add('Read only variable!')
      return 
    }
    variable.scope = this.getScope()
    if(this._containesVariable(variable)){//update a variable value
      this._updateVariableValue(variable)
    }else{//create a new variable
      this._variables.push(variable)
    }
  }

  getVariableByName(name){
    for(let i = 0,l = this._variables.length;i < l;i++){
      if(this._match(this._variables[i],{name:name})) return this._variables[i]
    }
    return null
  }

  getValueByName(name){
    for(let i = 0,l = this._variables.length;i < l;i++){
      if(this._variables[i].name === name) return this._variables[i].value
    }
    return null
  }
  
  get(){
    return this._variables.slice(0)
  }

  setScope(name){
    this._scope.add(name)
  }

  removeScope(){
    this._scope.removePath()
  }

  getScope(){
    return this._scope.getAbsolutePath()
  }

  getByScope(scope,system = true){
    if(!system) return this._variables.filter(v => v.scope === scope && Variables.typeof(v.name) !== Variables.HIDDEN())
    else return this._variables.filter(v => v.scope === scope)
  }

  static getVariableValueFromArray(array,name,defaultValue){
    const f = array.find(v => v.name === name)
    if(typeof f === 'undefined') return defaultValue
    return f.value
  }
}




