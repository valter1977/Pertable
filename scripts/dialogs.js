"use strict";

//loadCss("../styles/dialogs.css");

var Dialogs = (function(){
	var dlgs = [];
	var dragobj = null;
	var dx;
	var dy;
	
	function frameMouseDown() {
		this.style.zIndex = getMaxZindex() + 1;
	}
	
	function headerMouseDown(evt) {
		if (evt === undefined && 'event' in window)
			evt = window.event;

		dragobj = this.parentNode; //frame of dialog
		dragobj.style.cursor = "move";
		dx = parseInt(dragobj.style.left, 10) - evt.clientX;
		dy = parseInt(dragobj.style.top, 10) - evt.clientY;
		document.body.onmousemove = bodyMouseMove;
		document.body.onmouseup = bodyMouseUp;
		disableSelect();
	}
	
	function bodyMouseMove(evt) {
		if (dragobj) {
			if (evt === undefined && 'event' in window)
				evt = window.event;

			dragobj.style.left = (evt.clientX + dx) + "px";
			dragobj.style.top = (evt.clientY + dy) + "px";
		}
	}
	
	function bodyMouseUp() {
		if (dragobj) {
			dragobj.style.cursor = "default";
			dragobj = null;
		}
		document.body.onmousemove = null;
		document.body.onmouseup = null;
		disableSelect(false);
	}
	
	function Dial(id) {
		var title = Container().setClass('dialog-title');
		var icons = Container().setClass("dialog-head-icons");
		var header = Container([title, icons]).setClass('dialog-header').onMouseDown(headerMouseDown);
		var content = Container().setClass('dialog-content');
		var footer = Container().setClass('dialog-footer');
		var frame = Container(
				[header, content, footer]).setClass('dialog-frame').onMouseDown(frameMouseDown).setObj(this);
		document.body.appendChild(frame);
		
		this.clear = function() {
			icons.innerHTML = "";
			content.innerHTML = "";
			footer.innerHTML = "";
		};
		
		this.setScroll = function(height) {
			content.style.height = height;
			content.style.overflow = "auto";
		};
		
		this.getId = function() {
			return id;
		};
		
		this.setTitle = function(text) { title.innerHTML = text; return this; };
		this.addIcon = function(array){ icons.append(array); return this; };
		this.addContent = function(array){ content.append(array); return this; };
		this.addFoot = function(array){ footer.append(array); return this; };
		this.getFrame = function(){ return frame; };
		
		dlgs.push(this);
	};

	Dial.prototype.setInit = function(init) {
		this.initContent = init;
		this.initContent();
	}
	
	Dial.prototype.reinit = function() {
		if (this.initContent) {
			this.clear();
			this.initContent();
		}
	}

	Dial.prototype.remove = function() {
		dlgs.remove(this); 
		document.body.removeChild(this.getFrame());
		if (this.hider) {
			document.body.removeChild(this.hider);
			this.hider = null;
		}
	}
	
	Dial.prototype.show = function() {
		var style = this.getFrame().style;
		
		if (style.display == "block")
			return this;

		style.display = "block";
		style.zIndex = getMaxZindex() + 1;
		if (this.showFocus)
			this.showFocus.focus();
		return this;
	}
	
	Dial.prototype.showAt = function(element) {
		var style = this.getFrame().style;
		var offset = $(element).offset();
		style.left = offset.left + 'px';
		style.top = offset.top + 'px';
		style.display = "block";
		style.zIndex = getMaxZindex() + 1;
		if (this.showFocus)
			this.showFocus.focus();
		return this;
	}
	
	Dial.prototype.showModalAt = function(element, onresult) {
		this.hider = document.createElement("div");
		this.hider.className = "dialog-hider";
		this.hider.style.zIndex = getMaxZindex() + 1;
		document.body.appendChild(this.hider);
		this.setModalResult = function(type) {
			if (onresult)
				onresult(type);
			this.remove();
		}
		this.showAt(element);
	}
	
	Dial.prototype.hide = function() {
		this.getFrame().style.display = "none";
		return this;
	}
	
	Dial.prototype.visible = function() {
		return this.getFrame().style.display != "none";
	}
	
	Dial.prototype.move = function(x,y)	{
		var frame = this.getFrame();
		
		if (x === undefined) //screen center if unspecified
		{
			x = Math.floor(0.5 * (document.body.clientWidth - frame.offsetWidth)) + document.body.scrollLeft;
			if (x < 0)
				x = 0;
		}
		
		if (y === undefined) //screen center if unspecified
		{
			y = Math.floor(0.5 * (document.body.clientHeight - frame.offsetHeight)) + document.body.scrollTop;
			if (y < 0)
				y = 0;
		}
		
		frame.style.left = x + 'px';
		frame.style.top = y + 'px';
		return this;
	}
	
	Dial.prototype.setWidth = function(value) {
		this.getFrame().setWidth(value);
		return this;
	}
	
	Dial.prototype.setHeight = function(value) {
		this.getFrame().setHeight(value);
		return this;
	}
	
	return {
		create: function(tag) {
			return new Dial(tag);
		},
		
		reinit: function(id) {
			for (var i = 0; i < dlgs.length; i++){
				var dlg = dlgs[i];
				if (id === undefined || dlg.getId() == id)
					dlg.reinit();
			}
		},
		
		isDialog: function(obj) {
			return (obj instanceof Dial);
		}
	}
})();


