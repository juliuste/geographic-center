'use strict'

const mean = require('lodash.mean')
const minBy = require('lodash.minby')
const maxBy = require('lodash.maxby')

'use strict'

const wgs2utm = (coords, refPoint) => {

	/* Copyright (c) 2006, HELMUT H. HEIMEIER
	Permission is hereby granted, free of charge, to any person obtaining a
	copy of this software and associated documentation files (the "Software"),
	to deal in the Software without restriction, including without limitation
	the rights to use, copy, modify, merge, publish, distribute, sublicense,
	and/or sell copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included
	in all copies or substantial portions of the Software.*/


	// Geographische Länge lat und Breite lon im WGS84 Datum
	if (!coords.lat || !coords.lon || !refPoint.lat) return

	let lat = parseFloat(coords.lat)
	let lon = parseFloat(coords.lon)

	if (lon <= -180 || lon > 180 || lat <= -80 || lat >= 84){
		console.error('GPS coords outside the UTM system. Requirement: -180° <= lat < +180°, -80° < lon < 84° N')
		return
	}

	//WGS84 Datum
	//Große Halbachse a und Abplattung f
	const a = 6378137.000
	const f = 3.35281068e-3
	const pi = Math.PI

	//Polkrümmungshalbmesser c
	const c = a/(1-f)

	//Quadrat der zweiten numerischen Exzentrizität
	let ex2 = (2*f-f*f)/((1-f)*(1-f))
	let ex4 = ex2*ex2
	let ex6 = ex4*ex2
	let ex8 = ex4*ex4

	//Koeffizienten zur Berechnung der Meridianbogenlänge
	let e0 = c*(pi/180) * (1 - 3 *  ex2/4 + 45 * ex4 / 64  - 175*ex6/256  + 11025 * ex8/16384) 
	let e2 = c*(  - 3*ex2/8 + 15*ex4/32  - 525*ex6/1024 +  2205*ex8/4096)
	let e4 = c*(15*ex4/256 - 105*ex6/1024 +  2205*ex8/16384)
	let e6 = c*( -  35*ex6/3072 +	315*ex8/12288)

	//Längenzone lz und Breitenzone (Band) bz
	// let lzn = parseInt(refPoint.lon+180)/6 + 1
	let bd = parseInt(1 + (lat + 80)/8)

	//Geographische Breite in Radianten br
	let br = lat * pi/180

	let tan1 = Math.tan(br)
	let tan2 = tan1*tan1
	let tan4 = tan2*tan2

	let cos1 = Math.cos(br)
	let cos2 = cos1*cos1
	let cos4 = cos2*cos2
	let cos3 = cos2*cos1
	let cos5 = cos4*cos1

	let etasq = ex2*cos2

	//Querkrümmungshalbmesser nd
	let nd = c/Math.sqrt(1 + etasq)

	//Meridianbogenlänge g aus gegebener geographischer Breite lon
	let g = (e0*lat) + (e2*Math.sin(2*br)) + (e4*Math.sin(4*br)) + (e6*Math.sin(6*br))

	//Längendifferenz dl zum Bezugsmeridian lh
	// let lh = (lzn - 30)*6 - 3
	let lh = refPoint.lon
	let dl = (lon - lh)*pi/180
	let dl2 = dl*dl
	let dl4 = dl2*dl2
	let dl3 = dl2*dl
	let dl5 = dl4*dl

	//Maßstabsfaktor auf dem Bezugsmeridian bei UTM Koordinaten m = 0.9996
	//Nordwert y und Ostwert x als Funktion von geographischer Breite und Länge

	let y
	if ( lat < 0 ) {
		y = 10e6 + 0.9996*(g + nd*cos2*tan1*dl2/2 + nd*cos4*tan1*(5-tan2+9*etasq)*dl4/24)
	}
	else {
		y = 0.9996*(g + nd*cos2*tan1*dl2/2 + nd*cos4*tan1*(5-tan2+9*etasq)*dl4/24)
	}
	let x = 0.9996*( nd*cos1*dl + nd*cos3*(1-tan2+etasq)*dl3/6 + nd*cos5*(5-18*tan2+tan4)*dl5/120) + 500000

	return {x: x, y: y}

}

// -------------------------------------------------------------------------------------

