'use strict'

const _cs = new Config().get()

class E{
  constructor(){
    this.array = []
    this.ln = 0
  }

  setLineNumber(ln){
    this.ln = ln + 1
  }

  add(mess,type = E.ERROR_TYPE()){
    this.array.push({
      ln:this.ln,
      mess:mess,
      type:type
    })
  }

  static ERROR_TYPE(){
    return 0
  }

  static WARNING_TYPE(){
    return 1
  }

  get(type = E.ERROR_TYPE()){
    return this.array.filter(a => a.type === type).slice(0)
  }

  getAll(){
    return this.array.slice(0)
  }

  isError(){
    return this.array.filter(a => a.type === E.ERROR_TYPE()).length !== 0
  }
}

class Line{
  constructor(lines){
    this.end = lines.length
    this.setLine(0)
  }

  setLine(line){
    this.line = line
  }

  getLine(){
    return this.line
  }

  increment(){
    this.line++
  }

  exit(){
    this.line = this.end
  }
}

class Parse{
  constructor(error,marker = null){
    this.error = error
    this.marker = marker 
  }
  
  exec(variables,stream,rightSide = false){
    return new Parser(variables,this.error,rightSide,this.marker).exec(stream)
  }
}

class Path{
  constructor(error){
    this.array = []
    this.error = error
  }

  append(name){
    this.array.push(name)
    if(this.array.length > 4) this.error.add(LANG.getTokenByName('INTERPRETER_ALERT'))
  }

  remove(){
    this.array.pop()
  }

  getPath(){
    return this.array.join('/')
  }
}

class SubroutineData{
  constructor(error){
    this.error = error
    this.init()
  }

  init(){
    this.path = new Path(this.error)
    this.lineNumberToComeBack = 0
    this.subroutineCounter = 1
    this.isSubroutineCounterActivate = false
    this.queue = []
  }

  add(o){
    if(typeof this.getByPath(o.path) === 'undefined') this.queue.push(o)
  }

  initData(){
    this.add({
      path:this.path.getPath(),
      comeback:this.lineNumberToComeBack,
      repeat:this.subroutineCounter,
      active:this.isSubroutineCounterActivate,
    })
  }

  getByPath(){
    return this.queue.find(q => q.path === this.path.getPath())
  } 

  setByPath(o){
    this.queue.find(q => {
      if(q.path === this.path.getPath()) q = o
    })
  }

  clear(){
    this.queue = []
  }

  removeByPath(){
    this.queue = this.queue.filter(q => q.path !== this.path.getPath())
  }

  setSubroutineCounter(subroutineCounter){
    this.subroutineCounter = subroutineCounter
  }

  setlineNumberToComeBack(lineNumberToComeBack){
    this.lineNumberToComeBack = lineNumberToComeBack
  }

  setSubroutineCounterActivate(isSubroutineCounterActivate){
    this.isSubroutineCounterActivate = isSubroutineCounterActivate
  }
}

class EndOfSubprogram{
  exec(tokens,subroutineData,line){
    if(tokens.includes('M99')){
      const o = subroutineData.getByPath()
      if(typeof o === 'undefined') return
      o.repeat--
      subroutineData.setByPath(o)
      if(o.repeat > 0){//repeat
        subroutineData.path.remove()
        line.setLine(o.comeback - 1)
      }else{//continue
        subroutineData.removeByPath()
        subroutineData.path.remove()
        o.active = false
        line.setLine(o.comeback)
      }
    }
  }
}

