'use stricy'

class NotificationComponent extends Component{
  constructor(){
    super()
    this._text = 'Default text'
    this._type = NotificationComponent.WARNING()
    this._viewId = $('notification')
  }

  static VIEW_ID(){
    return 'n-v'
  }

  static WARNING(){
    return 0
  }

  static INFO(){
    return 1
  }

  render(){
    this._viewId.innerHTML = `<div class="notif ${ this._renderColor() } group" id="${ NotificationComponent.VIEW_ID() }">
                                <div class="notif__message">${ this._text }</div>
                                <div class="notif__btn onclick" data-id="close">&#10005;</div>
                              </div>`
  }

  _renderColor(){
    switch(this._type){
      case NotificationComponent.WARNING():
        return 'notif--warning'
      case NotificationComponent.INFO():
        return 'notif--info'
    }
  }

  show(){
    this._viewId.classList.remove('hide')
  }

  hide(){
    this._viewId.classList.add('hide')
  }

  setText(text){
    this._text = text
  }

  setType(type){
    this._type = type
  }
}