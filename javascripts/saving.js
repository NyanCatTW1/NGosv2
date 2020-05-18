// THE saving library, by Nyan Cat 2019, v1
// Note: Make sure your saving variable is defined by VAR and not LET, otherwise it won't work
// And please, just please make sure you change the stuff below to suit your code, otherwise it will burst on fire
let saveName = "ngossave"
let initPlayerFunctionName = "getInitPlayer"
let playerVarName = "player" // DO NOT USE THE WORD "SAVE"
let importDangerAlertText = "Your imported save seems to be missing some values, which means importing this save might be destructive, if you have made a backup of your current save and are sure about importing this save please press OK, if not, press cancel and the save will not be imported."
let versionTagName = "saveVersion" // Put the variable name of what you are using for savefile version here
let arrayTypes = {
  // For EACH array in your player variable, put a key/value to define its type like I did below
  storeProgramsBought: "String"
}

function onImportError() {
  term.echo("Error occured while importing the savefile, please make sure you've copied the save correctly and isn't just typing gibberish. Otherwise, report this to the developer(Nyan Cat) immediately!")
}

function onLoadError(save) {
  if (term === undefined) initTerm()
  term.echo("I think you got your save messed up so bad we can't load it, the save have been exported automatically to your clipboard for debug purpose, please send it to the developer(Nyan cat) to see what's wrong!")
  copyStringToClipboard(save)
}

function onImportSuccess() {
  term.clear()
  term.echo("Save imported successfully.")
}

function onLoad() {
  // Put your savefile updating codes here

  // Version 0 -> 1
  _.unset(player, "skills.programming.levelUpReqScale")
  _.unset(player, "skills.vi.levelUpReqScale")

  for (let skill of Object.keys(levelUpReqFuncs)) {
    updateLevelUpReq(skill)
  }
}
// Only change things above to fit your game UNLESS you know what you're doing

Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0
  })
}

function saveGame() {
  localStorage.setItem(saveName, btoa(JSON.stringify(window[playerVarName])))
}

function loadGame(save, imported = false) {
  try {
    var save = JSON.parse(atob(save))
    let reference = window[initPlayerFunctionName]()
    let refLists = listItems(reference)
    let saveLists = listItems(save)
    let missingItem = refLists[0].diff(saveLists[0])
    if (missingItem.includes("save")) {
      console.log("Unrecoverable corrupted save detected, loading default save...")
      return
    }
    if (missingItem.length != 0 && imported) {
      if (!confirm(importDangerAlertText)) {
        return
      }
    }

    missingItem.forEach(function (value) {
      if (value != versionTagName) _.set(save, value, _.get(reference, value))
    })

    let decimalList = saveLists[1].diff(refLists[1])
    decimalList.forEach(function (value) {
      _.set(save, value, new Decimal(_.get(save, value)))
    })

    saveLists[2].forEach(function (value) {
      let arrayType = findArrayType(value)
      if (arrayType != "String") _.set(save, value, _.get(save, value).map(getMapFunc(arrayType)))
    })

    window[playerVarName] = save
    onLoad()
    _.set(save, versionTagName, _.get(reference, versionTagName))
    if (imported) onImportSuccess()
  } catch (err) {
    if (imported) {
      console.log(err)
      onImportError(save)
      return
    } else {
      console.log(err)
      onLoadError(save)
      return
    }
  }
}

function getMapFunc(type) {
  switch (type) {
    case "Decimal":
      return (x) => new Decimal(x)
    default:
      return (x) => x
  }
}

function findArrayType(index) {
  let definedType = arrayTypes[index]
  if (definedType === undefined) return "String"
  return definedType
}

function listItems(data, nestIndex = "") {
  let itemList = []
  let stringList = []
  let arrayList = []
  Object.keys(data).forEach(function (index) {
    let value = data[index]
    let thisIndex = nestIndex + (nestIndex === "" ? "" : ".") + index
    itemList.push(thisIndex)
    switch (typeof value) {
      case "object":
        if (value instanceof Array) {
          arrayList.push(thisIndex)
        } else if (!(value instanceof Decimal)) {
          let temp = listItems(value, thisIndex)
          itemList = itemList.concat(temp[0])
          stringList = stringList.concat(temp[1])
          arrayList = arrayList.concat(temp[2])
        }
        break
      case "string":
        stringList.push(thisIndex)
        break
    }
  })
  return [itemList, stringList, arrayList]
}
