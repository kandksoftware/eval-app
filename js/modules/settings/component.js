'use stricy'

class SettingsComponent extends SuperComponent{
  constructor(){
    super()
  }

  static DAF_BUTTON(){
    return 'daf'
  }

  static DAC_BUTTON(){
    return 'dac'
  }

  static DELETE_HISTORY_BUTTON(){
    return 'dHB'
  }

  static DELETE_ALL_SETTING_BUTTON(){
    return 'dasb'
  }

  render(){
    this._viewId.innerHTML = `<div class="${ Component.GROUP() }" id="${ Component.VIEW_ID() }">
                                ${ this._functionTemplate() }
                                ${ this._constantTemplate() }
                                ${ this._historyTemplate() }
                                ${ this._allSettingsTemplate() }
                                ${ this._backTemplate() }
                              </div>`
  }

  _functionTemplate(){
    return `<div class="card card--entry">
              <h1 class="card__title">Delete all functions</h1>
              <div class="card__btns card__btns--to-right">
                <button data-id="${ SettingsComponent.DAF_BUTTON() }" class="btn btn--color-warn ${ Component.ONCLICK() }">Delete</button>
              </div>
            </div>`
  }

  _constantTemplate(){
    return `<div class="card card--entry">
              <h1 class="card__title">Delete all constants</h1>
              <div class="card__btns card__btns--to-right">
                <button data-id="${ SettingsComponent.DAC_BUTTON() }" class="btn btn--color-warn ${ Component.ONCLICK() }">Delete</button>
              </div>
            </div>`
  }

  _historyTemplate(){
    return `<div class="card card--entry">
              <h1 class="card__title">Delete history</h1>
              <div class="card__btns card__btns--to-right">
                <button data-id="${ SettingsComponent.DELETE_HISTORY_BUTTON() }" class="btn btn--color-warn ${ Component.ONCLICK() }">Delete</button>
              </div>
            </div>`
  }

  _allSettingsTemplate(){
    return `<div class="card card--entry">
              <h1 class="card__title">Delete all settings</h1>
              <div class="card__btns card__btns--to-right">
                <button data-id="${ SettingsComponent.DELETE_ALL_SETTING_BUTTON() }" class="btn btn--color-warn ${ Component.ONCLICK() }">Delete</button>
              </div>
            </div>`
  }

  _backTemplate(){
    return `<div class="card card--entry">
              <div class="card__btns card__btns--to-left">
                <button data-id="${ Component.RETURN_BUTTON() }" class="btn btn--color-stand ${ Component.ONCLICK() }">Back</button>
              </div>
            </div>`
  }
}