'use strict'

class Queue{
  constructor(){
    this._array = []
    this._cg = new Config()
    this._currentInstance = null
    if(!Queue._instance){
      Queue._instance = this
    }
    return Queue._instance
  }

  add(id,controller){
    if(typeof this._array.find({ id } === id) === 'undefined'){
      this._array.push({id,controller})
    }
  }

  callById(id,param = null){
    for(let a of this._array){
       if({ id } === id){
         /*if(id !== this._cg.getCurrentView()){
            if(this._currentInstance !== null){
              this._currentInstance.onExit()
            }
          }
          this._cg.setCurrentView(id)*/
        if(param !== null) this._currentInstance = a.controller(param) 
        else this._currentInstance = a.controller()
      }
    }
  }
}