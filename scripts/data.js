"use strict";

const PROPERTIES = (function(){
	const categories = ["generalprop", "atomicprop", "physicalprop", "abundprop", "otherprop"];
	const list = [];
	let currentIndex = -1;
	
	function compare(a,b) {
		if (a.order > b.order) return 1;
		if (a.order < b.order) return -1;
		return 0;
	}
	
	function formatNumeric(value) {
		return this.numberFormat(value);
	}
	
	function formatNonNumeric(value) {
		return value;
	}
		
	function Prop(key, data, options) {
		let values;
		const notes = new Array(SYMBOLS.length);
		
		this.key = key;
		if (Array.isArray(data))
			values = data;
		else { //must be a function
			values = new Array(SYMBOLS.length);
			for (var i = 0; i < SYMBOLS.length; i++)
				values[i] = data(i + 1);
		}
		
		for (let i = 0; i < SYMBOLS.length; i++)
			if ($.isPlainObject(values[i])) {
				notes[i] = values[i].note;
				values[i] = values[i].value;
			}
		
		this.rawValue = function(i) {
			return values[i];
		}

		if (options === undefined)
			options = {};
		
		if ("numeric" in options)
			this.numeric = options.numeric;
		else
			this.numeric = true;
			
		if (this.numeric) {
			this.minval = Number.MAX_VALUE;
			for (let i = 0; i < SYMBOLS.length; i++)
				if (values[i] && values[i] < this.minval) {
					this.minval = values[i];
					this.lowIndex = i;
				}
			
			this.maxval = Number.MIN_VALUE;
			for (let i = 0; i < SYMBOLS.length; i++)
				if (values[i] && values[i] > this.maxval) {
					this.maxval = values[i];
					this.highIndex = i;
				}
		}
			
		if (this.numeric && "numberFormat" in options)
			this.numberFormat = options.numberFormat;
			
		if ("unit" in options)
			this.unit = options.unit.replaceAll("-", "&#8211;");
		
		if ("source" in options) {
			if (Array.isArray(options.source))
				this.source = options.source;
			else {
				this.source = [options.source];
			}
		}
		
		if ("info" in options)
			this.info = options.info;
		
		if ("category" in options)
			this.category = options.category;
		else
			this.category = "otherprop";
		
		this.order = categories.indexOf(this.category);
		
		if ("missing" in options) {
			this.missingValue = options.missing;
		} else
			this.missingValue = PROPERTIES.defaultMissingValue;
		
		if ("format" in options)
			this.formatNonNull = options.format;
		else if (this.numeric)
			this.formatNonNull = formatNumeric;
		else
			this.formatNonNull = formatNonNumeric;
			
		this.format = function(i) {
			const value = values[i];
			if (value === null)
				return APP.trans(this.missingValue);
			
			let res = this.formatNonNull(value);
			if (notes[i])
				res = '<span class="data-note" onmouseover="Tooltip(\'' + APP.trans(notes[i]) + '\').showAt(this);">' + res + '*</span>'
			return res;	
		}
	}
	
	Prop.prototype.formatWithUnit = function(i) {
		const value = this.rawValue(i);
		if (value === null)
			return APP.trans(this.missingValue);
		
		if (this.unit)
			return this.formatNonNull(value) + " " + this.unit;

		return this.formatNonNull(value);
	}
	
	Prop.prototype.precision = 6;
	
	Prop.prototype.numberFormat = function(value) {
		return value.format();
		//return value.toHTML(this.precision);
	}

	Prop.prototype.formatMin = function() {
		return this.format(this.lowIndex) + " (" + SYMBOLS[this.lowIndex] + ")";
	}
	
	Prop.prototype.formatMax = function() {
		return this.format(this.highIndex) + " (" + SYMBOLS[this.highIndex] + ")";
	}
	
	Prop.prototype.getName = function(withunit, newline) {
		if (!withunit || this.unit === undefined)
			return T[this.key];
	
		return newline ? T[this.key] + "<br>[" + this.unit + "]" : T[this.key] + " [" + this.unit + "]";
	}
								 
	return {
		selected: null,
		defaultMissingValue: "&#8212;",
		sort: function() {
			list.sort(compare);
		},
		
		restart: function() { currentIndex = -1; },
		
		next: function() {
			currentIndex++;
			return (currentIndex < list.length);
		},
		
		get: function() {
			return list[currentIndex];
		},
		
		add: function(key, data, options) {
			list.push(new Prop(key, data, options));
		},
		
		showRange: function(show) {
			show = (show === undefined || show);
			$("#minvalue").html( show ? this.selected.formatMin() : "" );
			$("#maxvalue").html( show ? this.selected.formatMax() : "" );
		}
	};
})();