var Element = (function(){
	function getDlg(){
		var node = this;
		while (node && node.getObj) {
			var obj = node.getObj();
			if (Dialogs.isDialog(obj))
				return obj;
			node = node.parentNode;
		}
		return null;
	}
	
	function setCursor(value) {
		this.style.cursor = value;
		return this;
	}
	
	function newline() {
		this.appendChild(document.createElement("br"));
		return this;
	}
		
	function set(attr, value) {
		this.setAttribute(attr, value);
		return this;
	}

	function setPos(pos) {
		this.style.position = pos;
		return this;
	}
	
	function setId(id) {
		return this.set('id', id);
	}
	
	function setClass(name) {
		this.className = name;
		return this;
	}

	function setHint(hint) {
		this.onmouseover = function() {
			Tooltip(hint).showAt(this);
		}
		
		return this;
		//return this.set("title", hint);
	}

	function onLoad(fn) {
		setEvtHandler(this, "load", fn);
		return this;
	}

	function onClick(fn) {
		setEvtHandler(this, "click", fn);
		this.setCursor("pointer");
		return this;
	}

	function onMouseDown(fn) {
		setEvtHandler(this, "mousedown", fn);
		return this;
	}
	
	function onMouseUp(fn) {
		setEvtHandler(this, "mouseup", fn);
		return this;
	}

	function setLeft(left) {
		this.style.left = left;
		return this;
	}

	function setRight(right) {
		this.style.right = right;
		return this;
	}

	function setTop(top) {
		this.style.top = top;
		return this;
	}
	
	function setBottom(bottom) {
		this.style.bottom = bottom;
		return this;
	}

	function margBottom(value) {
		this.style.marginBottom = value;
		return this;
	}

	function margLeft(value) {
		this.style.marginLeft = value;
		return this;
	}

	function margRight(value) {
		this.style.marginRight = value;
		return this;
	}

	function margTop(value) {
		this.style.marginTop = value;
		return this;
	}

	function setWidth(value) {
		this.style.width = value;
		return this;
	}

	function setHeight(value) {
		this.style.height = value;
		return this;
	}
	
	function hFill() {
		this.style.width = "100%";
		return this;
	}

	function verAlign(value) {
		this.style.verticalAlign = value;
		return this;
	}

	return function(tag) {
		var object;
		var element = document.createElement(tag);
		element.getDlg = getDlg;
		element.hFill = hFill;
		element.margBottom = margBottom;
		element.margLeft = margLeft;
		element.margRight = margRight;
		element.margTop = margTop;
		element.newline = newline;
		element.onClick = onClick;
		element.onLoad = onLoad;
		element.onMouseDown = onMouseDown;
		element.set = set;
		element.setBottom = setBottom;
		element.setClass = setClass;
		element.setCursor = setCursor;
		element.setHeight = setHeight;
		element.setHint = setHint;
		element.setId = setId;
		element.setLeft = setLeft;
		element.setObj = function(obj) {
			object = obj;
			return this;
		};
		element.getObj = function() {
			return object;
		};
		element.setPos = setPos;
		element.setRight = setRight;
		element.setTop = setTop;
		element.setWidth = setWidth;
		element.verAlign = verAlign;
		return element;
	};
})();

