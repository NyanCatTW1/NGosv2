let saveName = "ngossave"

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function saveGame() {
  localStorage.setItem(saveName,btoa(JSON.stringify(player)))
}

function loadGame(save) {
  let reference = getInitPlayer()
  let save = JSON.parse(atob())
  let temp = listItems(reference)
  let decimalList = temp[0]
  let itemList = temp[1]
  itemList.diff(listItems(save)[1]).forEach(function(value) {
    eval(`save.${value} = reference.${value}`) // No one will exploit their browser with localStorage right
  })
  
  decimalList.forEach(function(value) {
    eval(`save.${value} = new Decimal(save.${value})`)
  })
  
  player = save
}

function listItems(data,nestIndex="") {
  let decimalList = []
  let itemList = []
  $.each(data, function (index, value) {
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