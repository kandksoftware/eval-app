'use strict'

class Interpreter{
  constructor(){
    this._init()
  }

  _init(){
    this._config = new Config()
    this._error = new Error()
    this._marker = new Marker()
    this._functions = new BuildInFunctions(this._config)
    this._variables = new Variables(this._config,this._error)
  }

  clear(){
    this._init()
  }

  exec(tokens,ln){
    this._error.setLineNumber(ln)
    new Var().exec(tokens,this._variables,this._functions,this._error,this._marker)
    new Use().exec(tokens,this._variables,this._error)
    new Print().exec(tokens,this._variables,this._functions,this._error,this._marker)
    new Show().exec(tokens,this._variables,this._functions,this._error,this._marker)
    new Close().exec(tokens,this._variables,this._functions,this._error,this._marker)
  }

  getErrorMess(){
    return this._error.get()
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

class Runner{
  constructor(){
    this._interpreter = new Interpreter()
    this._xs = new XString()
  }

  exec(str,callbackError){
    const flow = removeOneLineComments(str)
    const lines = flow.split('\n')
    for(let i = 0,l = lines.length;i < l;i++){
      const tokens = this._xs.removeWhiteSpace(this._xs.spacer(lines[i])).trim().split(' ')
      this._interpreter.exec(tokens,i)
      if(this._interpreter.getErrorMess().length !== 0){
        this._interpreter.getErrorMess().forEach(e => callbackError(e))
        break
      }
    }
    //console.log(this._interpreter.getVariables().getByScope('diagram'))
    //console.log(this._interpreter.getVariableValueByName('february'))
    //console.log(this._interpreter.getVariables().get())
    //console.log(this._interpreter._marker.get())
  }

  getVariables(){
    return this._interpreter.getVariables()
  }

  getMarker(){
    return this._interpreter.getMarker()
  }

  getErrorMess(){
    return this._interpreter.getErrorMess()
  }
}


