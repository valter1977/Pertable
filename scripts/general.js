"use strict";

Object.isDOM = function(obj) {
	return (typeof obj == "object" && "nodeType" in obj && obj.nodeType === 1 && obj.cloneNode);
}

if (!Number.isNaN) {
	Number.isNaN = function(obj) {
    	return obj !== obj;
	};
}

Number.isNumber = function(obj) {
	return (typeof obj == "number") || (typeof obj == "object" && obj.constructor === Number);
}

if (!Array.isArray) {
	Array.isArray = function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	};
}

if (!Array.prototype.slice) {
	Array.prototype.slice = function(begin, end) {
		if (begin === undefined)
			begin = 0;
		if (end === undefined)
			end = this.length;
		
		if (begin < 0)
			begin += this.length;
		if (end < 0)
			end += this.length;
		
		var result = [];
		for (var i = begin; i < end; i++)
			result.push(this[i]);
			
		return result;
	}
}

Function.isFunction = function(obj) {
	return obj instanceof Function;
}

String.isString = function(obj) {
	return (typeof obj == 'string') || (typeof obj == "object" && obj.constructor === String);
}

String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
}

String.prototype.trim = function()
{
	return this.replace(/^\s+/, '').replace(/\s+$/, '')
}

String.prototype.leftStr = function(n)
{
	return this.substr(1, n);
}

String.prototype.trimZeroes = function()
{
	return this.replace(/[0]+$/, '').replace(/[\.]$/, '')
}


String.prototype.lpad = function(padStr, length)
{
	var str = this;
    while (str.length < length)
        str = padStr + str;
    return str;
}

String.prototype.capitalize = function()
{
	return (this.length == 0) ? this : this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.format = function() {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        str = str.replace(regexp, arguments[i]);
    }
    return str;
};

String.prototype.link = function(options) {
	if (options === undefined)
		options = {};

	if (options.url === undefined)
		options.url = this.split(" ").join("");
		
	var result = '<a href="' + options.url + '"';
	
	if ("title" in options)
		result += ' title="' + options.title + '"';
	
	if ("cls" in options)
		result += ' class="' + options.cls + '"';
	
	if (options.blank)
		result += ' target="_blank"';
	
	return result + '>' + this + '</a>';
}

String.prototype.blank = function() {
	return '<a href="' + this.split(" ").join("") + '" target="_blank">' + this + '</a>';
}

String.prototype.toWikiUrl = function(lang) {
	if (lang === undefined)
		lang = "en";
		
	return "http://" + lang + ".wikipedia.org/wiki/" + this.split(" ").join("_");		
}

String.prototype.wiki = function(options) {
	if (options == undefined)
		options = {};

	if (options.title == undefined)
		options.title = "Wikipedia article";

	options.url = this.toWikiUrl(options.lang);

	return this.link(options);
}

Math.log10 = function(x) { return this.log(x) / this.LN10; };


var KEY_PRECISION = 'PRECISION';
var KEY_USE_SCI_FMT = 'USE_SCIENTIFIC_FORMAT';

function NumberFormat() {
	var p = localStorage.getItem(KEY_PRECISION);
	this.precision = p ? parseInt(p) : 4;
	this.low = 0.01;
	this.high = 1e6;
	this.format = localStorage.getItem(KEY_USE_SCI_FMT) ? this.formatComp : this.formatSci;
};

NumberFormat.prototype.setFullPrec = function() {
	this.precision = 15;
	localStorage.setItem(KEY_PRECISION, this.precision.toString());
};

NumberFormat.prototype.setPrecision = function(n) {
	if (n < 3)
		this.precision = 3;
	else if (n > 15)
		this.precision = 15;
	else
		this.precision = n;

	localStorage.setItem(KEY_PRECISION, this.precision.toString());
};

NumberFormat.prototype.formatFast = function(x) {
	if (this.precision >= 15)
		return x.toString();
	else
		return x.toPrecTrim(this.precision);
};

NumberFormat.prototype.formatSci = function(x) {
	if (x == 0)
		return 0;
	
	var neg = x < 0;
	x = Math.abs(x);
	var m = Math.floor( Math.log10(x) );

	var res;
	if (x < this.low || x >= this.high)
		res = (x / Math.pow(10, m)).toPrecTrim(this.precision) + "&times;10<SUP>" + m.toString().replace("-", "&#8211;") + "</SUP>";
	else if (m + 1 >= this.precision)
		res = x.toFixed();
	else
		res = x.toFixed(this.precision - m - 1).trimZeroes();
	
	if (neg) res = "&#8211;" + res;
	return res;
};

NumberFormat.prototype.formatComp = function(x) {
	if (x == 0)
		return 0;
	
	var neg = x < 0;
	x = Math.abs(x);
	var m = Math.floor( Math.log10(x) );
	
	var res;
	if (x < this.low || x >= this.high)
		res = (x / Math.pow(10, m)).toPrecTrim(this.precision) + "e" + m.toString();
	else if (m + 1 >= this.precision)
		res = x.toFixed();
	else
		res = x.toFixed(this.precision - m - 1).trimZeroes();
	
	if (neg) res = "-" + res;
	return res;
};

NumberFormat.prototype.setFastFmt = function() { this.format = this.formatFast };
	
NumberFormat.prototype.setCompFmt = function() {
	this.format = this.formatComp;
	localStorage.setItem(KEY_USE_SCI_FMT, 'false');
};
	
NumberFormat.prototype.setSciFmt = function() {
	this.format = this.formatSci;
	localStorage.setItem(KEY_USE_SCI_FMT, 'true');
};

