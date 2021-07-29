'use stricy'

class SettingsComponent extends SuperComponent{
  constructor(){
    super()
  }

  render(){
    this._viewId.innerHTML = `<div class="group" id="${ Component.VIEW_ID() }">
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
                <button data-id="delete-all-functions" class="btn btn--color-warn onclick">Delete</button>
              </div>
            </div>`
  }

  _constantTemplate(){
    return `<div class="card card--entry">
              <h1 class="card__title">Delete all constants</h1>
              <div class="card__btns card__btns--to-right">
                <button data-id="delete-all-constants" class="btn btn--color-warn onclick">Delete</button>
              </div>
            </div>`
  }

  _historyTemplate(){
    return `<div class="card card--entry">
              <h1 class="card__title">Delete history</h1>
              <div class="card__btns card__btns--to-right">
                <button data-id="delete-history" class="btn btn--color-warn onclick">Delete</button>
              </div>
            </div>`
  }

  _allSettingsTemplate(){
    return `<div class="card card--entry">
              <h1 class="card__title">Delete all settings</h1>
              <div class="card__btns card__btns--to-right">
                <button data-id="delete-all-settings" class="btn btn--color-warn onclick">Delete</button>
              </div>
            </div>`
  }

  _backTemplate(){
    return `<div class="card card--entry">
              <div class="card__btns card__btns--to-left">
                <button data-id="back" class="btn btn--color-stand onclick">Back</button>
              </div>
            </div>`
  }
}