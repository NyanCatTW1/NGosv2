// Note: Make sure your saving variable is defined by VAR and not LET, otherwise it won't work
// And please, just please make sure you change the stuff below to suit your code, otherwise it will burst on fire
let saveName = "ngossave"
let initPlayerFunctionName = "getInitPlayer"
let playerVarName = "player" // DO NOT USE THE WORD "SAVE"
let importDangerAlertText = "Your imported save seems to be missing some values, which means importing this save might be destructive, if you have made a backup of your current save and are sure about importing this save please press OK, if not, press cancel and the save will not be imported."

function onImportError() {
    term.echo("Error: Imported save is in invalid format, please make sure you've copied the save correctly and isn't just typing gibberish.")
}

function onLoadError() {
    term.echo("I think you got your save messed up so bad we can't load it, the save have been exported automatically to your clipboard for debug purpose, please send it to the developer(Nyan cat) to see what's wrong!")
    copyStringToClipboard(save)
}

function onImportSuccess() {
    term.echo("Save imported successfully.")
}
// Only change things above to fit your game UNLESS you know what you're doing

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function saveGame() {
  localStorage.setItem(saveName,btoa(JSON.stringify(window[playerVarName])))
}

function loadGame(save, imported = false) {
    let reference = window[initPlayerFunctionName]()
    try {
        var save = JSON.parse(atob(save))
        let temp = listItems(reference)
        let decimalList = temp[0]
        let itemList = temp[1]
        let missingItem = itemList.diff(listItems(save)[1])
        if (missingItem.includes("save")) {
            console.log("Unrecoverable corrupted save detected, loading default save...")
            return
        }
        if (missingItem.length != 0 && imported) {
            if (!confirm(importDangerAlertText)) {
                return
            }
        }
        missingItem.forEach(function(value) {
            eval(`save${generateArrayAccessCode(value)} = reference${generateArrayAccessCode(value)}`) // No one will exploit their browser with localStorage right
        })

        decimalList.forEach(function(value) {
            eval(`save${generateArrayAccessCode(value)} = new Decimal(save${generateArrayAccessCode(value)})`)
        })

        window[playerVarName] = save
        if (imported) onImportSuccess()
    } catch (err) {
        if (imported) {
            console.log(err)
            onImportError()
            return
        } else {
            console.log(err)
            onLoadError()
            return
        }
    }
}

function generateArrayAccessCode(keys) {
    let out = ""
    keys.split(".").forEach(function(value) {
        out += `["${value}"]`
    })
    return out
}

function listItems(data,nestIndex="") {
  let decimalList = []
  let itemList = []
  Object.keys(data).forEach(function (index) {
    let value = data[index]
    itemList.push(nestIndex + (nestIndex===""?"":".") + index)
    if (typeof value == 'object') {
      if (value instanceof Decimal) {
        decimalList.push(nestIndex + (nestIndex===""?"":".") + index)
      } else {
        let temp = listItems(value, nestIndex + (nestIndex===""?"":".") + index)
        decimalList = decimalList.concat(temp[0])
        itemList = itemList.concat(temp[1])
      }
    }
  });
  return [decimalList,itemList]
};