var Container = (function(){
	function append(content) {
		if (!Array.isArray(content))
			content = [content];
		for (var i = 0; i < content.length; i++)
			if (String.isString(content[i]))
				this.appendChild(document.createTextNode(content[i]));
			else
				this.appendChild(content[i]);
		return this;
	}
	
	function html(str) {
		if (str === undefined)
			return this.innerHTML;
			
		this.innerHTML = str;
		return this;
	}
	
	function setScroll(height) {
		if (height) 
			this.style.height = height;
		
		this.style.overflow = "auto";
		return this;
	}

	function horAlign(value) {
		this.style.textAlign = value;
		return this;
	}

	function setWrap(value) {
		if (!String.isString(value))
			value = (value === undefined || value) ? 'normal' : 'nowrap';		
		
		this.style.whiteSpace = value;
		return this;
	}
	
	return function(tag) {
		var cont;
		if (String.isString(tag))
			cont = Element(tag);
		else
			cont = Element("div");

		cont.append = append;
		cont.horAlign = horAlign;
		cont.html = html;
		cont.setScroll = setScroll;
		cont.setWrap = setWrap;
		
		if (tag && !String.isString(tag))
			cont.append(tag);
		return cont;
	};
})();


var Input = (function(){
	function onChange(fn) {
		setEvtHandler(this, "change", fn);
		return this;
	}
	
	return function(type) {
		var input = Element("input");
		input.setAttribute("type", type);
		input.onChange = onChange;
		return input;
	};
})();

var Check = function() {
	return Input("checkbox").setClass("dialog-check");
}
	
function LabelCheck(caption) {
	var cont = Span().setClass("dialog-label-check");
	var id = uid();
	cont.check = Check().setId(id);
	cont.append( cont.check );
	cont.append( cont.label = Label(caption).setFor(id) );		
	return cont;
}
	
function Radio() {
	return Input("radio").setClass("dialog-radio");;
}

var ListItem = (function(){
	function isChecked() {
		return this.getInput().checked;
	}
	
	function getList() {
		var node = this.parentNode;
		while (!node.getItems)
			node = node.parentNode;
		return node;
	}
	
	function onClick(fn) {
		if (String.isString(fn))
			fn = new Function(fn);

		this.itemClick = fn; //cannot use "onclick"
		return this;
	}
	
	function inputClick(){
		if (this.parentNode.inputClick)
			this.parentNode.inputClick();
		if (this.parentNode.itemClick)
			this.parentNode.itemClick();
	}
	
	return function(input, caption, obj) {
		var id = uid();
		input.setId(id).onClick(inputClick);
		var label = Label(caption).setFor(id);
		var listitem = Container([input, label]).setClass("dialog-list-item").setObj(obj);
		listitem.getInput = function(){ return input; };
		listitem.getLabel = function(){ return label; };
		listitem.isChecked = isChecked;
		listitem.onClick = onClick;
		listitem.getList = getList;
		return listitem;
	};
})();

var CheckItem = (function(){
	function setChecked(checked) {
		this.getInput().checked = (checked === undefined || checked);
		return this;
	}

	return function(caption, obj){
		var listitem = ListItem( Check(), caption, obj );
		listitem.setChecked = setChecked;
		return listitem;
	};
})();

function RadioItem(caption, obj) {
	return ListItem( Radio(), caption, obj );
};

var List = (function(){
	function inputClick(){ //for internal use
		var list = this.getList();
		if (list.inputClick) //for selection control in radio list
			list.inputClick(this);
		if (list.itemClick) //use event
			list.itemClick(this);
	}
	
	function onItemClick(fn) {
		if (String.isString(fn))
			fn = new Function(fn);
		this.itemClick = fn;
		return this;
	}
	
	function addItem(listitem) {
		this.region.append(listitem);
		this.getItems().push(listitem);
		listitem.inputClick = inputClick;
		return listitem;
	}
	
	function newregion(caption) {
		var title = Heading(caption);
		this.append(title);
		var region = Container().setClass("dialog-list-region");
		this.append(region);
		this.region = region;
		title.onclick = function() { $(region).toggle(); };
		return this;
	}
	
	function getLast() {
		var items = this.getItems();
		if (items.length)
			return items[items.length - 1];
		else
			return null;
	}

	return function(border) {
		var list = Container();
		if (border)
			list.setClass("dialog-list-border");
		else
			list.setClass("dialog-list");
		
		var items = [];
		list.getItems = function(){ return items; };
		list.addItem = addItem;
		list.region = list;
		list.newregion = newregion;
		list.getLast = getLast;
		list.onItemClick = onItemClick;
		return list;
	};
})();

var CheckList = (function(){
	function add(caption, obj) {
		return this.addItem( CheckItem(caption, obj) );
	}
	
	function clearSelection() {
		var items = this.getItems();
		for (var i = 0; i < items.length; i++)
			items[i].setChecked(false);
		return this;
	}
	
	return function(border) {
		var list = List(border);
		list.add = add;
		list.clearSelection = clearSelection;
		return list;
	};
})();					 

