'use strict'

class MArray{
  static _minReducer(prev,next){
    return prev < next ? prev : next
  }
  
  static _maxReducer(prev,next){
    return prev > next ? prev : next
  }

  static min(array){
    return array.reduce(MArray._minReducer)
  }

  static max(array){
    return array.reduce(MArray._maxReducer)
  }

  static avg(array){
    return array.reduce((a,next) => a + next) / array.length
  }

  static median(array){
    array.sort((a,b) => a - b)
    const div = array.length % 2 
    if(div === 0){
      const half = array.length / 2 - 1
      return (array[half] + array[half + 1]) / 2
    }else{
      return array[parseInt(array.length / 2)]
    }
  }

  static percentage(t,p){
    let v = p > t ? t : p
    return (v * 100) / t
  }
}