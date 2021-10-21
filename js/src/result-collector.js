'use strict'

class ResultManager extends Observer{
  constructor(array = [],limit = ResultManager.STANDARD_LIMIT()){
    super()
    this._limit = limit
    this._array = array
  }

  static STANDARD_LIMIT(){
    return 5
  }

  add(o){
    if(!this._array.includes(o)){
      if(this._array.length <= this._limit){
        this._array.push(o)
      }else{
        this._array = this._array.slice(1) 
        this._array.push(o)
      }
      this.notify(ResultManager.UPDATE())
    }
  }

  get(){
    return this._array.slice(0)
  }

  getLast(){
    return this._array.slice(this._array.length - 1)
  }
}