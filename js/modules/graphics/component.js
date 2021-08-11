'use stricy'

class GraphicsComponent extends SuperComponent{
  constructor(){
    super()
  }

  render(){
    this._viewId.innerHTML = `<div class="group" id="${ Component.VIEW_ID() }">
                                ${ this._diagramTemplate() }
                              </div>`
  }

  _diagramTemplate(){
    return `<div class="card card--entry">
              <h1 class="card__title">Diagram</h1>
              <div class="diagram">
                <div class="diagram__bar diagram--red diagram--80">Days</div>
                <div class="diagram__bar diagram--black diagram--90">Monts</div>
                <div class="diagram__bar diagram--green diagram--3">Something</div>
                <div class="diagram__bar diagram--orange diagram--40">Something</div>
              </div>
              <div class="card__btns card__btns--to-right">
                <button data-id="back" class="btn btn--color-stand onclick">Back</button>
                <button data-id="import" class="btn btn--color-stand onclick">Import</button>
              </div>
            </div>`
  }
}