class CallSubprogram{
  exec(tokens,variables,line,tokenLocation,subprogramData,error,marker){
    if(tokens.length >= 2){
      const position_call = EA.findToken(['M98','M97','G65','G66'],tokens)
      if(position_call !== -1){
        let mode = 0
        switch(_cs.controller.selected){
          case 'haas':
            if(EA.findToken(['M98'],tokens) !== -1) mode = 2
            else if(EA.findToken(['M97'],tokens) !== -1) mode = 1
          break;
          default:
            if(EA.findToken(['M98'],tokens) !== -1) mode = 2
            else if(EA.findToken(['M97'],tokens) !== -1){
              error.add(LANG.getTokenByName('INTERPRETER_ALERT_2'))
            }
          break;
        }

        tokens = tokens.slice(position_call + 1,tokens.length)
        // position of program name in the line
        let position_program_name = -1

        let p = EA.findTokenByFirstLetter(['P'],tokens)
        let q = EA.findTokenByFirstLetter(['Q'],tokens)

        switch(_cs.controller.selected){
          case 'haas':
            position_program_name = p
          break;
          default:
            if(p !== -1){
              position_program_name = p
              mode = 2
            }else{
              position_program_name = q
              mode = 1
            }
          break;
        }

        if(position_program_name !== -1){
          //Go to the line number of the subprogram position.
          let goto = tokens[position_program_name].slice(1)
          tokens = tokens.slice(position_program_name + 1)
          //alright
          if(!isNaN(goto) && goto !== 0){
            const sub = controllerVersionConverter(_cs) === 1 ? 'K' : 'L'
            const position_program_repeat = EA.findTokenByFirstLetter([sub],tokens)
            if(position_program_repeat !== -1){
              const _repeatNumber = tokens.length === 1 ? [tokens[position_program_repeat].slice(1)] : tokens.slice(position_program_repeat + 1)
              const repeat = new Parse(error,marker).exec(variables,_repeatNumber)
              
              if(!isNaN(repeat) && repeat !== 0){
                subprogramData.setSubroutineCounter(repeat * 1)
                subprogramData.setSubroutineCounterActivate(true)
              }
            }else{
              subprogramData.setSubroutineCounterActivate(true)
              switch(_cs.controller.selected){
                case 'haas':
                  subprogramData.setSubroutineCounter(1)
                break
                default:
                  if(goto.length > 4){
                    const go = goto.slice(goto.length - 4,goto.length)
                    subprogramData.setSubroutineCounter(goto.slice(0,goto.length - 4) * 1)
                    goto = go
                  }else{
                    subprogramData.setSubroutineCounter(1)
                  }
                break
              }
            }

            subprogramData.setlineNumberToComeBack(line.getLine())
            subprogramData.path.append(goto + '')
            //Init subroutine
            subprogramData.initData(line.getLine())
            
            const o = subprogramData.getByPath()
            //If not activate, activate again
            if(!o.active){
              o.active = true
              o.repeat = subprogramData.subroutineCounter
            } 

            subprogramData.setByPath(o)

            const target = mode === 1 ? 'N' : 'O'
            const jumpTo = tokenLocation.find(tl => tl.name === target && tl.id === +goto)
            if(typeof jumpTo !== 'undefined'){
              line.setLine(jumpTo.loc - 1)
            } 
          }
        }
      }
    }
  }
}

class EndOfProgram{
  exec(tokens,line){
    if(EA.includesToken(['M30','M02','M2'],tokens)){
      line.exit()
    }
  }
}

class Var{
  exec(tokens,variables,error,marker){
    if(tokens.length >= 3){
      let loc = tokens.indexOf('=')
      let loc2 = tokens.indexOf('IF')
      
      if(loc !== -1 && loc2 === -1){
        // check if there is N lable before or not, and sanitize
        let leftSide = tokens[0][0] === 'N' ? tokens.slice(1,loc) : tokens.slice(0,loc)
        let rightSide = tokens.slice(loc + 1,tokens.length)
        
        if(this.variableWillReplaceByAnother(leftSide)){//do if e.g. #[#100] = #100
          variables.setValueByKey(new Variable(
            '#' + new Parse(error,marker).exec(variables,leftSide),
            new Parse(error,marker).exec(variables,rightSide,true)
          ))
        }else{//asign or create
          const parsed = new Parse(error,marker).exec(variables,rightSide,true)
          if(leftSide[0] === '#3001'){//special case, in this case just set a timer value without setting a variable's value
            variables.systemTimer.setTimer(parsed)
          }else{//asign or create
            variables.add(new Variable(leftSide[0],parsed))
          }
        }
      }
    }
  }

