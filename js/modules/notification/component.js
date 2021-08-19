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
    this._viewId.innerHTML = `<div class="notif group" id="${ NotificationComponent.VIEW_ID() }">
                                <div class="notif__content">
                                  <h3 class="notif__title ${ this._renderColor() }">Message</h3>
                                  <div class="notif__message">${ this._text }</div>
                                </div>
                                <div class="notif__btns">
                                  <div class="btn btn--color-stand onclick" data-id="close">Close</div>
                                </div>
                              </div>
                              <div class="overlay"></div>`
  }

  _renderColor(){
    switch(this._type){
      case NotificationComponent.WARNING():
        return 'notif__title--warning'
      case NotificationComponent.INFO():
        return 'notif__title--info'
    }
  }

  setText(text){
    this._text = text
  }

  setType(type){
    this._type = type
  }
}