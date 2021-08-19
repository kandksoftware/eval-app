'use strict'

class GraphicsController extends App{
	constructor(variables){
    super()
    this._variables = variables
    this._UIcomponent = new GraphicsComponent(this._variables)
    this._UIcomponent.refresh()
    this._UIcomponent.attach(Component.VIEW_ID(),o => {
      switch(o.event.name){
        case 'onclick':
          if(typeof o.element.dataset.id !== 'undefined'){
            switch(o.element.dataset.id){
              case 'close':
                this.hide()
                new EvalController()
              break
            }
          }
        break
      }
    })
  }

  hide(){
    this._UIcomponent.hide()
  }

  show(){
    this._UIcomponent.show()
  }
}
