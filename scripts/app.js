"use strict";

var T; //dictionary of the active language; more substantial processing with fallback is implemented by APP.trans()
var APP = (function() {
	let dlg = null;
	let loadingComplete = false;
	const dictionaries = {};
	let defaultDict;
	const regexIntLinks = /<([^\|]*)\|([^\|]*)\|([^>]*)>/g;
	const regexExtLinks = /<([^\|]*)\|([^>]*)>/g;
	const strongFormat = /<s ([^>]*)>/g;
	
	function processLinks(text) {
		return text.replace(
			regexIntLinks, '<span class="link" onclick="Message(\'$3\',\'$2\').showAt(this)">$1</span>').replace(
			regexExtLinks, '<a href="$2" target="_blank">$1</a>').replace(
			strongFormat, '<strong>$1</strong>');
	}
	
	//switch language and translate everything except the periodic table itself
	function setLanguage(key) {
		if (!key)
			T = defaultDict;
		else if (!(key in dictionaries)) {
			alert("Unsupported language requested: " + key + " !");
			key = defaultLang;
		}
		else if (T == dictionaries[key])
			return false;
		else
			T = dictionaries[key];

		transMainUI();
		Layouts.updateTitle();
		return true;
	}
	
	function flagClick() {
		if (setLanguage(this.langKey)) {
			PROPERTIES.sort();
			PERTAB.displayProperty();
			PERTAB.setHints();
			Dialogs.reinit(); //rebuilds the content of all dialogs
		}
	}
	
	function createFlags() {
		const container = $("#language");
		for (let key in dictionaries)
			if (dictionaries.hasOwnProperty(key)) {
				const img = $('<img>').attr('src', 'lang/' + key + '.png').attr('title', key).click(flagClick);
				img.get(0).langKey = key;
				container.append(img);
			}
	}
	
	function btnGroupsClick() {
		if (loadingComplete)
			GROUPS.getDlg().showAt(this);
	}
	
	function btnDataClick() {
		if (loadingComplete)
			getDataDlg().showAt(this);
	}
	
	function btnColorClick() { getColorDlg().showAt(this); }
	
	function btnPlotClick() { getPlotDlg().showAt(this); };
	
	function btnHistClick() { getHistDlg().showAt(this); };
	
	function btnListClick() { getListDlg().showAt(this); };
	
	function btnLayoutClick() { Layouts.getDialog().showAt(this); };

	function btnSearchClick() { PERTAB.getSearchDlg().showAt(this); };
	
	function btnSettingsClick() { getSettingsDlg().showAt(this); };
	
	function btnExitClick() { window.open("","_self").close(); };

	function transMainUI() {
		const container = document.getElementById("toolbar");
		clearChildNodes(container)
		
		container.appendChild( BitBtn("groups", T.groups, btnGroupsClick).setHint(T.grouphint) );
		container.appendChild( BitBtn("data", T.data, btnDataClick).setHint(T.datahint) );
		container.appendChild( BitBtn("colormap", T.colormap, btnColorClick).setHint(T.colormaphint) );
		container.appendChild( BitBtn("plot", T.plot, btnPlotClick).setHint(T.plothint) );
		container.appendChild( BitBtn("histogram", T.histogram, btnHistClick).setHint(T.histogramhint) );
		container.appendChild( BitBtn("table", T.table, btnListClick).setHint(T.tablehint) );
		container.appendChild( BitBtn("layout", T.layout, btnLayoutClick).setHint(T.layouthint) );
		container.appendChild( BitBtn("search", T.search, btnSearchClick, {key: 'f', modifier: 'ctrl'}).setHint(T.searchhint) );
		container.appendChild( BitBtn("settings", T.settings, btnSettingsClick).setHint(T.settingshint) );
		container.appendChild( BitBtn("exit", T.exit, btnExitClick));
		
		document.title = T.maintitle;
		$('#apptitle').text( T.maintitle );
		$("#author").text(T.author);
		$("#version").text(T.version);
		$("#download").html(APP.trans('download'))
	}

	function getSettingsDlg(){
		if (dlg === null) {
			dlg = Dialogs.create();
			dlg.setWidth("12em");
			dlg.setInit(function() {
				this.setTitle(T.settings).addFoot( HideBtn() ).addIcon( HideIcon() );
				this.addContent( [Heading(T.numericaccuracy + ":"),
								  Button("1.23", limitPrecisionClick).setWidth("5em").setHint(T.limprechint),
								  Button("1.2345…", fullPrecisionClick).setWidth("5em").setHint(T.fullprechint)] );
				this.addContent( [Heading(T.numericformat + ":").append(
										InfoIcon("tmsg('numericformatinfo', 'numericformat')").margLeft("5px")	),
								  Button("1.2e3", compFormatClick).setWidth("5em").setHint(T.compfmthint),
								  Button("1.2×10³", sciFormatClick).setWidth("5em").setHint(T.scifmthint)] );
			});
		};
		
		return dlg;
	}
	
	function numberFormatUpdated() {
		if (PROPERTIES.selected && PROPERTIES.selected.numeric) {
			PERTAB.displayProperty();
			if (COLORMAP && !GROUPS.isSelected())
				PROPERTIES.showRange();
		}
		Dialogs.reinit("elem");
	}
	
	function fullPrecisionClick() {
		NUMBER_FORMAT.setFullPrec();
		numberFormatUpdated();
	}

	function limitPrecisionClick() {
		NUMBER_FORMAT.setPrecision(4);
		numberFormatUpdated();
	}

	function compFormatClick() {
		NUMBER_FORMAT.setCompFmt();
		numberFormatUpdated();	
	}

	function sciFormatClick() {
		NUMBER_FORMAT.setSciFmt();
		numberFormatUpdated();
	}
	
	return {
		isLoaded: function() { return loadingComplete; },
	
		init: function() {
			createFlags();
			setLanguage( getUrlParamValue('lang') );
			Layouts.setDefault();
			loadScripts( [ "groups/state.js", "groups/metals.js", "groups/main.js",	"groups/s-block.js",
							"groups/p-block.js", "groups/transition.js", "groups/other.js", "data/atomic.js",
							"data/physical.js", "data/abundance.js", "data/other.js"],
						function() { loadingComplete = true; PROPERTIES.sort(); });
		},
		
		localize: function(key, dict) {
			dictionaries[key] = dict;
			if (!defaultDict)
				defaultDict = dict;
		},
		
		trans: function(key) {
			if (key in T)
				return processLinks(T[key]);
			
			if (key in defaultDict)
				return processLinks(defaultDict[key]);
			
			return key;
		},
		
		hasContent: function(key) {
			return (key in T) || (key in defaultDict);
		}
	};
})();