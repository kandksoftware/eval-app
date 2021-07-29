'use strict'

class ResultCollector extends Observer{
  constructor(){
    super()
    this._array = []
  }

  set add(o){
    this._array.push(o)
    this.notify(ResultCollector.UPDATE())
  }

  getResults(){
    return this._array.slice(0)
  }
}