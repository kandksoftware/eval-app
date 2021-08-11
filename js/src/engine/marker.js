'use strict'

class Marker{
	constructor(){
    this._trace = []
    this._ln = 0
    this._next = 1
    this._loc = ''
	}

	add(array,start,stop,className){
		this._trace.push({
      ln:this._ln,
      mess:array.map((c,i) => {
        if(i === start) return `<span class="${ className }">` + c
        else if(i === stop) return c + '</span>'
        else return c
      }).join(' '),
      op:this._next,
      loc:this._loc,
      type:'add'
    })
    this._next++
	}

	addResult(array){
		this._trace.push({
      ln:this._ln,
      mess:`<span class="result">${ array.join(' ') }</span>`,
      op:this._next,
      loc:this._loc,
      type:'result'
    })
    this._next++
    return this
  }

  addFinalResult(string){
		this._trace.push({
      ln:this._ln,
      mess:`<span class="result">${ string }</span>`,
      op:this._next,
      loc:this._loc,
      type:'final'
    })
    this._next++
    return this
  }

  setLoc(loc){
    this._loc = loc
  }
  
  addLogic(a,b,o,r){
		this._trace.push({
      ln:this._ln,
      mess:`<span class="logic">${ a }</span> <span class="operator">${ o }</span> <span class="logic">${ b }</span><span class="logic-result">${ r }</span>`,
      loc:this._loc,
      op:this._next,
      type:'logic'
    })
    this._next++
  }
  
  addError(e,f){  
    this._trace.push({
      ln:this._ln,
      mess:`<span style="color:red">${ e }</span>`,
      op:this._next,
      loc:this._loc,
      type:'error'
    })
    this._next++
    return this
  }

  addVariable(variable){
    this._trace.push({
      ln:this._ln,
      mess:`<span style="color:orange">${ variable.name + ' = ' + variable.value }</span>`,
      op:this._next,
      loc:this._loc,
      type:'var'
    })
    this._next++
    return this
  }

	get(){
		return this._trace.slice(0)
  }
  
  setLineNumber(ln){  
    this._ln = ln + 1
  }

  clear(){
    this._trace = []
  }
}