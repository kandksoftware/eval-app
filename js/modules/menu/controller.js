'use strict'

class MenuController extends App{
	constructor(){
    super()
    this._UIcomponent = new MenuComponent()
    this._UIcomponent.refresh()
    
    this._UIcomponent.attach(MenuComponent.VIEW_ID(),o => {
      switch(o.event.name){
        case Component.ONCLICK():
          if(typeof o.element.dataset.id !== 'undefined'){
            switch(o.element.dataset.id){
              case MenuComponent.SETTINGS_BUTTON():
                new SettingsController()
              break
              case Component.RETURN_BUTTON():
                new EvalController()
              break
            }
          }
        break
      }
    })
  }
}
