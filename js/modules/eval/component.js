'use stricy'

class EvalComponent extends SuperComponent{
  constructor(){
    super()
  }

  render(){
    this._viewId.innerHTML = `${ this._config.results.map(r => this._resultTemplate(r)).join('') }
                              <section class="card card--entry group" id="${ Component.VIEW_ID() }">
                                <div class="btn-cont btn-cont--marg-bottom">
                                  ${ this._buttonsTemplate(this._config.modeDeg) }
                                </div>
                                <label class="card__feature-name">Build-in f(x)</label>
                                <div class="card__btns card__btns--overflow-horizontal">${ this._functionTemplate(this._config.inBuildFunction.map(f => { return {name:f,args:['x']}})) }
                                </div>
                                <label class="card__feature-name">Custom f(x)</label>
                                <div class="card__btns card__btns--overflow-horizontal">${ this._functionTemplate(this._config.customFunctions) }
                                </div>
                                <label class="card__feature-name">Const</label>
                                <div class="card__btns card__btns--overflow-horizontal">${ this._constantTemplate(this._config.variables) }
                                </div>
                                <textarea class="card__tr get set onkeyup onpaste" data-id="formula_entry" placeHolder="Insert your formula here...">${ this._config.textarea }</textarea>
                                <div class="btn-cont btn-cont--to-right">
                                  <button class="btn btn--color-stand onclick" data-id="exec">Calculate</button>
                                  <button class="btn btn--color-warn onclick" data-id="clear">Clear</button>
                                </div>
                              </section>`
  }

  _resultTemplate(result){
    return `<section class="entry__outcome">
              <div class="card tree-highlighter" id="parse-tree">
                ${ result.map(({op,mess}) => `<span class="ev-line"><span class="op-n">${ op }</span>${ makeSpace(op) + mess }</span>`).join('') }
              </div>
            </section>`
  }

  _buttonsTemplate(mode = true){
    return `<button class="btn btn--color-stand-inv onclick" data-id="mode">${ mode ? 'Deg' : 'Rad'}</button>
            <button class="btn btn--color-stand-inv onclick" data-id="config">Add</button>
            <button class="btn btn--color-warn-inv onclick" data-id="c-h">Clear history</button>`
  }

  _functionTemplate(functions){
    if(functions.length !== 0){
      return functions.map(cf => `<button class="btn btn--color-stand onclick btn--marg-right" data-funid="${ COMPOSE_FUNCTION_ID(cf) }">${ COMPOSE_FUNCTION_ID(cf) }</button>`).join('')
    }
    return this._emptyTemplate()
  }

  _constantTemplate(variables){
    if(variables.length !== 0){
      return variables.map(({name}) => `<button class="btn btn--color-stand onclick btn--marg-right" data-varid="${ name }">${ name }</button>`).join('')
    }
    return this._emptyTemplate()
  }

  _emptyTemplate(){
    return `<span>Still empty!</span>`
  }
}