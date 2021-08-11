'use strict'

/*
 * Callback save function.
 *
 * @param {function}
 * @return {Array} return new array with replaced value
 * @example save(() => {
 *            return {
 *              data:"string",
 *              fileName:'file.txt'
 *            }
 *          })
 */

const save = f => {
  let a = document.createElement('a')
  let _ = f()
  a.style = 'display: none'
  document.body.appendChild(a)

  let blob = new Blob([_['data']], {type:'text/plain;charset=utf-8'})
  let url = window.URL.createObjectURL(blob)

  a.href = url
  a.download = _['fileName']
  a.click()

  window.URL.revokeObjectURL(url)
}

/*
 * Callback open function.
 *
 * @param {function}
 * @example open(d => {
 *   console.log(d.content)
 *   console.log(d.file)
 * })
 */

const open = f => {
  let input = document.createElement('input')
  input.type = 'file'

  input.onchange = e => {
    // getting a hold of the file reference
    let file = e.target.files[0]
    // setting up the reader
    let reader = new FileReader()
    reader.readAsText(file,'UTF-8')

    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      let content = readerEvent.target.result // this is the content!
      f({content:content,file:file.name})
    }
  }
  input.click()
}

const getFileName = (string,mode = true) => {
  let last = 0
  for(let i = 0,l = string.length;i < l;i++){
    if(string.charAt(i) === '/') last = i
  }
  return mode ? string.slice(last + 1,string.length) : string.slice(last,string.length)
}

const removeExtension = string => {
  let last = 0
  for(let i = 0,l = string.length;i < l;i++){
    if(string.charAt(i) === '.') last = i
  }
  return string.slice(0,last)
}

const getExtension = string => {
  let last = 0
  for(let i = 0,l = string.length;i < l;i++){
    if(string.charAt(i) === '.') last = i
  }
  return string.slice(last +1,string.length)
}