  variableWillReplaceByAnother(tokens){
    for(let t of tokens){
      if(t === '[') return true
    }
    return false
  }
}

class OutputParser{
  constructor(){
    this.array = []
  }
  
  setArray(array){
    this.array = array
    return this
  }

  isLetter(c){
    return c >= 'A' && c <= 'Z'
  }

  exec(){
    let na = []
    for(var a of this.array){
      if(a.length > 1){
        let first = a.slice(0,1)
        let next = a.slice(1,2)
        if(this.isLetter(first) && !this.isLetter(next)){
          na.push(first)
          na.push(a.slice(1,a.length))
        }
        else{
          na.push(a)
        }
      }else{
        na.push(a)
      }
    }
    this.array = na
    return this
  }

  isArrayEmpty(){
    return this.array.length === 0
  }

  found(array){
    let i = 0
    for(;i < array.length;i++){
      if(array[i].length === 1){
        if(this.isLetter(array[i])) return i
      }
    }
    return -1
  }

  isGoodLine(){
    return this.found(this.array) !== -1
  }
  
  next(){
    let start = this.found(this.array)
    if(start === -1){
      return this.array
    }
    else{
      let end = this.found(this.array.slice(start + 1,this.array.length))
      if(end === -1) end = this.array.length
      let cache = this.array
      this.array = this.array.slice(end + 1,this.array.length)
      end = end + start + 1;
      return cache.slice(start,end)
    }
  }
}

class G65{
  exec(tokens,variables){
    if(tokens.length >= 3){
      if(tokens.includes('G65') || tokens.includes('G66')){

        const replace = [
          {name:'A',variable:1,},
          {name:'B',variable:2,},
          {name:'C',variable:3,},
          {name:'D',variable:7,},
          {name:'E',variable:8,},
          {name:'F',variable:9,},
          {name:'H',variable:11,},
          {name:'I',variable:4,},
          {name:'J',variable:5,},
          {name:'K',variable:6,},
          {name:'M',variable:10,},
          {name:'Q',variable:17,},
          {name:'R',variable:18,},
          {name:'S',variable:19,},
          {name:'T',variable:20,},
          {name:'U',variable:21,},
          {name:'V',variable:22,},
          {name:'W',variable:23,},
          {name:'X',variable:24,},
          {name:'Y',variable:25,},
          {name:'Z',variable:26,}
        ]

        let op = new OutputParser()
        op.setArray(tokens)
        op.exec()

        if(op.isGoodLine()){
          while(!op.isArrayEmpty()){
            let line = op.next()

            var character = line[0]
            for(var r of replace){
              if(character === r.name){
                variables.add(new Variable('#'+r.variable,line.slice(1,line.length).join('')))
              }
            }
          }
        }
      }
    }
  }
}
/* G65 mode II */
class G65_II{
  exec(tokens,variables){
    if(tokens.length >= 3){
      if(tokens.includes('G65') || tokens.includes('G66')){

        const replace = [
          {name:'A',variable:1,called:false},
          {name:'B',variable:2,called:false},
          {name:'C',variable:3,called:false},
          {name:'I',variable:4,called:false},
          {name:'J',variable:5,called:false},
          {name:'K',variable:6,called:false},
          {name:'I',variable:7,called:false},
          {name:'J',variable:8,called:false},
          {name:'K',variable:9,called:false},
          {name:'I',variable:10,called:false},
          {name:'J',variable:11,called:false},
          {name:'K',variable:12,called:false},
          {name:'I',variable:13,called:false},
          {name:'J',variable:14,called:false},
          {name:'K',variable:15,called:false},
          {name:'I',variable:16,called:false},
          {name:'J',variable:17,called:false},
          {name:'K',variable:18,called:false},
          {name:'I',variable:19,called:false},
          {name:'J',variable:20,called:false},
          {name:'K',variable:21,called:false},
          {name:'I',variable:22,called:false},
          {name:'J',variable:23,called:false},
          {name:'K',variable:24,called:false},
          {name:'I',variable:25,called:false},
          {name:'J',variable:26,called:false},
          {name:'K',variable:27,called:false},
          {name:'I',variable:28,called:false},
          {name:'J',variable:29,called:false},
          {name:'K',variable:30,called:false},
          {name:'I',variable:31,called:false},
          {name:'J',variable:32,called:false},
          {name:'K',variable:33,called:false},
        ]

        let op = new OutputParser()
        op.setArray(tokens)
        op.exec()

        if(op.isGoodLine()){
          while(!op.isArrayEmpty()){
            let line = op.next()

            var character = line[0]
            for(var r of replace){
              if(!r.called){
                if(character === r.name){
                  variables.add(new Variable('#'+r.variable,line.slice(1,line.length).join('')))
                  r.called = true
                  break
                }
              }
            }
          }
        }
      }
    }
  }
}