PROPERTIES.add("name", SYMBOLS, { numeric: false, category: "generalprop",
				 	format: function(value) { return T[value]; }
				});

PROPERTIES.add("atomicnumber", function(i) { return i; }, {
					info: "atomicnumberinfo", category: "generalprop"
				});

function Colormap(label, func) {
	this.label = label;
	this.apply = func;
}

/*function RegisterColormap(label, func) {
	COLORMAPS.push(new Colormap(label, func));
	if (COLORMAPS.selected === undefined)
		COLORMAPS.selected = COLORMAPS[0];
}*/

const RAINBOW = function(x) {
	if (x < 0.5) {
		x = 2.0 * x;
		let y = 1.0 - x;
		x = Math.sqrt(x);
		y = Math.sqrt(y);
		let m = Math.max(x, y);
		return RGB2HTML( 0.0, x / m, y / m);
	} else {
		x = 2.0 * x - 1.0;
		let y = 1.0 - x;
		x = Math.sqrt(x);
		y = Math.sqrt(y);
		let m = Math.max(x, y);
		return RGB2HTML( x / m, y / m, 0.0);
	}
};

RAINBOW.key = 'rainbow';

const YELLOW = function(x) {
	const y = Math.sqrt(1.0 - x + 0.1);
	x = Math.sqrt(x + 0.2);
	const m = Math.max(x, y);
	return RGB2HTML( x / m, y / m, 0.0);
};

YELLOW.key = 'yellow';

const RED = function(x) { return RGB2HTML( 1, 1 - x, 1 - x); };

RED.key = 'red';

/*RegisterColormap("Grey",
				function(x) {
					return RGB2HTML( x, x, x);
				});*/

const LINEAR_SCALE = function(x, min, max) {
	return (x - min) / (max - min);
};

const LOG_SCALE = function(x, min, max) {
	return (Math.log(x) - Math.log(min)) / (Math.log(max) - Math.log(min));
};

var COLORMAP = RAINBOW;

var SCALE = LINEAR_SCALE;

var PropInfoIcon = (function(){
	function iconClick() {
		var dlg = Dialogs.create();
		var prop = this.getObj();
		dlg.setWidth("35em");
		dlg.setInit( function() {
			var info = prop.key + "info";
			if (APP.hasContent(info))
				this.addContent( Para(APP.trans(info)) );
			
			if (prop.source) {
				var text = T.source + ":";
				for (var i = 0; i < prop.source.length; i++)
					text += "<br>" + (i+1).toString() + ". " + prop.source[i];			
				this.addContent( Para(text) );
			}
			
			dlg.setTitle( T[prop.key] ).addFoot( CloseBtn(T.ok) ).addIcon( CloseIcon() );
		});
		
		dlg.showAt(this);
	}

	return function(prop) {
		return InfoIcon(iconClick).setObj(prop);
	}
})();



var getDataDlg = (function() {
	var dlg = null;
	var list;
	
	function clearClick(){
		if (PROPERTIES.selected) {
			list.setSelected(null);
			selectionChange();
		}
	}
	
	function selectionChange() {
		PROPERTIES.selected = list.getSelectedObj();
		PERTAB.displayProperty();
		if (GROUPS.isSelected())
			GROUPS.clearSelection();
		else
			PERTAB.updateColors();
	}
	
	return function() {
		if (dlg === null) {
			dlg = Dialogs.create();
			dlg.setWidth("20em");
			dlg.setInit(function() {
				this.setTitle(T.data);
				this.addFoot( [Button(T.clear, clearClick), HideBtn()] ).addIcon( HideIcon() );
				list = RadioList(true).setScroll("10em").onSelChange(selectionChange);
				this.addContent( list );
				var cat = "";
				PROPERTIES.restart();
				while (PROPERTIES.next()) {
					var prop = PROPERTIES.get();
					if (prop.category != cat) {
						cat = prop.category;
						list.newregion(T[cat]);
					};
					list.add(prop.getName(), prop);
					if ( APP.hasContent(prop.key + "info") || prop.source )
						list.getLast().append( PropInfoIcon(prop) );
				}
			
				list.setSelectedObj( PROPERTIES.selected );
			});
		}

		return dlg;
	}
})();



