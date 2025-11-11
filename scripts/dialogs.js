"use strict";

loadCss("styles/dialogs.css");

var DIALOGS = (function(){
	var dlgs = [];
	var dragobj = null;
	var dx;
	var dy;
	
	function headerMouseDown(evt) {
		if (evt === undefined)
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
			if (evt === undefined)
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
		var title = Container().cls('dialog-title');
		var icons = Container().cls("dialog-head-icons");
		var header = Container([title, icons]).cls('dialog-header').on('mousedown', headerMouseDown);
		var content = Container().cls('dialog-content');
		var footer = Container().cls('dialog-footer');
		var frame = Container([header, content, footer]).cls('dialog-frame').obj(this);
		frame.on('mousedown', frame.front);
		document.body.appendChild(frame);
		
		this.clear = function() {
			icons.innerHTML = "";
			content.innerHTML = "";
			footer.innerHTML = "";
		};
		
		this.scroll = function(height) {
			content.style.height = height;
			content.style.overflow = "auto";
		};
		
		this.id = function() {
			return id;
		};
		
		this.setTitle = function(text) { title.innerHTML = text; return this; };
		this.addIcon = function(array){ icons.append(array); return this; };
		this.addContent = function(array){ content.append(array); return this; };
		this.addFoot = function(array){ footer.append(array); return this; };
		this.frame = function(){ return frame; };
		
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
		document.body.removeChild(this.frame());
		if (this.hider) {
			document.body.removeChild(this.hider);
			this.hider = null;
		}
	}
	
	Dial.prototype.show = function() {
		var frame = this.frame();
		var style = frame.style;
		
		if (style.display == "block")
			return this;

		style.display = "block";
		frame.front();
		
		if (this.showFocus)
			this.showFocus.focus();
		return this;
	}
	
	Dial.prototype.showAt = function(element) {
		var frame = this.frame();
		var style = frame.style;
		var offset = $(element).offset();
		style.left = offset.left + 'px';
		style.top = offset.top + 'px';
		style.display = "block";
		frame.front();

		if (this.showFocus)
			this.showFocus.focus();
		return this;
	}
	
	Dial.prototype.showModalAt = function(element, onresult) {
		this.hider = Element("div").cls("dialog-hider").front();
		document.body.appendChild(this.hider);
		this.setModalResult = function(type) {
			if (onresult)
				onresult(type);
			this.remove();
		}
		this.showAt(element);
	}
	
	Dial.prototype.hide = function() {
		this.frame().style.display = "none";
		return this;
	}
	
	Dial.prototype.visible = function() {
		return this.frame().style.display != "none";
	}
	
	Dial.prototype.move = function(x,y)	{
		var frame = this.frame();
		
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
	
	Dial.prototype.width = function(value) {
		this.frame().setWidth(value);
		return this;
	}
	
	Dial.prototype.setHeight = function(value) {
		this.frame().setHeight(value);
		return this;
	}

	return {
		create: function(tag) {
			return new Dial(tag);
		},
		
		reinit: function(id) {
			for (var i = 0; i < dlgs.length; i++){
				var dlg = dlgs[i];
				if (id === undefined || dlg.id() == id)
					dlg.reinit();
			}
		},
		
		isDialog: function(obj) {
			return (obj instanceof Dial);
		}
	}
})();


var Element = (function(){
	function dialog() {
		var node = this;
		while (node && node.obj) {
			var obj = node.obj();
			if (DIALOGS.isDialog(obj))
				return obj;
			node = node.parentNode;
		}
		return null;
	}
	
	function cursor(value) {
		this.style.cursor = value;
		return this;
	}
	
	function newline() {
		this.appendChild(document.createElement("br"));
		return this;
	}
		
	function attr(name, value) {
		this.setAttribute(name, value);
		return this;
	}

	function setPos(pos) {
		this.style.position = pos;
		return this;
	}
	
	function cls(name) {
		this.className = name;
		return this;
	}

	function hfill() {
		this.style.width = "100%";
		return this;
	}

	function hint(content) {
		this.onmouseover = function() {
			Tooltip(content).showAt(this);
		}
		
		return this;
	}

	function on(type, handler) {
		setEvtHandler(this, type, handler);
		return this;
	}

	function setLeft(left) {
		this.style.left = left;
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

	function setHeight(value) {
		this.style.height = value;
		return this;
	}
	
	function setWidth(value) {
		this.style.width = value;
		return this;
	}

	function verAlign(value) {
		this.style.verticalAlign = value;
		return this;
	}

	function front() {
		var elements = (this.parentNode || document).getElementsByTagName("*");
		var z = 0;

		for (var i = 0; i < elements.length; i++)
			if (elements[i].style.zIndex != "")
				z = Math.max( z, parseInt(elements[i].style.zIndex) );

		this.style.zIndex = z + 1;
		return this;
	};

	return function(tag) {
		var object = null;
		var element = document.createElement(tag);
		element.attr = attr;
		element.cls = cls;
		element.cursor = cursor;
		element.dialog = dialog;
		element.front = front;
		element.hfill = hfill;
		element.margBottom = margBottom;
		element.margLeft = margLeft;
		element.margRight = margRight;
		element.margTop = margTop;
		element.newline = newline;
		element.on = on;
		element.setHeight = setHeight;
		element.hint = hint;
		element.setLeft = setLeft;

		element.obj = function(value) {
			if (value === undefined)
				return object;

			object = value;
			return this;
		};

		element.setPos = setPos;
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
	
	function scroll(height) {
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
		cont.scroll = scroll;
		cont.setWrap = setWrap;
		
		if (tag && !String.isString(tag))
			cont.append(tag);
		return cont;
	};
})();


var Input = function(type) {
	return Element("input").attr("type", type);
};

var Check = function() {
	return Input("checkbox").cls("dialog-check");
};
	
function LabelCheck(caption) {
	var cont = Span().cls("dialog-label-check");
	var id = uid();
	cont.check = Check().attr('id', id);
	cont.append( cont.check );
	cont.append( cont.label = Label(caption).attr("for", id) );
	return cont;
}
	
function Radio() {
	return Input("radio").cls("dialog-radio");;
}

var ListItem = (function(){
	function checked() {
		return this.input().checked;
	}
	
	function list() {
		var node = this.parentNode;
		while (!node.getItems)  // region
			node = node.parentNode;
		return node;
	}
	
	function on(type, handler) {
		if (type == 'click')
			type = 'itemclick' //cannot use "onclick"
		setEvtHandler(this, type, handler);
		return this;
	}
	
	function inputClick(){
		if (this.parentNode.inputClick)
			this.parentNode.inputClick();
		if (this.parentNode.onitemclick)
			this.parentNode.onitemclick();
	}
	
	return function(input, caption, obj) {
		var id = uid();
		input.attr('id', id).on('click', inputClick);
		var label = Label(caption).attr("for", id);
		var listitem = Container([input, label]).cls("dialog-list-item");
		if (obj !== undefined)
			listitem.obj(obj);

		listitem.input = function(){ return input; };
		listitem.label = function(){ return label; };
		listitem.checked = checked;
		listitem.on = on;
		listitem.list = list;
		return listitem;
	};
})();

var CheckItem = (function(){
	function checked(state) {
		if (state === undefined)
			return this.input().checked;

		this.input().checked = state;
		return this;
	}

	return function(caption, obj){
		var listitem = ListItem( Check(), caption, obj );
		listitem.checked = checked;
		return listitem;
	};
})();

function RadioItem(caption, obj) {
	return ListItem( Radio(), caption, obj );
};

var List = (function() {
	function inputClick(){ //for internal use
		var list = this.list();
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
		this._region.append(listitem);
		this.getItems().push(listitem);
		listitem.inputClick = inputClick;
		return listitem;
	}
	
	function region(caption) {
		var r = Container().cls("dialog-list-region");
		var title = Heading(caption).on('click', function() { $(r).toggle(); });
		this.append(title);
		this.append(r);
		this._region = r;
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
		var list = Container().cls(border ? 'dialog-list-border' : 'dialog-list');
		var items = [];
		list.getItems = function(){ return items; };
		list.addItem = addItem;
		list._region = list;
		list.region = region;
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
			items[i].checked(false);
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
	
	function setSelectedObj(obj) {
		var items = this.getItems();
		for (var i = 0; i < items.length; i++)
			if (items[i].obj() === obj){
				this.setSelected(items[i]);
				break;
			}
		return this;
	}
	
	function getSelectedObj() {
		var listitem = this.getSelected();
		return (listitem === null ? null : listitem.obj());
	}
	
	return function(border) {
		var selitem = null;
		var list = List(border);
		list.add = add;
		list.inputClick = inputClick;
		list.setSelectedObj = setSelectedObj;
		list.getSelectedObj = getSelectedObj;
		list.getSelected = function() { return selitem; }
		list.setSelected = function(listitem, evt) {
			if (selitem === listitem)
				return;
				
			if (selitem) {
				selitem.input().checked = false;
				selitem = null;
			}
				
			if (listitem) {
				listitem.input().checked = true;
				selitem = listitem;
				
			if (evt && list.onselchange)
				list.onselchange();
			}
		}
		return list;
	};
})();

var Combo = (function() {
	function addItem(caption, obj) {
		var option = Element("option");
		if (obj !== undefined)
			option.obj(obj);

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
	
	return function() {
		var combo = Element("select").cls("dialog-select");
		combo.addItem = addItem;
		combo.getSelected = getSelected;
		combo.clear = clear;
		return combo;
	};
})();

function Button(caption, onclick) {
	var button = Input("button").cls("dialog-button").on('click', onclick);
	button.value = caption;
	return button;
}

function CloseBtn(caption){
	return Button(caption || T.close.capitalize(), "this.dialog().remove()");
}

function HideBtn(caption) {
	return Button(caption || T.close.capitalize(), "this.dialog().hide()");
}

function ModalBtn(caption, result) {
	return Button(caption, function() { this.dialog().setModalResult(result); });
}

function BitBtn(src, caption, onclick, accel) {
	var button = Container("button").attr("type", "button").cls("dialog-bitbtn").on('click', onclick).html('<img src="icons/' + src + '.png"><br><strong>' + caption + '</strong>');
	if (accel)
		$(document).hotKey(accel, function() { button.click(); return false; });
	return button;
}

function Edit(text) {
	var edit = Input("edit").cls("dialog-edit");
	if (text)
		edit.value = text;
	return edit;
}

function Textarea(text, rows) {
	var edit = Element("textarea").cls("dialog-textarea");
	if (text)
		edit.value = text;
	if (rows)
		edit.rows = rows;
	return edit;
}

var Picture = function(src) {
	return Element("img").attr("src", src);
};

var Icon = function(src){
	return Picture(src).cls("dialog-icon");
}

var CloseIcon = function(){
	return Icon("icons/close.png").on('click', "this.dialog().remove()").cursor('pointer').hint(T.close);
};
	
var HideIcon = function(){
	//show tooltip "Close", even if just hiding the dialog
	return Icon("icons/close.png").on('click', "this.dialog().hide()").cursor('pointer').hint(T.close);
};

var InfoIcon = function(onclick){
	return Icon("icons/info-small.png").hint(T.info).cursor('pointer').on('click', onclick);
};

var Label = (function(){
	return function(caption) {
		var label = Element("label").cls("dialog-label");
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
		return this.addCell(false).cls('dialog-label').html(caption);
	}
	
	function addInput(input) {
		var cell = this.addCell(false).cls('dialog-input');
		if (input)
			cell.append(input.hfill());
		return cell;
	}
	
	function add(array) {
		for (var i = 0; i < array.length; i++)
			if (String.isString(array[i]))
				this.addLabel(array[i]);
			else if (Object.isDOM(array[i]))
				this.addInput(array[i]);
	}
	
	return function(cols) {
		var grid = Element("table").cls('dialog-grid').attr("cellspacing", 0);
		grid.cols = cols || 2;
		grid.cindex = 1;
		grid.addCell = addCell;
		grid.addLabel = addLabel;
		grid.addInput = addInput;
		grid.add = add;
		return grid;
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
			tooltip = Container().cls('dialog-tooltip');
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
				tooltip.front();
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
	var dlg = DIALOGS.create();
	dlg.frame().setWidth("30em");
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
	var dlg = DIALOGS.create();
	dlg.frame().setWidth("20em");
	var edit = Textarea(text, 2).hfill();
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
	var dlg = DIALOGS.create();
	
	function pictureLoad() {
		if (dlg.visible())
			dlg.move();
	}
	
	dlg.setInit( function() {
		this.setTitle( T[titlekey].capitalize() ).addIcon( CloseIcon() ).addFoot( CloseBtn(T.ok) );
		this.addContent( Picture(src).on('load', pictureLoad) );
	});
	
	dlg.show().move();
}