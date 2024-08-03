"use strict";

loadCss("../styles/dialogs.css");

const Dialogs = (function(){
	const dlgs = [];
	let dragobj = null;
	let dx;
	let dy;
	
	function frameMouseDown() {
		this.style.zIndex = getMaxZindex() + 1;
	}
	
	function headerMouseDown(evt) {
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
		const title = Container().setClass('dialog-title');
		const icons = Container().setClass("dialog-head-icons");
		const header = Container([title, icons]).setClass('dialog-header').onMouseDown(headerMouseDown);
		const content = Container().setClass('dialog-content');
		const footer = Container().setClass('dialog-footer');
		const frame = Container(
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
		const style = this.getFrame().style;
		
		if (style.display == "block")
			return this;

		style.display = "block";
		style.zIndex = getMaxZindex() + 1;
		if (this.showFocus)
			this.showFocus.focus();
		return this;
	}
	
	Dial.prototype.showAt = function(element) {
		const style = this.getFrame().style;
		const offset = $(element).offset();
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
		const frame = this.getFrame();
		
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
			for (let i = 0; i < dlgs.length; i++){
				const dlg = dlgs[i];
				if (id === undefined || dlg.getId() == id)
					dlg.reinit();
			}
		},
		
		isDialog: function(obj) {
			return (obj instanceof Dial);
		}
	}
})();


const Element = (function(){
	function getDlg(){
		let node = this;
		while (node && node.getObj) {
			const obj = node.getObj();
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

const Container = (function(){
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


const Input = (function(){
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
	const cont = Span().setClass("dialog-label-check");
	const id = uid();
	cont.check = Check().setId(id);
	cont.append( cont.check );
	cont.append( cont.label = Label(caption).setFor(id) );		
	return cont;
}
	
function Radio() {
	return Input("radio").setClass("dialog-radio");;
}

const ListItem = (function(){
	function isChecked() {
		return this.getInput().checked;
	}
	
	function getList() {
		let node = this.parentNode;
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
		const id = uid();
		input.setId(id).onClick(inputClick);
		const label = Label(caption).setFor(id);
		const listitem = Container([input, label]).setClass("dialog-list-item").setObj(obj);
		listitem.getInput = function(){ return input; };
		listitem.getLabel = function(){ return label; };
		listitem.isChecked = isChecked;
		listitem.onClick = onClick;
		listitem.getList = getList;
		return listitem;
	};
})();

const CheckItem = (function(){
	function setChecked(checked) {
		this.getInput().checked = (checked === undefined || checked);
		return this;
	}

	return function(caption, obj){
		const listitem = ListItem( Check(), caption, obj );
		listitem.setChecked = setChecked;
		return listitem;
	};
})();

function RadioItem(caption, obj) {
	return ListItem( Radio(), caption, obj );
};

const List = (function(){
	function inputClick(){ //for internal use
		const list = this.getList();
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
		const title = Heading(caption);
		this.append(title);
		const region = Container().setClass("dialog-list-region");
		this.append(region);
		this.region = region;
		title.onclick = function() { $(region).toggle(); };
		return this;
	}
	
	function getLast() {
		const items = this.getItems();
		if (items.length)
			return items[items.length - 1];
		else
			return null;
	}

	return function(border) {
		const list = Container();
		if (border)
			list.setClass("dialog-list-border");
		else
			list.setClass("dialog-list");
		
		const items = [];
		list.getItems = function(){ return items; };
		list.addItem = addItem;
		list.region = list;
		list.newregion = newregion;
		list.getLast = getLast;
		list.onItemClick = onItemClick;
		return list;
	};
})();

const CheckList = (function(){
	function add(caption, obj) {
		return this.addItem( CheckItem(caption, obj) );
	}
	
	function clearSelection() {
		const items = this.getItems();
		for (var i = 0; i < items.length; i++)
			items[i].setChecked(false);
		return this;
	}
	
	return function(border) {
		const list = List(border);
		list.add = add;
		list.clearSelection = clearSelection;
		return list;
	};
})();					 

const RadioList = (function(){
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
		const items = this.getItems();
		for (let i = 0; i < items.length; i++)
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
		let selitem = null;
		const list = List(border);
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

const Combo = (function() {
	function addItem(caption, obj) {
		const option = Element("option").setObj(obj);
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
		const combo = Element("select").setClass("dialog-select");
		if (size != undefined)
			combo.setAttribute("size", size);
		combo.addItem = addItem;
		combo.getSelected = getSelected;
		combo.clear = clear;
		return combo;
	};
})();

function Button(caption, onclick) {
	const button = Input("button").setClass("dialog-button").onClick(onclick);
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
	const button = Container("button").set("type", "button").setClass("dialog-bitbtn").onClick(onclick).html('<img src="icons/' + src + '.png"><br><strong>' + caption + '</strong>');
	if (accel)
		$(document).hotKey(accel, function() { button.click(); return false; });
	return button;
}

function Edit(text) {
	const edit = Input("edit").setClass("dialog-edit");
	if (text)
		edit.value = text;
	return edit;
}

function Textarea(text, rows) {
	const edit = Element("textarea").setClass("dialog-textarea");
	if (text)
		edit.value = text;
	if (rows)
		edit.rows = rows;
	return edit;
}

const Picture = function(src) {
	return Element("img").set("src", src);
};

const Icon = function(src){
	return Picture(src).setClass("dialog-icon");
}

const CloseIcon = function(){
	return Icon("icons/close.png").onClick("this.getDlg().remove()").setHint(T.close);
};
	
const HideIcon = function(){
	//show tooltip "Close", even if just hiding the dialog
	return Icon("icons/close.png").onClick("this.getDlg().hide()").setHint(T.close);
};

const InfoIcon = function(onclick){
	return Icon("icons/info-small.png").setHint(T.info).onClick(onclick);
};

const Label = (function(){
	function setFor(id) {
		return this.set("htmlFor", id).set("for", id);
	}

	return function(caption) {
		const label = Element("label").setClass("dialog-label");
		label.setFor = setFor;
		label.appendChild(document.createTextNode(caption));
		return label;
	};
})();

const Para = function(content) {
	const para = Container("p");
	if (content)
		para.innerHTML = content;
	return para;
};

const Heading = function(level, content) {
	let heading;
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

const Span = function(content) {
	const span = Container("span");
	if (content)
		span.innerHTML = content;
	return span;
};

const Grid = (function() {
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
		const cell = this.addCell(false).setClass('dialog-input');
		if (input)
			cell.append(input.hFill());
		return cell;
	}
	
	function add(array) {
		for (let i = 0; i < array.length; i++)
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
		const grid = Element("table").setClass('dialog-grid');
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

const Separator = function() {
	const hr = document.createElement("hr");
	hr.className = "dialog-rule";
	return hr;
};

const Newline = function() {
	return document.createElement("br");
};


const Tooltip = (function() {
	let tooltip = null;
	let timeout = null;
	
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
	const dlg = Dialogs.create();
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
	const dlg = Dialogs.create();
	dlg.getFrame().setWidth("20em");
	const edit = Textarea(text, 2).hFill();
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
	const dlg = Dialogs.create();
	
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