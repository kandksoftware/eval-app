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

  render(){
    this._viewId.innerHTML = `<nav class="nav group" id="${ MenuComponent.VIEW_ID() }">
                                <div class="nav__container">
                                  <!--<img class="nav__icon" src="resources/macro-terminal-icon.png" alt="Macro Terminal CNC">-->
                                  <div class="nav__name onclick" data-id="main"></div>
                                </div>
                                <div class="nav__btns">
                                  <img class="onclick" src="resources/settings.svg" alt="settings" data-id="settings"/>
                                </div>
                              </nav>`
  }

  
}