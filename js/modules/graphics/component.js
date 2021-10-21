'use stricy'

class GraphicsComponent extends SuperComponent{
  constructor(variables){
    super()
    this._viewId = $('diagram')
    this._variables = variables
  }

  static VIEW_ID(){
    return 'graphics'
  }

  render(){
    this._viewId.innerHTML = `<div class="${ Component.GROUP() }" id="${ Component.VIEW_ID() }">
                                ${ this._diagramTemplate() }
                              </div>`
  }

  _diagramTemplate(){
    return `<div class="diagram">
              <h3 class="diagram__title">Diagram</h3>
              <div class="diagram__bars">
                ${ this._renderDiagram() }
              </div>
              <div class="card__btns card__btns--to-right">
                <button data-id="close" class="btn btn--color-stand ${ Component.ONCLICK() }">Close</button>
              </div>
            </div>
            <div class="overlay"></div>`
  }

  _calcPercent(variable){
    const maxDiagValue = this._variables.find(v => ['max_diagram'])
    if(typeof maxDiagValue !== 'undefined'){
      const max = +maxDiagValue.value
      let value = +variable.value > max ? max : +variable.value
      return (value * 100) / max
    }
    return 0
  }
  
  _renderDiagram(){
    return this._variables.filter(v => !['max_diagram'].includes(Variables.getVariableFromScope(v.name))).map(v => {
      return `<div class="diagram__bar diagram--red" style="width:${ this._calcPercent(v) }%">${ Variables.getVariableFromScope(v.name) + ' - ' + v.value }</div>`
    }).join('')
  }
}