var RadioList = (function(){
	function add(caption, obj) {
		return this.addItem( RadioItem(caption, obj) );
	}
	
	function inputClick(listitem){
		this.setSelected(listitem, true);
	}
	
	function onSelChange(fn) {
		if (String.isString(fn))
			fn = new Function(fn);
		this.selectionChange = fn;
		return this;
	}
	
	function setSelectedObj(obj) {
		var items = this.getItems();
		for (var i = 0; i < items.length; i++)
			if (items[i].getObj() === obj){
				this.setSelected(items[i]);
				break;
			}
		return this;
	}
	
	function getSelectedObj() {
		var listitem = this.getSelected();
		return (listitem === null ? null : listitem.getObj());
	}
	
	return function(border) {
		var selitem = null;
		var list = List(border);
		list.add = add;
		list.inputClick = inputClick;
		list.onSelChange = onSelChange;
		list.setSelectedObj = setSelectedObj;
		list.getSelectedObj = getSelectedObj;
		list.getSelected = function() { return selitem; }
		list.setSelected = function(listitem, evt) {
			if (selitem === listitem)
				return;
				
			if (selitem) {
				selitem.getInput().checked = false;
				selitem = null;
			}
				
			if (listitem) {
				listitem.getInput().checked = true;
				selitem = listitem;
				
			if (evt && list.selectionChange)
				list.selectionChange();
			}
		}
		return list;
	};
})();

var Combo = (function() {
	function addItem(caption, obj) {
		var option = Element("option").setObj(obj);
		option.text = caption;
		this.add(option);
		return option;
	}
	
	function getSelected() {
		return this.options[this.selectedIndex];
	}
	
	function clear() {
		this.innerHTML = "";
	}
	
	return function(size) {
		var combo = Element("select").setClass("dialog-select");
		if (size != undefined)
			combo.setAttribute("size", size);
		combo.addItem = addItem;
		combo.getSelected = getSelected;
		combo.clear = clear;
		return combo;
	};
})();

function Button(caption, onclick) {
	var button = Input("button").setClass("dialog-button").onClick(onclick);
	button.value = caption;
	return button;
}

function CloseBtn(caption){
	return Button(caption || T.close.capitalize(), "this.getDlg().remove()");
}

function HideBtn(caption) {
	return Button(caption || T.close.capitalize(), "this.getDlg().hide()");
}

function ModalBtn(caption, result) {
	return Button(caption, function() { this.getDlg().setModalResult(result); });
}

function BitBtn(src, caption, onclick, accel) {
	var button = Container("button").set("type", "button").setClass("dialog-bitbtn").onClick(onclick).html('<img src="icons/' + src + '.png"><br><strong>' + caption + '</strong>');
	if (accel)
		$(document).hotKey(accel, function() { button.click(); return false; });
	return button;
}

function Edit(text) {
	var edit = Input("edit").setClass("dialog-edit");
	if (text)
		edit.value = text;
	return edit;
}

function Textarea(text, rows) {
	var edit = Element("textarea").setClass("dialog-textarea");
	if (text)
		edit.value = text;
	if (rows)
		edit.rows = rows;
	return edit;
}

var Picture = function(src) {
	return Element("img").set("src", src);
};

var Icon = function(src){
	return Picture(src).setClass("dialog-icon");
}

var CloseIcon = function(){
	return Icon("icons/close.png").onClick("this.getDlg().remove()").setHint(T.close);
};
	
var HideIcon = function(){
	//show tooltip "Close", even if just hiding the dialog
	return Icon("icons/close.png").onClick("this.getDlg().hide()").setHint(T.close);
};

var InfoIcon = function(onclick){
	return Icon("icons/info-small.png").setHint(T.info).onClick(onclick);
};

var Label = (function(){
	function setFor(id) {
		return this.set("htmlFor", id).set("for", id);
	}

	return function(caption) {
		var label = Element("label").setClass("dialog-label");
		label.setFor = setFor;
		label.appendChild(document.createTextNode(caption));
		return label;
	};
})();

var Para = function(content) {
	var para = Container("p");
	if (content)
		para.innerHTML = content;
	return para;
};

var Heading = function(level, content) {
	var heading;
	if (level === undefined)
		heading = Container("h1");
	else if (String.isString(level)) {
		heading = Container("h1");
		heading.innerHTML = level;
	} else {	
		heading = Container("h" + level.toString());
		if (content)
			heading.innerHTML = content;
	}
	return heading;
};

