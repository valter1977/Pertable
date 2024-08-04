"use strict";

var SYMBOLS = [
	"H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar",
	"K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br",
	"Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te",
	"I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm",
	"Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn",
	"Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr",
	"Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg"];

var PERTAB = (function() {
	var cells = new Array(SYMBOLS.length);
	var selected = null;
	var searchDlg = null;
	var editName;
	var editSymbol;
	var editNumber;
	
	function findBySymbol() {
		var symbol = editSymbol.value.trim().toLowerCase().capitalize();
		if (symbol == "") {
			unselect();
			return;
		}
		
		var i = SYMBOLS.indexOf(symbol);		
		if (i >= 0)
			cells[i].select();
		else
			unselect();
	}

	function findByName() {
		var name = editName.value.trim().toLowerCase();
		if (name == "") {
			unselect();
			return;
		}
		
		for (var i = 0; i < SYMBOLS.length; i++)
			if (T[SYMBOLS[i]].indexOf(name) == 0) {
				cells[i].select();
				return;
			};
		
		unselect();
	}
	
	function findByNumber() {
		var n = parseInt(editNumber.value);
		if (Number.isNaN(n) || n < 1 || n > SYMBOLS.length)
			unselect();
		else
			cells[n - 1].select();
	}
	
	function clickSymbol() {
		if (!APP.isLoaded()) return;
		
		var dlg = Dialogs.create("elem");
		dlg.index = this.atomNumber - 1;
		dlg.setWidth("40em").setScroll("20em");
		dlg.setInit( function() {
			var k = this.index;
			this.setTitle(T[SYMBOLS[k]].capitalize() + " (" + SYMBOLS[k] + ")");
			this.addFoot( CloseBtn(T.close) ).addIcon( CloseIcon() );
			var grid = Grid(3).hFill().cellSpace(1).cellPad(3);
			this.addContent(grid);
			PROPERTIES.restart();
			while (PROPERTIES.next()) {
				var prop = PROPERTIES.get();
				grid.addCell(true).horAlign("right").setWrap(false).html( prop.getName() + ":" );
				grid.addCell(false).horAlign("left").hFill().setWrap(false).html( prop.formatWithUnit(k) );
				var cell = grid.addCell();
				if ( prop.info || prop.source )
					cell.append( PropInfoIcon(prop) );
			}
	
			var groups = GROUPS.allGroupsFor(k);
			grid.addCell(true).horAlign("right").setWrap(false).html( T.groups + ":" );
			grid.addCell(false).horAlign("left").setWrap(false).html(
				(groups.length >= 0) ? groups.join("<br>") : Props.defaultMissingValue );
	
			this.addContent( Para( T.wikiart + ': ' + T[SYMBOLS[k]].capitalize().toWikiUrl(T.langid).blank() ) );
		});
		
		dlg.show().move();
	}
	
	function symbolMouseOver() {
		Tooltip(T[SYMBOLS[this.atomNumber - 1]]).showAt(this);
	}
	
	function groupMouseOver() {
		Tooltip(T.groupnum).showAt(this);
	}
	
	function periodMouseOver() {
		Tooltip(T.periodnum).showAt(this);
	}
	
	function lanthMouseOver() {
		Tooltip(T.lanthanides.toLowerCase()).showAt(this);
	}
	
	function actinMouseOver() {
		Tooltip(T.actinides.toLowerCase()).showAt(this);
	}
	
	function showScaleBar(show) {
		var str = '';
		if (show) {
			str = '<table cellpadding="0" cellspacing="0" border="0"><tr>';
			for (var x = 0.0; x <= 1.0; x+= 0.02)
				str += '<td bgcolor="' + COLORMAP(x) + '">&nbsp;</td>'
	
			str += '</tr></table>';
		}
		$('#scalebar').html(str);
		PROPERTIES.showRange(show);
	}
	
	//atomic number n >= 1
	function Cell(n) {
		this.getAtomNumber = function(){ return n; }; 
		this.getSymbol = function(){ return SYMBOLS[n-1] };
	}

	Cell.prototype.getName = function() {
		return T[this.getSymbol()];
	}

	Cell.prototype.fillContent = function() {
		var n = this.getAtomNumber();
		this.link = $('<span>').addClass('symbol').text(this.getSymbol()).click(clickSymbol).mouseover(symbolMouseOver).get(0);
		this.link.atomNumber = n;
		this.info = $('<div>').addClass('info').get(0);
		this.cell = $('#cell' + n.toString()).addClass('cell').empty().append(this.link).append($('<br>')).append(this.info).get(0);
	}
	
	Cell.prototype.select = function() {
		unselect();
		this.cell.className = "selected-cell";
		selected = this;
	}

	/*Cell.prototype.setDefaultHint = function() {
		this.link.setAttribute("title", this.getName());
	}*/
	
	Cell.prototype.setColor = function(color) {
		this.cell.style.backgroundColor = color;
	}
	
	Cell.prototype.resetColor = function() {
		this.cell.style.backgroundColor = "";
	}
	
	Cell.prototype.highlight = function() {
		this.setColor("yellow");
	}
	
	Cell.prototype.setInfo = function(text) {
		if (text) {
			this.info.innerHTML = text;
			this.info.style.display = 'block';
		} else {
			this.info.innerHTML = "";
			this.info.style.display = 'none';
		}
	}
	
	
	for (var i = 0; i < SYMBOLS.length; i++)
		cells[i] = new Cell(i+1);

	function unselect() {
		if (selected) {
			selected.cell.className = "cell";
			selected = null;
		}	
	}
	
	return {
		fillContent: function() {
			for (var i = 0; i < cells.length; i++)
				cells[i].fillContent();
			
			$("#info").html(
			'<table cellpadding="0" cellspacing="0" border="0">' +
			'<tr><td></td><td id="property"></td><td></td></tr>' +
			'<tr><td id="minvalue"></td><td id="scalebar"></td><td id="maxvalue"></td></tr></table>');
		},
	
		setHints: function() {
			//for (var i = 0; i < cells.length; i++)
			//	cells[i].setDefaultHint();
			
			$(".group").mouseover(groupMouseOver);
			$(".period").mouseover(periodMouseOver);
			$(".lanthanides").mouseover(lanthMouseOver);
			$(".actinides").mouseover(actinMouseOver);
		},
		
		updateColors: function() {
			if (GROUPS.isSelected()) {
				for (var i = 0; i < cells.length; i++) {
					if ( GROUPS.selectedContain(i) )
						cells[i].highlight();
					else
						cells[i].resetColor();
				}
						
				showScaleBar(false);
			} else if (PROPERTIES.selected && PROPERTIES.selected.numeric && COLORMAP) {
				if (SCALE == LOG_SCALE && PROPERTIES.selected.minval <= 0.0) {
					Message(T.logerror).showModal();
					SCALE = LINEAR_SCALE;
				}
	
				for (var i = 0; i < cells.length; i++) {
					var value = PROPERTIES.selected.rawValue(i);
					if (value)
						cells[i].setColor(COLORMAP(SCALE(value, PROPERTIES.selected.minval, PROPERTIES.selected.maxval)));
					else
						cells[i].resetColor();
				}
				showScaleBar(true);
			} else {
				for (var i = 0; i < cells.length; i++)
					cells[i].resetColor();
				
				showScaleBar(false);
			};
		},
		
		displayProperty: function() {
			if (PROPERTIES.selected === null) {
				for (var i = 0; i < cells.length; i++)
					cells[i].setInfo();
					
				$("#property").html('');
			} else {
				for (var i = 0; i < cells.length; i++)
					cells[i].setInfo( PROPERTIES.selected.format(i) );
					
				$("#property").html( PROPERTIES.selected.getName(true, false) );
			}
		},
		
		reselect: function() {
			if (selected)
				selected.cell.className = "selected-cell";
		},
		
		getSearchDlg: function() {
			if (searchDlg === null) {
				searchDlg = Dialogs.create();
				searchDlg.setWidth("15em");
				editName = Edit().onChange(findByName);
				editSymbol = Edit().onChange(findBySymbol);
				editNumber = Edit().onChange(findByNumber);
				searchDlg.showFocus = editName;
				
				searchDlg.setInit( function() {
					var grid = Grid(2);
					grid.add( [T.name + ":", editName] );
					grid.add( [T.symbol + ":", editSymbol] );
					grid.add( [T.atomicnumber + ":", editNumber] );
					this.setTitle(T.search).addFoot( HideBtn() ).addIcon( HideIcon() ).addContent(grid);
				});
			}
	
			return searchDlg;
		}
	};
})();





