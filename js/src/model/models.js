'use strict'

const customFunctionModel = o => {
  return {
    name:o.name,
    args:o.args.join(' '),
    body:o.body.join(' '),
  }
}

const customConstantModel = o => {
  return {
    name:trim(o.name),
    value:o.value,
  }
}