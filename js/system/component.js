'use strict'

class Component extends Observer{
	constructor(){
    super()
    this._cg = new Config()
    this._config = this._cg.get()
    this._viewId = $('app')
  }

  static GROUP(){
    return 'group'
  }
  
  static VIEW_ID(){
    return 'component'
  }

  static ONCLICK(){
    return 'onclick'
  }

  static ONKEYUP(){
    return 'onkeyup'
  }

  static ONCHANGE(){
    return 'onchange'
  }

  static ONPASTE(){
    return 'onpaste'
  }

  static ONINPUT(){
    return 'oninput'
  }

  static ONMOUSEOVER(){
    return 'onmouseover'
  }

  static GET(){
    return 'get'
  }

  static SET(){
    return 'set'
  }

	_dynamicGrouplistener(o){
    const group = [...this._viewId.getElementsByClassName(Component.GROUP())]
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
      name:Component.ONCLICK(),
      event:'click'
    },{
      name:Component.ONMOUSEOVER(),
      event:'mouseover'
    },{
      name:Component.ONKEYUP(),
      event:'keyup'
    },{
      name:Component.ONCHANGE(),
      event:'change'
    },{
      name:Component.ONPASTE(),
      event:'paste'
    },{
      name:Component.ONINPUT(),
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
    const elem = this._viewId.getElementsByClassName(Component.GET())
    for(let i = 0,l = elem.length;i < l;i++){
      callback(inputs[i],i,elem)
    }
  }

  getDataValueFrom(id){
    const o = {}
    const elem = [...$(id).getElementsByClassName(Component.GET())]
    elem.forEach(e => {
      if(e.value.length === 0) o[e.dataset.id] = e.value
      else o[e.dataset.id] = isNaN(e.value) ? e.value : +e.value
    })
    return o
  }

  setDataValueTo(id,data){
    const elem = [...$(id).getElementsByClassName(Component.SET())]
    elem.forEach(e => {
      e.value = data[e.dataset.id]
    })
  }

  template(str){
    return stringCleaner(str)
  }

  show(){
    this._viewId.classList.remove('hide')
  }

  hide(){
    this._viewId.classList.add('hide')
  }

  static EXEC_BUTTON(){
    return '0'
  }

  static SAVE_BUTTON(){
    return '1'
  }

  static RETURN_BUTTON(){
    return '2'
  }

  static DELETE_BUTTON(){
    return '3'
  }
}