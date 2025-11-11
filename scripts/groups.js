"use strict";

var GROUPS = (function() {
	var all = [];
	var selected = [];
	var dlg = null;
	var list;
	var inany;

	function infoClick() {
		var name = this.obj();
		Message(name + "info", name).showAt(this);
	}
	
	function clearClick() {
		list.clearSelection();	
		update();
	}
	
	function itemClick() {
		var listitem = this;
		var group = listitem.obj();
		if (listitem.checked() && group.param) {
			var promptDlg = Prompt(T[group.param.prompt], T[group.param.name], group.param.value);
			promptDlg.showModalAt(this, function(result){
				if (result == "cancel") {
					listitem.checked(false);
					return;
				}
				
				var value = parseFloat(promptDlg.getValue());
				if ( Number.isNaN(value) ) {
					listitem.checked(false);
					return;
				}
				
				group.param.value = value;
				update();
			});
		}
		else
			update();
	}
	
	function update() {
		selected.clear();
		var items = list.getItems();
		for (var k = 0; k < items.length; k++)
			if ( items[k].checked() )
				selected.push( items[k].obj() );
		
		GROUPS.selectedContain = (inany.checked() ? matchAny : matchAll);
		PERTAB.updateColors();
	}

	function Group(key, data, options) {
		this.key = key;
		if (Function.isFunction(data)) {
			this.contains = data;
			if (options && options.param)
				this.param = options.param;
		} else if (data.length != SYMBOLS.length) //data is list of atomic numbers
			this.contains = function(i) { return data.indexOf(i + 1) != -1; };
		else
			this.contains = function(i) { return data[i] != 0; };
	}
	
	Group.prototype.isSelected = function() {
		return selected.indexOf(this) >= 0;
	}
	
	function matchAny(i) {
		for (var k = 0; k < selected.length; k++)
			if ( selected[k].contains(i) )
				return true;
		
		return false;
	}
	
	function matchAll(i) {
		for (var k = 0; k < selected.length; k++)
			if ( !(selected[k].contains(i)) )
				return false;
		
		return true;
	}
	
	return {
		isSelected: function() {
			return selected.length > 0;
		},
		
		clearSelection: clearClick,
		
		add: function(name, data, options) {
			var group = new Group(name, data, options);
			all.push( group );
			return group;
		},
		
		allGroupsFor: function(index) {
			var arr = [];
			for (var i = 0; i < all.length; i++)
				if ( all[i].contains(index) )
					arr.push(T[all[i].key].toLowerCase());
			return arr;
		},
		
		getDlg: function() {
			if (dlg === null){
				dlg = DIALOGS.create();
				dlg.width("25em");
				dlg.setInit(function() {
					this.setTitle(T.groups).addFoot( [Button(T.clear, clearClick), HideBtn()] ).addIcon( HideIcon() );
					list = CheckList(true).scroll("10em");
					for (var i = 0; i < all.length; i++) {
						var group = all[i];
						list.add(T[group.key], group).checked(group.isSelected()).on('click', itemClick);
						if ( APP.hasContent(group.key + "info") )
							list.getLast().append( InfoIcon(infoClick).obj(group.key) );
					}
				
					var markType = RadioList().margTop("6px").onItemClick(update);
					inany = markType.add(T.inanygroup);
					markType.add(T.ineachgroup);
					markType.setSelected(inany);
					this.addContent( [list, markType] );
				});
			}
		
			return dlg;
		}
	};
})();


