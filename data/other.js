"use strict";

PROPERTIES.add("crystalstruct",
[
null,//H
null,//He
"bcc",//Li
"hcp",//Be
"rhom",//B
"hcp",//C
null,//N
null,//O
null,//F
null,//Ne
"bcc",//Na
"hcp",//Mg
"fcc",//Al
"fcc",//Si
"mon",//P
"orth",//S
null,//Cl
null,//Ar
"bcc",//K
"fcc",//Ca
"hcp",//Sc
"hcp",//Ti
"bcc",//V
"bcc",//Cr
"bcc",//Mn
"bcc",//Fe
"hcp",//Co
"fcc",//Ni
"fcc",//Cu
"hcp",//Zn
"orth",//Ga
"fcc",//Ge
"rhom",//As
"hcp",//Se
"orth",//Br
null,//Kr
"bcc",//Rb
"fcc",//Sr
"hcp",//Y
"hcp",//Zr
"bcc",//Nb
"bcc",//Mo
"hcp",//Tc
"hcp",//Ru
"fcc",//Rh
"fcc",//Pd
"fcc",//Ag
"hcp",//Cd
"fcc",//In
"tetr",//Sn
"rhom",//Sb
"hcp",//Te
"orth",//I
null,//Xe
"bcc",//Cs
"bcc",//Ba
"hcp",//La
"fcc",//Ce
"hcp",//Pr
"hcp",//Nd
"hcp",//Pm
"rhom",//Sm
"bcc",//Eu
"hcp",//Gd
"hcp",//Tb
"hcp",//Dy
"hcp",//Ho
"hcp",//Er
"hcp",//Tm
"fcc",//Yb
"hcp",//Lu
"hcp",//Hf
"bcc",//Ta
"bcc",//W
"hcp",//Re
"hcp",//Os
"fcc",//Ir
"fcc",//Pt
"fcc",//Au
"rhom",//Hg
"hcp",//Tl
"fcc",//Pb
"rhom",//Bi
"cub",//Po
null,//At
null,//Rn
"bcc",//Fr
"bcc",//Ra
"fcc",//Ac
"fcc",//Th
"tetr",//Pa
"orth",//U
"orth",//Np
"mon",//Pu
"hcp",//Am
"hcp",//Cm
"hcp",//Bk
"hcp",//Cf
"fcc",//Es
null,//Fm
null,//Md
null,//No
null,//Lr
null,//Rf
null,//Db
null,//Sg
null,//Bh
null,//Hs
null,//Mt
null,//Ds
null//Rg
],
{
numeric: false,
format: function(value) {
	return '<IMG STYLE="cursor: pointer;" SRC="crystal/' + value + '-small.png" onmouseover="Tooltip(\'' + T[value] + '\').showAt(this)" onclick="timg(\'' + value + '\',\'crystal/' + value + '.png\')">';
},
source: ("http://en.wikipedia.org/wiki/Periodic_table_(crystal_structure)").blank()
}
);

PROPERTIES.add("discovery",
[
 1766,//H
 1868,//He
 1817,//Li
 1798,//Be
 1808,//B
 null,//C
 1772,//N
 1771,//O
 1886,//F
 1898,//Ne
 1807,//Na
 1755,//Mg
 1825,//Al
 1824,//Si
 1669,//P
 null,//S
 1774,//Cl
 1894,//Ar
 1807,//K
 1808,//Ca
 1879,//Sc
 1791,//Ti
 1801,//V
 1797,//Cr
 1770,//Mn
 null,//Fe
 1732,//Co
 1751,//Ni
 null,//Cu
 null,//Zn
 1875,//Ga
 1886,//Ge
 null,//As
 1817,//Se
 1825,//Br
 1898,//Kr
 1861,//Rb
 1787,//Sr
 1794,//Y
 1789,//Zr
 1801,//Nb
 1778,//Mo
 1937,//Tc
 1807,//Ru
 1804,//Rh
 1803,//Pd
 null,//Ag
 1817,//Cd
 1863,//In
 null,//Sn
 null,//Sb
 1782,//Te
 1811,//I
 1898,//Xe
 1860,//Cs
 1772,//Ba
 1838,//La
 1803,//Ce
 1885,//Pr
 1885,//Nd
 1942,//Pm
 1879,//Sm
 1896,//Eu
 1880,//Gd
 1842,//Tb
 1886,//Dy
 1878,//Ho
 1842,//Er
 1879,//Tm
 1878,//Yb
 1906,//Lu
 1911,//Hf
 1802,//Ta
 1781,//W
 1908,//Re
 1803,//Os
 1803,//Ir
 1735,//Pt
 null,//Au
 null,//Hg
 1861,//Tl
 null,//Pb
 1753,//Bi
 1898,//Po
 1940,//At
 1898,//Rn
 1939,//Fr
 1898,//Ra
 1899,//Ac
 1829,//Th
 1913,//Pa
 1789,//U
 1940,//Np
 1940,//Pu
 1944,//Am
 1944,//Cm
 1949,//Bk
 1950,//Cf
 1952,//Es
 1952,//Fm
 1955,//Md
 1958,//No
 1961,//Lr
 1968,//Rf
 1970,//Db
 1974,//Sg
 1981,//Bh
 1984,//Hs
 1982,//Mt
 1994,//Ds
 1994//Rg
],
{
source: ("http://en.wikipedia.org/wiki/Timeline_of_chemical_elements_discoveries").blank(),
missing: "antique",
format: function(value) { return value.toString(); }
}
);