var Span = function(content) {
	var span = Container("span");
	if (content)
		span.innerHTML = content;
	return span;
};

var Grid = (function() {
	function addCell(header) {
		if (this.cindex == 1)
			this.row = this.insertRow(-1);
	
		var cell = header ? Container("th") : Container("td");
		this.row.appendChild(cell);
		this.cindex++;
	
		if (this.cindex > this.cols)
			this.cindex = 1;
		
		return cell;
	}
	
	function addLabel(caption) {
		return this.addCell(false).setClass('dialog-label').html(caption);
	}
	
	function addInput(input) {
		var cell = this.addCell(false).setClass('dialog-input');
		if (input)
			cell.append(input.hFill());
		return cell;
	}
	
	function add(array) {
		for (var i = 0; i < array.length; i++)
			if (String.isString(array[i]))
				this.addLabel(array[i]);
			else if (Object.isDOM(array[i]))
				this.addInput(array[i]);
	}
	
	function cellSpace(space) {
		return this.set("cellspacing", space);
	}
	
	function cellPad(pad) {
		return this.set("cellpadding", pad);
	}
	
	return function(cols) {
		var grid = Element("table").setClass('dialog-grid');
		grid.cols = cols || 2;
		grid.cindex = 1;
		grid.addCell = addCell;
		grid.addLabel = addLabel;
		grid.addInput = addInput;
		grid.add = add;
		grid.cellSpace = cellSpace;
		grid.cellPad = cellPad;
		return grid.cellSpace(0);
	};
})();

var Separator = function() {
	var hr = document.createElement("hr");
	hr.className = "dialog-rule";
	return hr;
};

var Newline = function() {
	return document.createElement("br");
};


var Tooltip = (function() {
	var tooltip = null;
	var timeout = null;
	
	function reachTimeout() {
		tooltip.hide();
	}
	
	return function(content) {
		if (tooltip === null) {
			tooltip = Container().setClass('dialog-tooltip');
			document.body.appendChild(tooltip);
			
			tooltip.showAt = function(element, time) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				
				this.style.display = "block";
				var offset = $(element).offset();
				this.style.left = offset.left + 'px';
				this.style.top = (offset.top - tooltip.offsetHeight) + 'px';
				this.style.zIndex = getMaxZindex() + 1;
				timeout = setTimeout(reachTimeout, time || 5000);
				return this;
			}
			
			tooltip.hide = function() {
				this.style.display = "none";
				return this;
			}
			
			tooltip.onmouseover = function() { this.hide(); };
		}
		
		if (content) 
			tooltip.html(content);
		
		return tooltip;
	};
})();

function Message(msgkey, titlekey) { //translatable message box
	var dlg = Dialogs.create();
	dlg.getFrame().setWidth("30em");
	dlg.setInit( function() {
		if (titlekey)
			this.setTitle( APP.trans(titlekey).capitalize() );
		else
			this.setTitle( T.message.capitalize() );
		this.addIcon( CloseIcon() ).addFoot( CloseBtn(T.ok) );
		this.addContent( Para(APP.trans(msgkey)) );
	});
	
	return dlg;
}

function Prompt(msgkey, titlekey, text) {
	var dlg = Dialogs.create();
	dlg.getFrame().setWidth("20em");
	var edit = Textarea(text, 2).hFill();
	dlg.showFocus = edit;
	dlg.getValue = function() { return edit.value; };
	dlg.setInit( function() {
		if (titlekey)
			this.setTitle( APP.trans(titlekey).capitalize() );
		//this.addIcon( CloseIcon() ).addFoot( CloseBtn(T.ok) );
		this.addFoot( [ModalBtn(T.ok, "ok"), ModalBtn(T.cancel, "cancel")] );
		if (msgkey)
			this.addContent( Para(APP.trans(msgkey) + ":") );
		this.addContent(edit);
	});
	
	return dlg;
}

function tmsg(contentkey, titlekey) { //translatable message box
	Message(contentkey, titlekey).show().move();
}

function timg(titlekey, src) { //image with translatable title
	var dlg = Dialogs.create();
	
	function pictureLoad() {
		if (dlg.visible())
			dlg.move();
	}
	
	dlg.setInit( function() {
		this.setTitle( T[titlekey].capitalize() ).addIcon( CloseIcon() ).addFoot( CloseBtn(T.ok) );
		this.addContent( Picture(src).onLoad(pictureLoad) );
	});
	
	dlg.show().move();
}