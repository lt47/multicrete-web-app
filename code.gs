const Route = {};
Route.path = function(route, callback){
  Route[route] = callback;
}

function doGet(e){ 
  const home = HtmlService.createTemplateFromFile("info").evaluate();
  Route.path("prepost", loadPrePostTable()); 
  Route.path("inspcoversheet", loadInspCover()); 
  Route.path("equiphistory", loadEquipHistory()); 
  Route.path("info", home)

  //Logger.log(ScriptApp.getService().getUrl());
  //Logger.log(e.parameters.v);

  if(Route[e.parameters.v]){
    return Route[e.parameters.v];
  } else {
    return HtmlService.createTemplateFromFile("info").evaluate();
  }
}

function loadInspCoverOptions(){
  const ss = SpreadsheetApp.openById(sheetid);
  const ws = ss.getSheetByName("PullDownItems");
  const assetlist = ws.getRange(2, 5, ws.getRange("E1").getDataRegion().getLastRow()-1, 1).getDisplayValues();

  const inspdatelist = ws.getRange(2, 6, ws.getRange("F1").getDataRegion().getLastRow()-1, 1).getDisplayValues();

  /*const assetListArray = assetlist.map(function(r){return '<option>' + r[0] + '</option>';}).join("");
  Logger.log(assetListArray);*/

  const tmp = HtmlService.createTemplateFromFile("inspcoversheet");
  const assetlistDupes = assetlist.map(function(r){return r[0];});

  tmp.assetlist = assetlistDupes.filter(getUniqueAssets);
  tmp.inspdatelist = inspdatelist.map(function(r){return r[0];});
  
  return tmp.evaluate();
}

function loadInspCover(){
  return loadInspCoverOptions();
}

function sortDatebyAsset(assetno){
  const ss = SpreadsheetApp.openById(sheetid);
  const ws = ss.getSheetByName("PullDownItems");
  const data = ws.getRange(2, 5, ws.getRange("E1").getDataRegion().getLastRow()-1, 2).getDisplayValues();

  //const mictest = ws.getRange("E3").getDisplayValue();

  const updatedInspDateList = new Array();

  for (let i = 0; i < data.length; i++){
    let innerData = data[i];
    Logger.log(innerData);
    for (let j = 0; j < 1; j++){
      if(innerData[0] == assetno){
        updatedInspDateList.push(innerData[1])
        }
    }
  }
  const inspdateOptions = updatedInspDateList.map(function(r){return r;});
  return inspdateOptions;
}

function loadPrePostTable(){
  return HtmlService.createTemplateFromFile("prepost").evaluate();
}

function loadEquipHistoryOptions(){
  const ss = SpreadsheetApp.openById(sheetid);
  const ws = ss.getSheetByName("PullDownItems");
  const assetlist = ws.getRange(2, 5, ws.getRange("E1").getDataRegion().getLastRow()-1, 1).getDisplayValues();

  const tmp = HtmlService.createTemplateFromFile("equiphistory");
  const assetlistDupes = assetlist.map(function(r){return r[0];});

  tmp.assetlist = assetlistDupes.filter(getUniqueAssets);
  
  return tmp.evaluate();
}

function loadEquipHistory(){
  return loadEquipHistoryOptions();
}


function include(File) {
  return HtmlService.createHtmlOutputFromFile(File).getContent();
};


function getUniqueAssets(value, index, self) {
  return self.indexOf(value) === index;
}