PROPERTIES.add("discoverer",
[
 "Henry Cavendish",//H
 "Pierre Janssen|Norman Lockyer",//He
 "Johan August Arfwedson",//Li
 "Louis Nicolas Vauquelin",//Be
 "Joseph Louis Gay-Lussac|Louis Jacques Thénard",//B
 null,//C
 "Daniel Rutherford",//N
 "Carl Wilhelm Scheele",//O
 "Henri Moissan",//F
 "William Ramsay|Morris Travers",//Ne
 "Humphry Davy",//Na
 "Joseph Black",//Mg
 "Hans Christian Ørsted",//Al
 "Jöns Jacob Berzelius",//Si
 "Hennig Brand",//P
 null,//S
 "Carl Wilhelm Scheele",//Cl
 "John William Strutt|William Ramsay",//Ar
 "Humphry Davy",//K
 "Humphry Davy",//Ca
 "Lars Fredrik Nilson",//Sc
 "William Gregor",//Ti
 "Andrés Manuel del Río",//V
 null,//Cr
 "Torbern Bergman",//Mn
 null,//Fe
 "Georg Brandt",//Co
 "Axel Fredrik Cronstedt",//Ni
 null,//Cu
 null,//Zn
 "Paul Emile Lecoq de Boisbaudran",//Ga
 "Clemens Winkler",//Ge
 null,//As
 "Jöns Jacob Berzelius|Johan Gottlieb Gahn",//Se
 "Antoine Jérōme Balard|Leopold Gmelin",//Br
 "William Ramsay|Morris Travers",//Kr
 "Robert Bunsen|Gustav Kirchhoff",//Rb
 "William Cruickshank",//Sr
 "Johan Gadolin",//Y
 "Martin Heinrich Klaproth",//Zr
 "Charles Hatchett",//Nb
 "Carl Wilhelm Scheele",//Mo
 "Carlo Perrier|Emilio Segrè",//Tc
 "Jedrzej Sniadecki",//Ru
 "William Hyde Wollaston",//Rh
 "William Hyde Wollaston",//Pd
 null,//Ag
 "Karl Samuel Leberecht Hermann|Friedrich Stromeyer|Johann Christoff Heinrich Roloff",//Cd
 "Ferdinand Reich|Hieronymous Theodor Richter",//In
 null,//Sn
 null,//Sb
 "Franz-Joseph Müller von Reichenstein",//Te
 "Bernard Courtois",//I
 "William Ramsay|Morris Travers",//Xe
 "Robert Bunsen|Gustav Kirchhoff",//Cs
 "Carl Wilhelm Scheele",//Ba
 "Carl Gustaf Mosander",//La
 "Martin Heinrich Klaproth|Jöns Jacob Berzelius|Wilhelm Hisinger",//Ce
 "Carl Auer von Welsbach",//Pr
 "Carl Auer von Welsbach",//Nd
 "Chien-Shiung Wu|Emilio Segrè|Hans Bethe",//Pm
 "Paul Emile Lecoq de Boisbaudran",//Sm
 "Eugene Demarcay",//Eu
 "Jean Charles Galissard de Marignac",//Gd
 "Carl Gustaf Mosander",//Tb
 "Paul Emile Lecoq de Boisbaudran",//Dy
 "Marc Delafontaine",//Ho
 "Carl Gustaf Mosander",//Er
 "Per Teodor Cleve",//Tm
 "Jean Charles Galissard de Marignac",//Yb
 "Georges Urbain|Carl Auer von Welsbach",//Lu
 "Georges Urbain|Vladimir Vernadsky",//Hf
 "Anders Gustaf Ekeberg",//Ta
 "Torbern Bergman",//W
 "Masataka Ogawa",//Re
 "Smithson Tennant",//Os
 "Smithson Tennant",//Ir
 "Antonio de Ulloa",//Pt
 null,//Au
 null,//Hg
 "William Crookes",//Tl
 null,//Pb
 "Claude Fran�ois Geoffroy",//Bi
 "Pierre Curie|Marie Curie",//Po
 "Dale Corson|Kenneth Ross MacKenzie|Emilio Segrè",//At
 "Friedrich Ernst Dorn",//Rn
 "Marguerite Perey",//Fr
 "Pierre Curie|Marie Curie",//Ra
 "Andr�-Louis Debierne",//Ac
 "Jöns Jacob Berzelius",//Th
 "Oswald Helmuth Göhring|Kazimierz Fajans",//Pa
 "Martin Heinrich Klaproth",//U
 "Edwin McMillan|Philip Abelson",//Np
 "Glenn Seaborg|Arthur Wahl|Joseph W. Kennedy|Edwin McMillan",//Pu
 "Glenn Seaborg|Ralph A. James|Leon Owen Morgan|Albert Ghiorso",//Am
 "Glenn Seaborg|Ralph A. James|Albert Ghiorso",//Cm
 "Stanley Gerald Thompson|Albert Ghiorso|Glenn Seaborg",//Bk
 null,//Cf
 null,//Es
 null,//Fm
 null,//Md
 null,//No
 null,//Lr
 null,//Rf
 null,//Db
 null,//Sg
 null,//Bh
 null,//Hs
 null,//Mt
 null,//Ds
 null//Rg
],
{
numeric: false,
source: ("http://en.wikipedia.org/wiki/Timeline_of_chemical_elements_discoveries").blank(),
format: function(value) {
		function f(s) {
			return s.split(" ").last().link({ blank: true, title: T.wikiart + ": " + s, url: s.toWikiUrl() });
		};
		return value.split("|").apply(f).join("<br>");
	}
}
);