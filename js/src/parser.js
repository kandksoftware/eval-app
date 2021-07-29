'use strict'

class Limiter{
  static isNumber(t){
    return t >= 0 && t <= 9
  }

  static alert(n){
    let counter = 0
    
    for(let i = 0,length = n.length;i < length;i++){
      if(Limiter.isNumber(n.charAt(i))) counter++
      if(counter > 8) return true
    }
    return false
  }

  static exec(n){
    let counter = 0
    let ns = ''
    
    for(let i = 0,length = n.length;i < length;i++){
      if(Limiter.isNumber(n.charAt(i))) counter++

      if(counter > 8) return ns
      ns += n.charAt(i)
    }
    return ns
  }
}

class Variables{
  constructor(config){
    this._variables = []
    this._config = config
    this._init()
  }
  
  _init(){
    this._config.get().variables.forEach(v => this._variables.push(v))
  }

  replaceVariablesByValue(array){
    for(let i = 0,l = array.length;i < l;i++){
      const foundVariable = this._variables.find(v => v.name === array[i])
      if(typeof foundVariable !== 'undefined'){
        array[i] = foundVariable.value
      }
    }
    return array
  }
}

class BuildInFunctions{
  constructor(config){
    this._config = config
  }
  
  static rond(arg){
    switch(arg){
      case 0:
      case 90:
      case 180:
      case 270:
      case 360:
        return arg - 0.001
      break
    }
    return arg
  }
  
  get(){
    const selected = this._config.get().modeDeg
    return [{
      name:'tanh',
      body:arg => selected ? Math.tanh(arg * Math.PI / 180) : Math.tanh(arg)
    },{
      name:'sinh',
      body:arg => selected ? Math.sinh(arg * Math.PI / 180) : Math.sinh(arg)
    },{
      name:'cosh',
      body:arg => selected ? Math.cosh(arg * Math.PI / 180) : Math.cosh(arg)
    },{
      name:'atan',
      body:arg => selected ? Math.atan(arg) * 180 / Math.PI : Math.atan(arg)
    },{
      name:'asin',
      body:arg => selected ? Math.asin(arg) * 180 / Math.PI : Math.asin(arg)
    },{
      name:'acos',
      body:arg => selected ? Math.acos(arg) * 180 / Math.PI : Math.acos(arg)
    },{
      name:'atanh',
      body:arg => selected ? Math.atanh(arg * Math.PI / 180) : Math.atanh(arg)
    },{
      name:'asinh',
      body:arg => selected ? Math.asinh(arg * Math.PI / 180) : Math.asinh(arg)
    },{
      name:'acosh',
      body:arg => selected ? Math.acosh(arg * Math.PI / 180) : Math.acosh(arg)
    },{
      name:'cos',
      body:arg => selected ? Math.cos(arg * Math.PI / 180) : Math.cos(arg)
    },{
      name:'sin',
      body:arg => selected ? Math.sin(arg * Math.PI / 180) : Math.sin(arg)
    },{
      name:'tan',
      body:arg => selected ? Math.tan(arg * Math.PI / 180) : Math.tan(arg)
    },{
      name:'abs',
      body:arg => Math.abs(arg)
    },{
      name:'round',
      body:arg => Math.round(arg)
    },{
      name:'ln',
      body:arg => Math.log(arg)
    },{
      name:'log',
      body:arg => Math.log10(arg)
    },{
      name:'exp',
      body:arg => Math.exp(arg)
    }]
  }
}

class Parser{
  constructor(functions,functions2,variables,error,marker = null){
    this._error = error
    this._variables = variables
    this._functions = functions
    this._functions2 = functions2
    this._marker = marker
  }

  _aexec(array){
    const op = [
      [':','%','√','∛','^','‰'],
      ['*','/','×','÷','MOD','AND','**'],
      ['+','-','OR','XOR']
    ]

    while(array.length > 1){
      if(EA.findFirstExists(op[0],array) !== -1){
        array = this._operation(array,op[0])
      }else if(EA.findFirstExists(op[1],array) !== -1){
        array = this._operation(array,op[1])
      }else{
        array = this._operation(array,op[2]);
      }
    }
    
    if(typeof array[0] === 'undefined'){
      this._error.add(typeof array[0])
      return 'error'
    }else if(array[0] === 'Infinity' || array[0] === '-Infinity'){
      this._error.add(array[0])
      return 'error'
    }else if(isNaN(array[0])){
      this._error.add(array[0])
      return 'error'
    }else{
      return +array[0]
    } 
  }

  _operation(array,op){
    for(let i = 0,length = array.length;i < length;i++){
      for(let j = 0,length2 = op.length;j < length2;j++){
        if(array[i] === op[j]){
          return this._parse(op[j],array,i)
        } 
      }
    }
    return 0
  }

  _parse(oper,array,cursor){
    let start = (cursor - 1 < 0) ? 0 : cursor - 1
    if(oper === '√' || oper === '∛') start = cursor
    let stop = oper === '%' || oper === '‰' ? cursor : cursor + 1
    //Marker !!!
    if(this._marker !== null) this._marker.add(array,start,stop,'next')
        
    const res = EA.replaceSubarrayByValue(start,stop,array,this._calculate(oper,array[start],array[stop]))
    //Marker !!!
    if(this._marker !== null){
      //show if is final result !
      if(res.length === 1) this._marker.addResult(res)
    }
    return res
  }

