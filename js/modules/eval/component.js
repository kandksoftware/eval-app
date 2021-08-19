'use stricy'

class EvalComponent extends SuperComponent{
  constructor(){
    super()
  }

  static TEXTAREA_ID(){
    return 'formula_entry'
  }

  render(){
    this._viewId.innerHTML = `<div class="group" id="${ Component.VIEW_ID() }">
                                ${ this._config.queue.map((o,i) => this._queueTemplate(o,i)).join('') }
                                <div class="card card--entry">
                                  <div class="card__btns card__btns--overflow-horizontal">${ clearTags(this._buttonsTemplate(this._config)) }
                                  </div>
                                  <input class="card__input get onkeyup" type="text" data-id="a-c" placeHolder="Insert function name here"/>
                                  <div id="a-f" class="a-f">
                                    <div class="a-f__start">${ this._emptyTemplate() }</div>
                                  </div>
                                  <textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="card__tr card--input get set onkeyup onpaste onclick" data-id="${ EvalComponent.TEXTAREA_ID() }" id="${ EvalComponent.TEXTAREA_ID() }" placeHolder="Insert your formula here...">${ this._config.textarea.default }</textarea>
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

  _queueTemplate(o,number){
    return `<div class="entry__outcome">
              <div class="card ${ o.selected ? 'entry--selected' : ''} id="parse-tree">
                <div class="entry__tool-box">
                  <div class="card__number">${ number + 1}</div>
                  <div class="entry__btns">
                    <button class="onclick" data-selectid="${ number }">Select</button>
                    <button class="onclick entry__btns--warn" data-deleteid="${ number }">Delete</button>
                  </div>
                </div>
                <div class="entry__seperator"></div>
                ${ o.type === 0 ? this._treeTemplate(o) : this._diagramTemplate(o) }
              </div>
            </div>`
  }

  _treeTemplate(o){
    return `<div class="entry__print tree-highlighter">
              ${ o.tree.filter(t => this._evalFilter(t)).map((o,i) => `<span class="ev-line"><span class="op-n">${ i + 1 }</span>${ makeSpace(i) + o.mess + `<span class="loc ${ !this._config.showLabel ? 'hide' : ''}">` + o.loc + `</span>`}</span>`).join('') }
            </div>`
  }

  _diagramTemplate(o){
    return `<div class="diagram">
              <h3 class="diagram__title">${ Variables.convertToJSString(Variables.getVariableValueFromArray(o.variables,'@title','Diagram')) }</h3>
              <div class="diagram__bars">
                ${ this._renderDiagram(o.variables) }
              </div>
            </div>`
  }
  
  _renderDiagram(variables){
    const maxDiagValue = variables.find(v => v.name === '@maxValue')
    if(typeof maxDiagValue !== 'undefined'){
      return variables.filter(v => v.name[0] !== '@').map(v => {
        return `<div class="diagram__bar-trail">
                  <div class="diagram__bar diagram--red" style="width:${ MArray.percentage(+maxDiagValue.value,+v.value) }%"></div>
                  <div class="diagram__desc">${ v.name + ' - ' + v.value }</div>
                </div>`
      }).join('')
    }else{
      return `Max value no found!`
    }
  }

  _buttonsTemplate(config){
    return `<button class="btn btn--color-stand-inv onclick btn--marg-right" data-id="mode">${ config.modeDeg ? 'Deg' : 'Rad'}</button>
            <button class="btn btn--color-stand-inv onclick btn--marg-right" data-id="config">Add</button>
            <button class="btn ${ config.showLabel ? 'btn--color-warn-inv' : 'btn--color-stand-inv'} onclick btn--marg-right" data-id="label">Label</button>
            <button class="btn ${ config.showEval ? 'btn--color-warn-inv' : 'btn--color-stand-inv'} onclick btn--marg-right" data-id="eval">Eval</button>
            <button class="btn btn--color-stand-inv onclick btn--marg-right" data-id="file">File</button>
            <button class="btn btn--color-stand-inv onclick btn--marg-right" data-id="templates">Templates</button>
            <button class="btn btn--color-warn-inv onclick btn--marg-right" data-id="c-h">Clear history</button>`
  }

  _emptyTemplate(){
    return `<span>Still empty!</span>`
  }
}