class Outcome{
  constructor(variables,error){
    this.variables = variables
    this.error = error
    this.array = []
    this.ln = 0
  }
  
  add(m){
    this.array.push({
      ln:this.ln,
      line:m
    })
  }
  
  setLineNumber(ln){
    this.ln = ln + 1
  }

  get(){
    return this.array.slice(0)
  }
  
  exec(tokens){
    let op = new OutputParser()
    op.setArray(tokens)
    op.exec()

    let na = []
    if(op.isGoodLine()){
      while(!op.isArrayEmpty()){
        let line = op.next()
        let after = line.slice(1,line.length)
        let before = line.slice(0,1) + ''

        switch(before){
          case 'N':
          case 'O':
            na.push(before + after.join(' '))
          break
          default:
            if(!isNaN(after)){
              na.push(before + after.join(' '))
            }else{
              na.push(before + new Parse(this.error).exec(this.variables,after))
            }
          break
        }
      }
    }else{
      na = na.concat(tokens)
    }
    
    this.add(na.join(' '))
    return na
  }

  clear(){
    this.array = []
  }
}

class Goto{
  exec(tokens,variables,tokenLocation,line,error,marker){
    if(tokens.length >= 1){
      const res = tokens.indexOf('GOTO')
      const loc = tokens.indexOf('IF')
      if(loc === -1 && res !== -1){
        let rightSide = tokens.slice(res + 1,tokens.length)
        const parsed = new Parse(error,marker).exec(variables,rightSide)
        
        if(parsed === 'error'){
          error.add(LANG.getTokenByName('INTERPRETER_ALERT_3'))
        }else{
          const jumpTo = tokenLocation.find(tl => tl.name === 'N' && tl.id === +parsed)
          if(typeof jumpTo !== 'undefined'){
            line.setLine(jumpTo.loc - 1)
          }else{
            error.add(LANG.getTokenByName('INTERPRETER_ALERT_4'))
          }
        }
      }
    }
  }
}

class Condition{
  constructor(variables,error,marker = null){
    this.variables = variables
    this.error = error
    this.marker = marker
  }
  /*
   * @param {Array} arrayA
   * @param {Array} arrayB
   * @return {Number} return a position of first find element from arrayB.
   */

  contains(arrayA,arrayB){
    for(let i = 0,length = arrayA.length;i < length;i++){
      if(arrayB.indexOf(arrayA[i]) !== -1) return i
    }
    return -1
  }

  /*
   * @param {Array} arrayA
   * @param {Array} arrayB
   * @return {Number} return a position of first find element from arrayB.
   */

  contain(arrayA,arrayB){
    for(let i = 0,length = arrayA.length;i < length;i++){
      if(arrayB.indexOf(arrayA[i]) !== -1) return arrayA[i]
    }
    return -1
  }

