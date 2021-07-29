'use strict'

class EA{
  static getIfFound(tokens,target = []){
    for(let t of target){
      if(tokens.includes(t)) return t
    }
    return null
  }
  
  static findToken(targetTokens,tokenArray){
    for(let target of targetTokens){
      const position = tokenArray.indexOf(target);
      if(position !== -1) return position
    }
    return -1
  }

  static findTokenByFirstLetter(targetTokens,tokenArray){
    for(let target of targetTokens){
      for(let i = 0,l = tokenArray.length;i < l;i++){
        if(tokenArray[i].length >= 1){
          if(tokenArray[i].charAt(0) === target){
            return i
          }
        }
      }
    }
    return -1
  }

  static includesToken(array,array2){
    for(let i = 0,l = array.length;i < l;i++){
      for(let j = 0,l2 = array2.length;j < l2;j++){
        if(array[i] === array2[j]) return true
      }
    }
    return false
  }
  
  static includesTokenWithFirstLetter(array,array2){
    for(let i = 0,l = array.length;i < l;i++){
      for(let j = 0,l2 = array2.length;j < l2;j++){
        if(array[i].length >= 1 && array2[j].length >= 1){
          if(array[i][0] === array2[j]) return true
        }
      }
    }
    return false
  }
  
  static getTokenByfirstLetter(array,array2){
    for(let i = 0,l = array.length;i < l;i++){
      for(let j = 0,l2 = array2.length;j < l2;j++){
        if(array[i].length >= 1 && array2[j].length >= 1){
          if(array[i][0] === array2[j]) return array[i]
        }
      }
    }
    return null
  }

  /*
	 * @param {String} search
   * @param {Array} array
   * @return {Number} return a first found position.
   */

  static findFirstExists(search,array){
    for(let i = 0,l = array.length;i < l;i++){
      for(let j = 0,l2 = search.length;j < l2;j++){
        if(array[i] === search[j]) return i
      }
    }
    return -1
  }

  /*
	 * Returns array with replaced subarray by a string.
	 * The subarray begins at the specified beginIndex and extends to the character at index endIndex.
   *
	 * @param {Number} beginIndex
   * @param {Number} endIndex
   * @param {Array} array
   * @param {String} replace
   * @return {Array} return new array with replaced value
   */

  static replaceSubarrayByValue(beginIndex,endIndex,array,replace){
    let newArray = []
    for(let i = 0,l = array.length;i < l;i++){
      if(i <= beginIndex - 1 || i >= endIndex + 1){
        newArray.push(array[i])
      }else if(beginIndex == i){
        newArray.push(replace)
      }
    }
    return newArray
  }
}



