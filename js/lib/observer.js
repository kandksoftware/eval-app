'use strict'

class Observer{
  constructor(){
    this.events = []
  }

  static UPDATE(){
    return 0
  }
  
  attach(evt, listener){
    this.events.push({
      evt,
      listener
    })
  }
  
  notify(evt, arg){
    for(let e of this.events){
      if(e['evt'] === evt) e['listener'](arg)
    }
  }

  removeObserver(evt){
    this.events = this.events.filter(e => e.evt !== evt)
  }
}