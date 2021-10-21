'use strict'

class Interpreter{
  constructor(config){
    this._config = config
    this._init()
  }

  _init(){
    this._line = {line:0}
    this._error = new Error()
    this._marker = new Marker()
    this._variables = new Variables(this._config,this._error)
    this._functions = new BuildInFunctions(this._config,this._variables)
  }

  getLine(){
    return this._line.line
  }

  setLine(line){
    this._line.line = line
  }

  incrementLine(){
    this._line.line++
  }

  clear(){
    this._init()
  }

  exec(tokens){
    this._error.setLineNumber(this.getLine())
    new Var().exec(tokens,this._variables,this._functions,this._error,this._marker)
    new Use().exec(tokens,this._variables,this._error)
    new Print().exec(tokens,this._variables,this._functions,this._error,this._marker)
    new Show().exec(tokens,this._variables,this._functions,this._error,this._marker)
    new Close().exec(tokens,this._variables,this._functions,this._error,this._marker)
  }

  getError(){
    return this._error
  }

  getVariableValueByName(name){
    return this._variables.getValueByName(name)
  }

  getVariables(){
    return this._variables
  }

  getMarker(){
    return this._marker.get()
  }
}