  /*
   * @method getRightSide
   *
   * @param {Array} arrayA
   * @param {Array} arrayB
   * @param {Number} start
   * @return {Array} return a subarray from start point to next occurrence, if no found next occurrence return length of the array.
   */

  getRightSide(arrayA,arrayB,start){
    start = start + 1
    let i = start
    /* return position till next will find it */
    for(length = arrayA.length;i < length;i++){
      if(arrayB.indexOf(arrayA[i]) !== -1) return arrayA.slice(start,i)
    }
    /* return length of the array if no next found */
    return arrayA.slice(start,arrayA.length)
  }

  exec(statement){
    return this.logic(this.variables.replaceVariablesByValue(statement))
  }

  logic(condition){
    let logic = ['AND','OR','XOR']
    /* get logic */
    let log = ''

    while((log = this.contain(condition,logic)) !== -1){
      //Marker !!!
      //debuger.add(condition.join(' '))
      // get position of first location of logic
      let locl = condition.indexOf(log)
      // get left side before logic
      let l = condition.slice(0,locl)
      // get right side after logic
      let r = this.getRightSide(condition,logic,locl)
      // beginning of the subarray is zero
      let start = 0
      // end of the subarray is it length plus operator then "r.length + 1" 
      let end = l.length + r.length

      condition = EA.replaceSubarrayByValue(start,end,condition,this.logicComparator(this.operator(l),this.operator(r),log))
    }

    return condition.length === 1 && (condition[0] === 'true' || condition[0] === 'false') ? condition[0] : this.operator(condition)
  }

  operator(condition){
    //Marker !!!
    //debuger.add(condition.join(' '));
    // if is a logical value already, skip it
    if(condition.length === 1 && (condition[0] === 'true' || condition[0] === 'false')) return condition[0]
    // if not do below
    let operators = ['LT','LE','EQ','NE','GT','GE']
    // find operator location 
    let a = this.contains(condition,operators)
    // get left side before operator
    let l = condition.slice(0,a)
    // get right side from operator
    let r = this.getRightSide(condition,operators,a)
    // get an operator
    let o = condition[a]
    // beginning of the subarray is zero
    let start = 0
    // end of the subarray is it length plus operator then "r.length + 1"
    let end = r.length + 1
    // parse left side
    let rl = !l.includes('null') ? new Parser(this.variables,this.error,true,this.marker).parse(l) : 'null'
    // parse right side
    let rr = !r.includes('null') ? new Parser(this.variables,this.error,true,this.marker).parse(r) : 'null'
    // if some of the sides return value of type diffrent than number, what means returns an error message
    if(!(typeof rl === 'number' || rl === 'null') && !(typeof rr === 'number' || rr === 'null')){
      // Show error
      //e.add(rl + ' '+ rr)
      // Return -1 what's is diffrent than string
      return -1
    }else{
      // must return one cell only, so [0] in the end
      return EA.replaceSubarrayByValue(start,end,condition,this.operationComparator(rl,rr,o))[0]
    }
  }

  operationComparator(a,b,o){
    let r = ''
    switch(o){
      case 'EQ':
        r = a === b ? 'true' : 'false'
      break;
      case 'GE':
        r = a >= b ? 'true' : 'false'
      break;
      case 'GT':
        r = a > b ? 'true' : 'false'
      break;
      case 'LT':
        r = a < b ? 'true' : 'false'
      break;
      case 'LE':
        r = a <= b ? 'true' : 'false'
      break;
      case 'NE':
        r = a !== b ? 'true' : 'false'
      break;
      default:
        r = 'Illegal operator ' + o + ' !'
      break;
    }
    //Marker !!!
    if(this.marker !== null) this.marker.addLogic(a,b,o,r)
    
    return r
  }

