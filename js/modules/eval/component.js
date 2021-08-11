'use stricy'
//check if the formulas ar parcelable
//add multiple line parsening
//add variables
//add diagrams
class EvalComponent extends SuperComponent{
  constructor(){
    super()
  }

  render(){
    this._viewId.innerHTML = `<div class="group" id="${ Component.VIEW_ID() }">
                                ${ this._config.results.map((r,i) => this._resultTemplate(r,i)).join('') }
                                <div class="card card--entry">
                                  <div class="card__btns card__btns--overflow-horizontal">${ clearTags(this._buttonsTemplate(this._config)) }
                                  </div>
                                  <label class="card__feature-name">Operators</label>
                                  <div class="card__btns card__btns--overflow-horizontal">${ this._operatorsTemplate(this._config.operators) }
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
                                  <textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="card__tr card--input get set onkeyup onpaste onclick" data-id="formula_entry" placeHolder="Insert your formula here...">${ this._config.textarea.default }</textarea>
                                  <div class="btn-cont btn-cont--to-right">
                                    <button class="btn btn--color-stand onclick" data-id="backward">&#8592;</button>
                                    <button class="btn btn--color-stand onclick" data-id="forward">&#8594;</button>
                                    <button class="btn btn--color-stand onclick" data-id="exec">Calculate</button>
                                    <button class="btn btn--color-warn onclick" data-id="clear">Clear</button>
                                  </div>
                                </div>
                              </div>`
  }

  _evalFilter(t){
    if(this._config.showEval) return t.type !== 'final'
    else return t.type === 'final'
  }

  _resultTemplate(result,number){
    return `<div class="entry__outcome">
              <div class="card tree-highlighter ${ result.selected ? 'entry--selected' : ''} id="parse-tree">
                <div class="entry__tool-box">
                  <div class="card__number">${ number + 1}</div>
                  <div class="entry__btns">
                    <button class="onclick" data-selectid="${ number }">&#10003;</button>
                    <button class="onclick entry__btns--warn" data-deleteid="${ number }">-</button>
                  </div>
                </div>
                ${ result.tree.filter(t => this._evalFilter(t)).map((o,i) => `<span class="ev-line"><span class="op-n">${ i + 1 }</span>${ makeSpace(i) + o.mess + `<span class="loc ${ !this._config.showLabel ? 'hide' : ''}">` + o.loc + `</span>`}</span>`).join('') }
              </div>
            </div>`
  }

  _buttonsTemplate(config){
    return `<button class="btn btn--color-stand-inv onclick btn--marg-right" data-id="mode">${ config.modeDeg ? 'Deg' : 'Rad'}</button>
            <button class="btn btn--color-stand-inv onclick btn--marg-right" data-id="config">Add</button>
            <button class="btn ${ config.showLabel ? 'btn--color-warn-inv' : 'btn--color-stand-inv'} onclick btn--marg-right" data-id="label">Label</button>
            <button class="btn ${ config.showEval ? 'btn--color-warn-inv' : 'btn--color-stand-inv'} onclick btn--marg-right" data-id="eval">Eval</button>
            <button class="btn btn--color-stand-inv onclick btn--marg-right" data-id="file">File</button>
            <button class="btn btn--color-warn-inv onclick btn--marg-right" data-id="c-h">Clear history</button>`
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

  _operatorsTemplate(oper){
    if(oper.length !== 0){
      return oper.map(o => `<button class="btn btn--color-stand onclick btn--marg-right" data-operid="${ o }">${ o }</button>`).join('')
    }
    return this._emptyTemplate()
  }

  _emptyTemplate(){
    return `<span>Still empty!</span>`
  }
}