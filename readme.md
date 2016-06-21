# geographic-center
[![npm version](https://img.shields.io/npm/v/geographic-center.svg)](https://www.npmjs.com/package/geographic-center) [![dependencies](https://david-dm.org/juliuste/geographic-center.svg)](https://david-dm.org/juliuste/geographic-center) [![Build Status](https://travis-ci.org/juliuste/geographic-center.svg?branch=master)](https://travis-ci.org/juliuste/geographic-center) [![MIT License](https://img.shields.io/badge/license-MIT-black.svg)](https://opensource.org/licenses/MIT)

JavaScript module for calculating the **geographic center** of given (probably somewhat inexact) **GPS/WGS84 coordinates** located in a zone with a **maximal width of 200km**. 

Made during [DB Open Data Tech Hackday](https://www.mindboxberlin.com/index.php/hackday.html) on 17./18.06.2016.

## Usage

```javascript
const geocenter = require('geographic-center')

let points = [
	{lat: 52.523370725444884, lon: 13.359761238098145},
	{lat: 52.522328870925726, lon: 13.36810827255249},
	{lat: 52.52602355445194, lon: 13.368194103240967}
]
let center = geocenter(points) // {lat: 52.5239077824627, lon: 13.365354502660765}
```

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/geographic-center/issues).