const utm2wgs = (coords,refPoint) => {
/* Copyright (c) 2006, HELMUT H. HEIMEIER
	Permission is hereby granted, free of charge, to any person obtaining a
	copy of this software and associated documentation files (the "Software"),
	to deal in the Software without restriction, including without limitation
	the rights to use, copy, modify, merge, publish, distribute, sublicense,
	and/or sell copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included
	in all copies or substantial portions of the Software.*/

// Längenzone zone, Ostwert x und Nordwert y im WGS84 Datum
	if (!coords.x || !coords.y || !refPoint.lat) return
	let x = parseFloat(coords.x)
	let y = parseFloat(coords.y)

	//WGS 84 Datum
	//Große Halbachse a und Abplattung f
	const a = 6378137.000
	const f = 3.35281068e-3
	const pi = Math.PI

	//Polkrümmungshalbmesser c
	const c = a/(1-f)

	//Quadrat der zweiten numerischen Exzentrizität
	let ex2 = (2*f-f*f)/((1-f)*(1-f))
	let ex4 = ex2*ex2
	let ex6 = ex4*ex2
	let ex8 = ex4*ex4

	//Koeffizienten zur Berechnung der geographischen Breite aus gegebener
	//Meridianbogenlänge
	let e0 = c*(pi/180)*(1 - 3*ex2/4 + 45*ex4/64  - 175*ex6/256  + 11025*ex8/16384)
	let f2 =	(180/pi)*(	 3*ex2/8 -  3*ex4/16  + 213*ex6/2048 -	255*ex8/4096)
	let f4 =				  (180/pi)*(	21*ex4/256 -  21*ex6/256  +	533*ex8/8192)
	let f6 =									(180/pi)*(	151*ex6/6144 -	453*ex8/12288)

	let north = y
	if (refPoint.lat < 0) north -= 10e6


	//Geographische Breite bf zur Meridianbogenlänge gf = m_y
	let sigma = (north/0.9996)/e0
	let sigmr = sigma*pi/180
	let bf = sigma + f2*Math.sin(2*sigmr) + f4*Math.sin(4*sigmr) + f6*Math.sin(6*sigmr)

	//Breite bf in Radianten
	let br = bf * pi/180
	let tan1 = Math.tan(br)
	let tan2 = tan1*tan1
	let tan4 = tan2*tan2

	let cos1 = Math.cos(br)
	let cos2 = cos1*cos1

	let etasq = ex2*cos2

	//Querkrümmungshalbmesser nd
	let nd = c/Math.sqrt(1 + etasq)
	let nd2 = nd*nd
	let nd4 = nd2*nd2
	let nd6 = nd4*nd2
	let nd3 = nd2*nd
	let nd5 = nd4*nd

	//Längendifferenz dl zum Bezugsmeridian lh
	// let zone = parseInt(refPoint.lon+180)/6 + 1
	// let lh = (zone - 30)*6 - 3
	let lh = refPoint.lon
	let dy = (x-500000)/0.9996
	let dy2 = dy*dy
	let dy4 = dy2*dy2
	let dy3 = dy2*dy
	let dy5 = dy3*dy2
	let dy6 = dy3*dy3

	let b2 = - tan1*(1+etasq)/(2*nd2)
	let b4 =	tan1*(5+3*tan2+6*etasq*(1-tan2))/(24*nd4)
	let b6 = - tan1*(61+90*tan2+45*tan4)/(720*nd6)

	let l1 =	1/(nd*cos1)
	let l3 = - (1+2*tan2+etasq)/(6*nd3*cos1)
	let l5 =	(5+28*tan2+24*tan4)/(120*nd5*cos1)

	//Geographische Breite lat und Länge lon als Funktion von Ostwert x und Nordwert y
	let lat = bf + (180/pi) * (b2*dy2 + b4*dy4 + b6*dy6)
	let lon = lh + (180/pi) * (l1*dy  + l3*dy3 + l5*dy5)
	return {'lat': lat, 'lon': lon}
}

// -------------------------------------------------------------------------------------

const getRefPoint = (points) => {
	const minPoint = {lat: minBy(points, 'lat').lat, lon: minBy(points, 'lon').lon}
	const maxPoint = {lat: maxBy(points, 'lat').lat, lon: maxBy(points, 'lon').lon}
	if (maxPoint.lat-minPoint.lat>2){
		console.error('The given latitudes vary by more than 200km.')
	}
	return {lat: (maxPoint.lat + minPoint.lat)/2, lon: (maxPoint.lon + minPoint.lon)/2}
}

// -------------------------------------------------------------------------------------

const center = (points) => {
	const refPoint = getRefPoint(points)
	const utm = {x: [], y: []}
	points.forEach(function(point){
		let coords = wgs2utm(point, refPoint)
		utm.x.push(coords.x)
		utm.y.push(coords.y)
	})
	for (let axis of ['x', 'y']) {
		let a = utm[axis]
		a.sort()
		a = a.slice(0, Math.round(a.length * .9))
		a.reverse()
		a = a.slice(0, Math.round(a.length * (8/9)))
		a.reverse()
		utm[axis] = mean(a)
	}
	const result = utm2wgs({x: utm.x, y: utm.y}, refPoint)
	return {lat: result.lat, lon: result.lon}
}

/* old, straightforward, less accurate version
const center = (points) => {
	const result = {lats: [], lons: []}
	points.forEach(function(point){
		result.lats.push(point.latitude)
		result.lons.push(point.longitude)
	})
	for (let axis of ['lats', 'lons']) {
		let a = result[axis]
		a.sort()
		a = a.slice(0, Math.round(a.length * .9))
		a.reverse()
		a = a.slice(0, Math.round(a.length * (8/9)))
		a.reverse()
		result[axis] = mean(a)
	}
	return {latitude: result.lats, longitude: result.lons}
}
*/

module.exports = center
// module.exports = {center: center, wgs2utm: wgs2utm, utm2wgs: utm2wgs, getRefPoint: getRefPoint}

/*
let points = [
	{lat: 52.523370725444884, lon: 13.359761238098145},
	{lat: 52.522328870925726, lon: 13.36810827255249},
	{lat: 52.52602355445194, lon: 13.368194103240967}
]

let point = {'lat': 52.3, 'lon': 13.4}
console.log(center(points))
*/