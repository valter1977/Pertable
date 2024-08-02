"use strict";

GROUPS.add("solids",
function(i) { return MeltingPoints[i] != null && MeltingPoints[i] > this.param.value; },
{ param: { name: "temperature", prompt: "enter_temp_K", value: 293.15 } }
);

//================================================================================================================

GROUPS.add("liquids",
function(i) { return MeltingPoints[i] != null && BoilingPoints[i] != null && MeltingPoints[i] < this.param.value && BoilingPoints[i] > this.param.value; },
{ param: { name: "temperature", prompt: "enter_temp_K", value: 293.15 } }
);

//===============================================================================================================

GROUPS.add("gases",
function(i) { return BoilingPoints[i] != null && BoilingPoints[i] < this.param.value; },
{ param: { name: "temperature", prompt: "enter_temp_K", value: 293.15 } }
);
