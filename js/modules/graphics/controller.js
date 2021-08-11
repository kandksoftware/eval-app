'use strict'

class GraphicsController extends App{
	constructor(){
    super()
    this._UIcomponent = new GraphicsComponent()
    this._UIcomponent.refresh()
    this._UIcomponent.attach(Component.VIEW_ID(),o => {
      switch(o.event.name){
        case 'onclick':
          if(typeof o.element.dataset.id !== 'undefined'){
            switch(o.element.dataset.id){
              case 'back':
                new EvalController()
              break
            }
          }
        break
      }
    })
  }
}
