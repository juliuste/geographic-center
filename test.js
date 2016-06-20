#!/usr/bin/env node
'use strict'

const assert = require('assert')
const gc = require('./index.js')


let point = {lat: 13.4, lon: 52.3}

let round = (obj) => {
	for(let i in obj) obj[i] = Math.round(obj[i]*10e5)/10e5
	return obj
}

/*assert.deepEqual(round(gc.utm2wgs(gc.wgs2utm(point, point),point)), round(point))

assert.deepEqual(round(gc.getRefPoint([point])), round(point))*/

assert.deepEqual(round(gc([point])), round(point))
