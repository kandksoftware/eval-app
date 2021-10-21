'use strict'

class Calculator{
  constructor(fullMode = true){
    this._fullMode = fullMode//in the full mode, replace variables to their values
    this._cg = new Config()
    this._config = this._cg.get()
    this._error = new Error()
    this._marker = new Marker()
    this._variables = new Variables(this._config)
    this._functions = new BuildInFunctions(this._cg)//?
    this._parser = new Parser(
      this._functions.get(),
      this._config.customFunctions,
      this._variables,
      this._error,
      this._marker
    )
  }

  prepare(str){
    const xs = new XString()
    const array = xs.removeWhiteSpace(xs.spacer(str)).trim().split(' ')
    return this._fullMode ? this._variables.replaceVariablesByValue(array) : array
  }

  exec(str){
    const r = this._parser.exec(this.prepare(str))
    
    return {
      results:this._marker,
      error:this._error,
      result:r
    }
  }
}