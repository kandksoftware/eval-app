'use strict'

class Component extends Observer{
	constructor(){
    super()
    this._cg = new Config()
    this._config = this._cg.get()
    this._viewId = $('app')
  }
  
  static VIEW_ID(){
    return 'component'
  }

	_dynamicGrouplistener(o){
    const group = [...this._viewId.getElementsByClassName('group')]
    group.forEach(g => {
      const elements = [...g.getElementsByClassName(o.name)]
      elements.forEach(element => {
        element.addEventListener(o.event,(e) => {
          this.notify(g.id,{
            element:element,
            event:o,
            e:e,
          })
        })
      })
    })
  }

  _addListeners(){
    [{
      name:'onclick',
      event:'click'
    },{
      name:'onmauseover',
      event:'mouseover'
    },{
      name:'onkeyup',
      event:'keyup'
    },{
      name:'onchange',
      event:'change'
    },{
      name:'onpaste',
      event:'paste'
    },{
      name:'oninput',
      event:'input'
    }].forEach(l => this._dynamicGrouplistener(l))
  }
  
  refresh(){
    this.render()
    this._addListeners()
  }

  renderOption(o,selected = ''){
    let ns = ''
    for(let i = 0,l = o.length;i < l;i++){
      ns += selected === o[i].id ? `<option selected value="${o[i].id}">${ o[i].name }</option>` : `<option value="${o[i].id}">${ o[i].name }</option>`
    }
    return ns
  }

  getInputs(callback){
    const inputs = this._viewId.getElementsByClassName('get')
    for(let i = 0,l = inputs.length;i < l;i++){
      callback(inputs[i],i,inputs)
    }
  }

  getDataValueFrom(id){
    const o = {}
    const elem = [...$(id).getElementsByClassName('get')]
    elem.forEach(e => {
      if(e.value.length === 0) o[e.dataset.id] = e.value
      else o[e.dataset.id] = isNaN(e.value) ? e.value : +e.value
    })
    return o
  }

  setDataValueTo(id,data){
    const elem = [...$(id).getElementsByClassName('set')]
    elem.forEach(e => {
      e.value = data[e.dataset.id]
    })
  }

  template(str){
    return stringCleaner(str)
  }
}