var getColorDlg = (function() {
	let dlg = null;
	let scaling;
	let map;
	
	function selectionChange() {
		SCALE = scaling.getSelected().getObj();
		COLORMAP = map.getSelected().getObj();
		
		if (PROPERTIES.selected && PROPERTIES.selected.numeric) {
			if (COLORMAP && GROUPS.isSelected())
				GROUPS.clearSelection();
			else if (!GROUPS.isSelected())
				PERTAB.updateColors();
		} else if (COLORMAP)
			Message(T.selectdataforcolormap).showModalAt(scaling);
	};
	
	return function() {
		if (dlg === null) {
			dlg = Dialogs.create();
			dlg.setWidth("11em");
			dlg.setInit(function() {
				this.setTitle(T.colormap).addFoot( HideBtn() ).addIcon( HideIcon() );
				
				scaling = RadioList().setHint(T.scalinghint).onSelChange(selectionChange);
				scaling.add(T.linear, LINEAR_SCALE);
				scaling.add(T.log, LOG_SCALE);
				scaling.setSelectedObj( LINEAR_SCALE );
				
				map = RadioList().setHint(T.colormaphint).onSelChange(selectionChange);
				map.add(T.none, null);
				map.add(T[RAINBOW.key], RAINBOW);
				map.add(T[YELLOW.key], YELLOW);
				map.add(T[RED.key], RED);
				map.setSelectedObj( COLORMAP );
				
				this.addContent([ Heading(T.scaling + ":"), scaling, Heading(T.colormap + ":"), map ]);
			});
		}
	
		return dlg;
	}
})();

var getPlotDlg = (function() {
	var dlg = null;
	var list;
	
	var clearClick = function() {
		list.clearSelection();
	}

	var okClick = function() {
		var selected = [];
		dlg.selected = selected;
		var items = list.getItems();
		
		for (var i = 0; i < items.length; i++)
			if (items[i].isChecked())
				selected.push(items[i].getObj());
		
		if (selected.length == 0) {
			Message(T.selectdataforplot).showModalAt(this);
			return;
		}
		
		dlg.hide();
		window.open("plot.htm", "plotWnd", "height=500,width=1000,resizable=yes,location=no,toolbar=no,menubar=no,scrollbars=no", false);
	}
	
	return function(){
		if (dlg === null) {
			dlg = Dialogs.create();
			dlg.setWidth("22em");
			dlg.setInit(function() {
				this.setTitle(T.plot).addIcon( HideIcon() );
				this.addFoot( [Button(T.clear, clearClick), Button(T.ok, okClick), HideBtn(T.cancel)] );
				list = CheckList(true).setScroll("15em").margBottom("6px");
				var cat = "";
				PROPERTIES.restart();
				while (PROPERTIES.next()) {
					var prop = PROPERTIES.get();
					if (prop.numeric) {
						if (prop.category != cat) {
							cat = prop.category;
							list.newregion(T[cat]);
						};
						list.add(prop.getName(false), prop);
					}
				}
				this.rescale = LabelCheck(T.rescale);
				this.log = LabelCheck(T.logscale).margLeft("15px");
				this.addContent( [list, this.rescale, this.log] );
			});
		}

		return dlg;
	}
})();

