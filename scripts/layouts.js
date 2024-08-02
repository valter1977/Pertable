"use strict";

var Layouts = (function() {
	var names = ["stdtable", "widetable", "phystable", "shorttable"];
	var selected = null;
	var dlg = null;
	
	function iconClick() {
		dlg.hide();
		switchTo(names[this.getObj()]);
	}
	
	function infoClick() {
		var name = names[this.getObj()];
		Message(name + "info", name).showAt(this.parentNode);
	}
	
	function loadComplete( response, status, xhr ) {
		if ( status == "error" ){
			alert('Failed to load the layout!');
			return;
		}
		
		Layouts.updateTitle();
		PERTAB.fillContent();
		PERTAB.setHints();
		PERTAB.displayProperty();
		PERTAB.updateColors();
		PERTAB.reselect();
	}
	
	function switchTo(name) {
		if (selected === name) return;
		selected = name;
		$("#pertable").load("layouts/" + selected + ".htm", loadComplete);
	}
	
	return {
		updateTitle: function(){
			//if (selected)
			//	$('#layoutname').text( '[' + T[selected] + ']' );
		},
		
		setDefault: function() {
			switchTo(names[0]);
		},
		
		getDialog: function() {
			if (dlg == null) {
				dlg = Dialogs.create();
				dlg.setWidth("19em");
				dlg.setInit( function() {
					this.setTitle(T.layout).addFoot( HideBtn(T.close) ).addIcon( HideIcon() );
				
					for (var i = 0; i < names.length; i++) {
						var info = names[i] + "info";
						var cont = Container().setClass("layout-select").setHint(T[names[i]]);
						cont.append(Picture('layouts/' + names[i] + '.png').setObj(i).onClick(iconClick));
						if (APP.hasContent(info))
							cont.append(InfoIcon().margLeft("1em").onClick(infoClick).setObj(i));
						this.addContent(cont);
					}
				});
			}
	
			return dlg;
		}
	};
})();