  logicComparator(a,b,l){
    let r = ''
    switch(l){
      case 'AND':
        r = a === 'true' && b === 'true' ? 'true' : 'false'
      break;
      case 'OR':
        r = ((a === 'true' && b === 'false') || (a === 'false' && b === 'true') || (a === 'true' && b === 'true')) ? 'true' : 'false'
      break;
      case 'XOR':
        r = ((a === 'true' && b === 'false') || (a === 'false' && b === 'true')) ? 'true' : 'false'
      break;
      default:
        r = 'Illegal logic ' + l + ' !'
      break;
    }
    // Marker !!!
    if(this.marker !== null) this.marker.addLogic(a,b,l,r)
    
    return r
  }
}

class Statement{
  exec(endKeyword,tokens){
    return tokens.slice(2,tokens.indexOf(endKeyword) - 1)
  }
}

class IF{
  exec(tokens,variables,tokenLocation,line,error,marker = null){
    if(tokens.length >= 6){
      const ifFound = tokens.indexOf('IF')
      if(ifFound !== -1){
        // take an array from found location
        tokens = tokens.slice(ifFound,tokens.length)
        let nkw = EA.getIfFound(tokens,['THEN','GOTO'])
        if(nkw === -1){
          error.add(LANG.getTokenByName('INTERPRETER_ALERT_5'))
          return 
        }
        
        const e = new Condition(variables,error,marker).exec(new Statement().exec(nkw,tokens))
        if(e === 'true'){
          const loc = tokens.indexOf(nkw)
          if(loc !== -1){
            var rest = nkw === 'THEN' ? tokens.slice(loc + 1,tokens.length) : tokens.slice(loc,tokens.length)
            new Var().exec(rest,variables,error,marker)
            new Goto().exec(rest,variables,tokenLocation,line,error,marker)
          }
        }
      }
    }
  }
}

class End{
  exec(tokens,tokenLocation,line){
    if(tokens.length >= 2){
      let leftSide = tokens[0][0] === 'N' ? tokens.slice(1) : tokens
      if(leftSide[0] === 'END'){
        const jumpTo = tokenLocation.find(tl => tl.name === 'DO' && tl.id === +leftSide[1])
        if(typeof jumpTo !== 'undefined'){
          line.setLine(jumpTo.loc - 1)
        }
      }
    }
  }
}

class While{
  exec(tokens,variables,tokenLocation,line,error,marker = null){
    if(tokens.length >= 6){
      let while_found = tokens.indexOf('WHILE')
      if(while_found !== -1){
        // take an array from found location
        tokens = tokens.slice(while_found,tokens.length)
        const c = new Condition(variables,error,marker).exec(new Statement().exec('DO',tokens))
        const where = +tokens[tokens.indexOf('DO') + 1]

        if(c === 'false'){
          const jumpTo = tokenLocation.find(tl => tl.name === 'END' && tl.id === where)
          if(typeof jumpTo !== 'undefined'){
            line.setLine(jumpTo.loc)
          }
        }
      }
    }
  }
}

class Interpretor extends FakeThread{
  constructor(validated){
    super(50)
    this.lines = makeSpaceAroundNegativeSign(validated.code)
    this.linesWithComments = validated.code2
    this.tokenLocation = validated.tokenLocation
    this.init()
  }

  init(){
    //init here ...
    this.tools = new Tools(this.cg)
    this.error = new E()
    this.line = new Line(this.lines)
    this.variables = new Variables(this.error,this.tools)
    this.subroutineData = new SubroutineData(this.error)
    this.outcome = new Outcome(this.variables,this.error)
    this.avs = new AVS(this.error)
    
    this.addCallback(t => {
      if(this.line.getLine() >= this.lines.length){//done
        t.stop()
        this.isRun = false
        if(this.isDoneCallback !== null) this.isDoneCallback(this.error,this.outcome,this.variables)//insert result when is done
      }else{//execute
        if(this.isRunnigCallback !== null){
          //to run only once use isRun before update a state
           this.isRunnigCallback(this.line.getLine(),this.lines.length)
        }
        this.isRun = true
        this.loop(this.lines)
        t.exec()
      }
    })
  }