var NUMBER_FORMAT = new NumberFormat();

Number.prototype.toHTML = function(n) {
	var m = Math.floor( Math.log10(this) );
	if (this < 0.01 || this >= 1e6)
		return (this / Math.pow(10, m)).toPrecision(n).trimZeroes() + 
			"&middot;10<SUP>" + m.toString().replace("-", "&#8211;") + "</SUP>";
	
	if (m >= n)
		return this.toFixed();
	
	return this.toPrecision(n).trimZeroes();
}

Number.prototype.toPrecTrim = function(n) {
	return n === undefined ? this.toString() : parseFloat(this.toPrecision(n)).toString();
}

Number.prototype.format = function(f) {
	if (f === undefined)
		f = NUMBER_FORMAT;

	return f.format(this);
}

Array.prototype.clear = function() {
	//this.length = 0;
	this.splice(0, this.length);
	return this;
}

Array.prototype.remove = function(obj) {
	if (this.length > 0) {	
		var remaining = new Array();
		for (var i = 0; i < this.length; i++)
			if (this[i] != obj)
				remaining.push(this[i]);

		this.length = 0;
		this.push.apply(this, remaining);
	}
	return this;
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (obj, fromIndex) {
		if (fromIndex === null)
			fromIndex = 0;
		else if (fromIndex < 0)
			fromIndex = Math.max(0, this.length + fromIndex);

		for (var i = fromIndex; i < this.length; i++) {
			if (this[i] === obj)
				return i;
		}
		return -1;
	};
}

Array.prototype.apply = function(f) {
	for (var i = 0; i < this.length; i++)
		this[i] = f(this[i]);
	return this;
}

Array.prototype.last = function() {
	return (this.length == 0) ? null : this[this.length - 1];
}

function getUrlParamValue( name ) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regex = new RegExp( "[\\?&]" + name + "=([^&#]*)" );
	var results = regex.exec( window.location.href );
	return (results === null) ? null : results[1];
}

function TLink(text, title, url) {
	if (url)
		return '<A HREF="' + url + '" TITLE="' + title + '" TARGET="_blank">' + text + '</A>';

	return '<SPAN TITLE="' + title + '">' + text + '</SPAN>';	
}

var uid = (function(){
	var N = 6;
	var alphabet = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";	

	return function (){
		var str = "";
		for (var i = 0; i < N; i++)
			str += alphabet.charAt( Math.floor(Math.random() * 62) );
		
		return str;
	};
})();

function RGB2HTML(red, green, blue)
{
	red = Math.round(255.0 * red);
	green = Math.round(255.0 * green);
	blue = Math.round(255.0 * blue);
	var rgb = blue | (green << 8) | (red << 16);
 	return "#" + rgb.toString(16).lpad("0", 6);
}

/*
function getMaxZindex(id) {
	var parent = id ? document.getElementById(id) : document;
	var elements = parent.getElementsByTagName("*");
	var z = 0;

	for (var i = 0; i < elements.length; i++)
		if (elements[i].style.zIndex != "")
			z = Math.max( z, parseInt(elements[i].style.zIndex) );
		
	return z;
}

function getAbsLeft( obj ) {
	var x = 0;
    while( obj && !isNaN( obj.offsetLeft ) ) {
        x += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return x;
}

function getAbsTop( obj ) {
	var y = 0;
    while( obj && !isNaN( obj.offsetTop ) ) {
        y += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return y;
}*/

function loadScript(url, callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";

	if (callback)
		if (script.readyState) //IE
			script.onreadystatechange = function() {
				if (script.readyState == "loaded" || script.readyState == "complete")
					script.onreadystatechange = null;
				callback();
			}
		else
			script.onload = callback;
		
	script.src = url;
	document.head.appendChild(script);
}

function loadScripts(urls, callback) {
	var total = urls.length;
	var loaded = 0;
	function scriptLoaded() {
		loaded++;
		if (loaded == total)
			callback();
	}
	
	for (var i = 0; i < total; i++)
		loadScript(urls[i], scriptLoaded);
}

function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.head.appendChild(link);
}

function setEvtHandler(element, evt, fn) {
	if (String.isString(fn))
		 fn = new Function(fn);
	
	if (evt == "change") {
		if ('oninput' in element)
			element.oninput = fn;
		else
		{
			element.onkeyup = fn;
			element.onpaste = fn;
		}
			
	} else
		element["on" + evt] = fn;
}

var disableSelect = function(disable) {
	var body = document.getElementsByTagName("body")[0];
	if (!body)
		return; //document not loaded yet
	
	if ("unselectable" in body) // Internet Explorer, Opera
		disableSelect = function(dis) { body.unselectable = (dis === undefined || dis); };
	else if (window.getComputedStyle) {
		var style = window.getComputedStyle(body, null);
		if ("MozUserSelect" in style) // Firefox
			disableSelect = function(dis) { body.style.MozUserSelect = (dis === undefined || dis) ? "none" : "text"; };
		else if ("webkitUserSelect" in style) // Google Chrome and Safari
			disableSelect = function(dis) { body.style.webkitUserSelect = (dis === undefined || dis) ? "none" : "text"; };
	} else
		disableSelect = function(dis) { };
		
	disableSelect(disable);
}

/*function altRows(table) {
	if (String.isString(table))
		table = document.getElementById(table);

	var rows = table.getElementsByTagName("tr");
	for (var i = 0; i < rows.length; i++)
		rows[i].className = (i % 2 == 0 ? "odd" : "even");
}

function clearChildNodes(parent) {
    while (parent.firstChild)
		parent.removeChild(parent.lastChild);
}*/