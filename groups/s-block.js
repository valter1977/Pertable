"use strict";

var AlkaliMetals = GROUPS.add("alkali",
[3,//Li
11,//Na
19,//K
37,//Rb
55,//Cs
87//Fr
]);

//============================================================================

var AlkaliEarthMetals = GROUPS.add("alkaliearth", [
4,//Be
12,//Mg
20,//Ca
38,//Sr
56,//Ba
88//Ra
]);

//============================================================================

GROUPS.add("selements",
function(i) { return i == 0 || i == 1 || AlkaliMetals.contains(i) || AlkaliEarthMetals.contains(i); }
);