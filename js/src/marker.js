'use strict'

class Marker{
	constructor(){
    this._trace = []
    this._ln = 0
    this._next = 1
	}

	add(array,start,stop,className){
		this._trace.push({
      ln:this._ln,
      mess:array.map((c,i) => {
        if(i === start) return `<span class="${ className }">` + c
        else if(i === stop) return c + '</span>'
        else return c
      }).join(' '),
      op:this._next
    })
    this._next++
	}

	addResult(array){
		this._trace.push({
      ln:this._ln,
      mess:`<span class="result">${ array.join(' ') }</span>`,
      op:this._next
    })
    this._next++
    return this
  }
  
  addLogic(a,b,o,r){
		this._trace.push({
      ln:this._ln,
      mess:`<span class="logic">${ a }</span> <span class="operator">${ o }</span> <span class="logic">${ b }</span><span class="logic-result">${ r }</span>`,
      op:this._next
    })
    this._next++
  }
  
  addError(e,f){  
    this.addResult([f])
    this._trace.push({
      ln:this._ln,
      mess:`<span style="color:red">${ e }</span>`,
      op:this._next
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
}