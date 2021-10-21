'use stricy'

class MenuComponent extends Component{
  constructor(){
    super()
    this._viewId = $('header')
    this._cg.attach(Observer.UPDATE(),() => this.refresh())
  }

  static VIEW_ID(){
    return 'header'
  }

  static SETTINGS_BUTTON(){
    return 'settings'
  }

  render(){
    this._viewId.innerHTML = `<nav class="nav ${ Component.GROUP() }" id="${ MenuComponent.VIEW_ID() }">
                                <div class="nav__container">
                                  <!--<img class="nav__icon" src="resources/macro-terminal-icon.png" alt="Macro Terminal CNC">-->
                                  <div class="nav__name ${ Component.ONCLICK() }" data-id="${ Component.RETURN_BUTTON() }"></div>
                                </div>
                                <div class="nav__btns">
                                  <img class="${ Component.ONCLICK() }" src="resources/settings.svg" alt="settings" data-id="${ MenuComponent.SETTINGS_BUTTON() }"/>
                                </div>
                              </nav>`
  }
}