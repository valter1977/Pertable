"use strict";

const GROUPS = (function() {
	const all = [];
	const selected = [];
	let dlg = null;
	let list;
	let inany;

	function infoClick() {
		const name = this.getObj();
		Message(name + "info", name).showAt(this);
	}
	
	function clearClick() {
		list.clearSelection();	
		update();
	}
	
	function itemClick() {
		const listitem = this;
		const group = listitem.getObj();
		if (listitem.isChecked() && group.param) {
			const promptDlg = Prompt(T[group.param.prompt], T[group.param.name], group.param.value);
			promptDlg.showModalAt(this, function(result){
				if (result == "cancel") {
					listitem.setChecked(false);
					return;
				}
				
				const value = parseFloat(promptDlg.getValue());
				if ( Number.isNaN(value) ) {
					listitem.setChecked(false);
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
		const items = list.getItems();
		for (let k = 0; k < items.length; k++)
			if ( items[k].isChecked() )
				selected.push( items[k].getObj() );
		
		GROUPS.selectedContain = (inany.isChecked() ? matchAny : matchAll);
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
		for (let k = 0; k < selected.length; k++)
			if ( selected[k].contains(i) )
				return true;
		
		return false;
	}
	
	function matchAll(i) {
		for (let k = 0; k < selected.length; k++)
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
			const group = new Group(name, data, options);
			all.push( group );
			return group;
		},
		
		allGroupsFor: function(index) {
			const arr = [];
			for (let i = 0; i < all.length; i++)
				if ( all[i].contains(index) )
					arr.push(T[all[i].key].toLowerCase());
			return arr;
		},
		
		getDlg: function() {
			if (dlg === null){
				dlg = Dialogs.create();
				dlg.setWidth("25em");
				dlg.setInit(function() {
					this.setTitle(T.groups).addFoot( [Button(T.clear, clearClick), HideBtn()] ).addIcon( HideIcon() );
					list = CheckList(true).setScroll("10em");
					for (let i = 0; i < all.length; i++) {
						const group = all[i];
						list.add(T[group.key], group).setChecked(group.isSelected()).onClick(itemClick);
						if ( APP.hasContent(group.key + "info") )
							list.getLast().append( InfoIcon(infoClick).setObj(group.key) );
					}
				
					const markType = RadioList().margTop("6px").onItemClick(update);
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


