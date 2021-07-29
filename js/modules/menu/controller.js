'use strict'

class MenuController extends App{
	constructor(){
    super()
    this._UIcomponent = new MenuComponent()
    this._UIcomponent.refresh()
    
    this._UIcomponent.attach(MenuComponent.VIEW_ID(),o => {
      switch(o.event.name){
        case 'onclick':
          if(typeof o.element.dataset.id !== 'undefined'){
            switch(o.element.dataset.id){
              case 'settings':
                new SettingsController()
              break
              case 'main':
                new EvalController()
              break
            }
          }
        break
      }
    })
  }
}