var getListDlg = (function() {
	var dlg = null;
	var combo = null;
	var count = 9; //max number of columns
	var selected = [];
	
	var okClick = function() {
		selected.clear();
		for (var i = 0; i < combo.length; i++) {
			var c = combo[i];
			if (c.selectedIndex > 0)
				selected.push(c.getSelected().getObj());
		}
		
		if (selected.length == 0) {
			Message(T.selectdataforplot).showModalAt(this);
			return;
		}
		
		dlg.hide();
		window.open("list.htm", "listWnd", "height=600,width=600,resizable=yes,location=no,toolbar=no,menubar=no,scrollbars=yes", false);
	}
	
	return function(){
		if (dlg === null) {
			dlg = Dialogs.create();
			dlg.setWidth("24em");
			combo = new Array(count);
			for (var i = 0; i < count; i++)
				combo[i] = Combo();
			dlg.getSelected = function() { return selected; };
			dlg.setInit( function() {
				this.setTitle(T.table).addFoot( [Button(T.ok, okClick), HideBtn(T.cancel)] ).addIcon( HideIcon() );
				var grid = Grid(2);
				for (var i = 0; i < count; i++) {
					var sel = (combo[i].length > 0 ? combo[i].selectedIndex : 0);
					combo[i].clear();
					combo[i].addItem(T.none, null);
					combo[i].addItem(T.symbol,  { format: function(index) { return SYMBOLS[index]; },
												getName: function() { return T.symbol; } } );
					PROPERTIES.restart();
					while (PROPERTIES.next()) {
						var prop = PROPERTIES.get();
						combo[i].addItem(prop.getName(), prop);
					}
						
					combo[i].selectedIndex = sel;
					grid.add( [T.column + " " + (i+1).toString() + ":", combo[i]] );
				}
				this.addContent(grid);
			});
		}
	
		return dlg;
	}
})();

var getHistDlg = (function() {
	var dlg = null;
	var editStart;
	var editStop;
	var editStep;
	var list;

	var okClick = function() {
		if (!(dlg.selected)) {
			Message(T.selectdataforhist).showModalAt(this);
			return;
		}
		
		dlg.start = parseFloat(editStart.value);
		dlg.stop = parseFloat(editStop.value);
		dlg.step = parseFloat(editStep.value);

		if (Number.isNaN(dlg.start)) {
			editStart.focus();
			editStart.select();
			Message(T.floaterror + ": " + editStart.value).showModalAt(editStart);
			return;
		}
		
		if (Number.isNaN(dlg.stop)) {
			editStop.focus();
			editStop.select();
			Message(T.floaterror + ": " + editStop.value).showModalAt(editStop);
			return;
		}
		
		if (Number.isNaN(dlg.step)) {
			editStep.focus();
			editStep.select();
			Message(T.floaterror + ": " + editStep.value).showModalAt(editStep);
			return;
		}

		if (dlg.start > dlg.stop) {
			var tmp = dlg.stop;
			dlg.stop = dlg.start;
			dlg.start = tmp;
		}
		
		dlg.step = Math.abs(dlg.step);
		dlg.count = Math.ceil((dlg.stop - dlg.start) / dlg.step);

		dlg.hide();
		window.open("histogram.htm", "plotWnd", "height=500,width=1000,resizable=yes,location=no,toolbar=no,menubar=no,scrollbars=no", false);
	}
	
	var itemClick = function() {
		dlg.selected = list.getSelectedObj();
		editStart.value = dlg.selected.minval;
		editStop.value = dlg.selected.maxval;
		editStep.value = (dlg.selected.maxval - dlg.selected.minval) / 10;
	}
	
	return function(){
		if (dlg === null) {
			dlg = Dialogs.create();
			dlg.setWidth("20em");
			editStart = Edit();
			editStop = Edit();
			editStep = Edit();
			dlg.setInit(function() {
				list = RadioList(true).setScroll("15em").onItemClick(itemClick)
				var cat = "";
				PROPERTIES.restart();
				while (PROPERTIES.next()) {
					var prop = PROPERTIES.get();
					if (prop.numeric) {
						if (prop.category != cat) {
							cat = prop.category;
							list.newregion(T[cat]);
						};
						list.add(prop.getName(), prop);
					}
				}
				if (dlg.selected)
					list.setSelectedObj(dlg.selected);
			
				var grid = Grid(2).margTop("5px");
				grid.add( [T.start + ":", editStart] );
				grid.add( [T.stop + ":", editStop] );
				grid.add( [T.step + ":", editStep] );
				
				this.setTitle(T.histogram).addContent( [list, grid] );
				this.addFoot( [Button(T.ok, okClick), HideBtn(T.cancel)] ).addIcon( HideIcon() );
			});
		}

		return dlg;
	};
})();