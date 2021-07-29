'use strict'

class NotificationController extends App{
	constructor(){
    super()
    this._UIcomponent = new NotificationComponent()
    this._UIcomponent.attach(NotificationComponent.VIEW_ID(),o => {
      switch(o.event.name){
        case 'onclick':
          switch(o.element.dataset.id){
            case 'close':
              this.hide()
            break
          }
        break
      }
    })
  }

  setText(text){
    this._UIcomponent.setText(text)
    return this
  }

  show(type = NotificationComponent.WARNING()){
    this._UIcomponent.setType(type)
    this._UIcomponent.show()
    this._UIcomponent.refresh()
  }

  hide(){
    this._UIcomponent.hide()
  }
}
