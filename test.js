#!/usr/bin/env node
'use strict'

const assert = require('assert')
const gc = require('./index.js')

const round = (value) => Math.round(value*10e5)/10e5

/*assert.deepEqual(round(gc.utm2wgs(gc.wgs2utm(point, point),point)), round(point))

assert.deepEqual(round(gc.getRefPoint([point])), round(point))*/

let point = {lat: 13.4, lon: 52.3}

let center = gc([point])

assert.deepEqual(round(point.lat), round(center.lat))
assert.deepEqual(round(point.lon), round(center.lon))