  loop(codelines){
    let limiter = this.line.getLine() + this.cycleLength
    let breakApart = 50
    if(limiter > codelines.length) limiter = codelines.length
    for(;this.line.getLine() < limiter;){
      const _line = this.line.getLine()
      breakApart--
      const tokens = codelines[_line].split(' ')
      
      this.error.setLineNumber(_line)
      this.variables.setLineWithComment(this.linesWithComments[_line])
      new Var().exec(tokens,this.variables,this.error)
      new G65().exec(tokens,this.variables)
      new G65_II().exec(tokens,this.variables)
      new IF().exec(tokens,this.variables,this.tokenLocation,this.line,this.error)
      new While().exec(tokens,this.variables,this.tokenLocation,this.line,this.error)
      new End().exec(tokens,this.tokenLocation,this.line)
      new Goto().exec(tokens,this.variables,this.tokenLocation,this.line,this.error)
      new CallSubprogram().exec(tokens,this.variables,this.line,this.tokenLocation,this.subroutineData,this.error)
      new EndOfProgram().exec(tokens,this.line)
      new EndOfSubprogram().exec(tokens,this.subroutineData,this.line)
      this.outcome.setLineNumber(_line)
      const _pureCode = this.outcome.exec(tokens)

      if(this.config.avs_option.selected === 'y'){
        this.avs.run(_pureCode,_line)
      }
      
      this.variables.update(_pureCode)
      if(this.error.isError()){
        this.line.exit()
      }
      
      this.line.increment()
      if(breakApart === 0) break
    }
  }

  errorTest(_pureCode){
    for(let i = 0;i < _pureCode.length;i++){
      if(_pureCode[i].indexOf('error') !== -1) return true
    }
    return false
  }
}

class LineByLineInterpreter{
  constructor(){
    this.cg = new Config()
    this.lines = []
    this.linesWithComments = []
    this.tokenLocation = []
    this.init()
  }

  setValidator(validated){
    this.lines = makeSpaceAroundNegativeSign(validated.code)
    this.linesWithComments = validated.code2
    this.tokenLocation = validated.tokenLocation
  }

  init(){
    this.tools = new Tools(this.cg)
    this.error = new E()
    this.line = new Line(this.lines)
    this.variables = new Variables(this.error,this.tools)
    this.subroutineData = new SubroutineData()
    this.refresh()
  }

  refresh(){
    this.marker = new Marker()
    this.outcome = new Outcome(this.variables,this.error)
  }

  exec(callback){
    if(this.line.getLine() < this.lines.length){
      const _line = this.line.getLine()
      const tokens = this.lines[_line].split(' ')
      this.error.setLineNumber(_line)
      this.marker.setLineNumber(_line)
      this.variables.setLineWithComment(this.linesWithComments[_line])
      new Var().exec(tokens,this.variables,this.error,this.marker)
      new G65().exec(tokens,this.variables)
      new G65_II().exec(tokens,this.variables)
      new IF().exec(tokens,this.variables,this.tokenLocation,this.line,this.error,this.marker)
      new While().exec(tokens,this.variables,this.tokenLocation,this.line,this.error,this.marker)
      new End().exec(tokens,this.tokenLocation,this.line)
      new Goto().exec(tokens,this.variables,this.tokenLocation,this.line,this.error,this.marker)
      new CallSubprogram().exec(tokens,this.variables,this.line,this.tokenLocation,this.subroutineData,this.error,this.marker)
      new EndOfProgram().exec(tokens,this.line)
      new EndOfSubprogram().exec(tokens,this.subroutineData,this.line)
      
      this.outcome.setLineNumber(_line)
      this.variables.update(this.outcome.exec(tokens))
      if(this.error.isError()) this.line.exit()
      callback(this)
      this.line.increment()
    }else{
      callback(null)
    }
  }
}