  _exponentiation(a,b){
    let r = a
    b = b - 1
    for(let i = 0;i < b;i++){
      r = r * a
    }
    return r
  }

  _calculate(operator,paramA,paramB){
    let result = ''
    let a = paramA !== 'null' ? parseFloat(paramA) : 0
    let b = paramB !== 'null' ? parseFloat(paramB) : 0

    result = (paramA === '-') ? -b :
            (paramA === '+') ? +b :
            (paramA === '*' || paramA === '/' || paramA === '×' || paramA === '÷') ? b :
            (operator === '%') ? a / 100 :
            (operator ==='‰') ? a / 1000 :
            (operator === '√') ? Math.sqrt(b) :
            (operator === '∛') ? Math.cbrt(b) :
            (operator === '^') ? this._exponentiation(a,b) :
            (operator === '*' || operator === '×') ? a * b :
            (operator === '/' || operator === '÷') ? a / b :
            (operator === 'MOD') ? a % b :
            (operator === '+') ? a + b :
            (operator === '-') ? a - b :
            (operator === '**') ? Math.pow(a,b) :
            this._parseLogic(operator,a,b)

    if(this._marker !== null){
      result = Limiter.exec(result + '')
    }
    return result
  }

  _parseLogic(o,a,b){
    if((a >= 0 && a <= 1) && (b >= 0 && b <= 1)){
      return o === 'AND' ? a & b : o === 'OR' ? a | b : o === 'XOR' ? a ^ b : 0
    }else{
      return 0
    }
  }

  _getBracketDeepestLocation(array){
    let loc = -1
    for(let i = 0,length = array.length;i < length;i++){
      if(array[i] === Tokens.BRACKET().OPEN) loc = i
      if(array[i] === Tokens.BRACKET().CLOSE) return loc
    }
    return -1
  }

  _isFunction(array,loc){
    const funs = this._functions.concat(this._functions2)
    for(let f of funs){
      if(array[loc - 1] === f.name) return loc - 1
    }
    return -1
  }

  _getCloseBracketFrom(array,loc){
    for(let i = loc,length = array.length;i < length;i++){
      if(array[i] === Tokens.BRACKET().CLOSE) return i
    }
    return -1
  }

  _execCustomFunction(myFunction,args,callbackError){
    if(args.length !== myFunction.args.length) return
    const array = this._variables.replaceVariablesByValue(myFunction.body.slice(0))
    for(let i = 0,length = array.length;i < length;i++){
      for(let j = 0,length2 = args.length;j < length2;j++){
        if(array[i] === myFunction.args[j]) array[i] = args[j]
      }
    }
    return this.exec(array)
  }

  _passArguments(array){
    const found = array.indexOf(Tokens.ARGS_SEPERATOR())
    if(found === -1) return [this._aexec(array)]
    return [this._aexec(array.slice(0,found))].concat(this._passArguments(array.slice(found + 1)))
  }

  parse(array,show_marker = true){
    const findOpenBracket = array.indexOf(Tokens.BRACKET().OPEN)
    if(findOpenBracket === -1) return this._aexec(array)

    const first = this._getBracketDeepestLocation(array)
    const fun = this._isFunction(array,first)
    const close = this._getCloseBracketFrom(array,first + 1)

    let output = []
    let calc = ''
    
    if(fun === -1){
      //Marker !!! 
      if(this._marker !== null) this._marker.add(array,first,close,'next-brackets')
      
      output = array.slice(0,first)

      calc = this._aexec(array.slice(first + 1,close))//return a string
      if(calc === 'error') return calc
      
      output = output.concat(calc)
      output = output.concat(array.slice(close + 1))
      return this.parse(output,show_marker)
    }else{
      let a = []
      //Marker !!!
      if(this._marker !== null) this._marker.add(array,fun,close,'function')

      if(typeof this._functions.find(f => f.name === array[fun]) !== 'undefined'){//exec build-in functions
        for(let sf of this._functions){
          this.show_marker = false//marker feature
          if(sf.name === array[fun]){
            calc = this._aexec(array.slice(first + 1,close))
            if(calc === 'error') return calc
            
            a = sf.body(calc)
            if(this._marker !== null){
              a = Limiter.exec(a + '')
              this._marker.addResult([a])
            }
          } 
        }
      }else{//exec custom functions
        for(let sf of this._functions2){
          this.show_marker = false//marker feature
          
          if(sf.name === array[fun]){
            const args = this._passArguments(array.slice(first + 1,close))
            if(sf.args.length === args.length){
              a = this._execCustomFunction(sf,args)
            }
          } 
        }
      }
      
      output = array.slice(0,fun)
      output = output.concat(a)
      output = output.concat(array.slice(close + 1))
      return this.parse(output,show_marker)
    }
  }

  exec(array,show_marker = true){
    return Limiter.exec(this.parse(array,show_marker) + '')
  }
}





