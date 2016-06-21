#!/usr/bin/env node
'use strict'

const assert = require('assert')
const gc = require('./index.js')

let point = {lat: 13.4, lon: 52.3}

let center = gc([point])

assert.deepEqual(Math.round(point.lat*10e5)/10e5, Math.round(center.lat*10e5)/10e5)
assert.deepEqual(Math.round(point.lon*10e5)/10e5, Math.round(center.lon*10e5)/10e5)
