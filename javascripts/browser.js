var browserCLI = [
  function(cmd) {
    if (cmd == "C") {
      term.echo("Trying to turn off the browser...")
      runTimer(new Decimal(3),new Decimal(1),new Decimal(0),function(){},function(){
        term.echo("Goodbye.")
        term.pop()
      },"choose> ")
      return
    }
    if (cmd == "1" && player.loreId == 4) {
      term.echo("Searching for some protips online...")
      runTimer(new Decimal(30),new Decimal(1),new Decimal(0),function(){},function(){
        term.echo("ENDGAME: There should be protips here.")
        player.loreId++
        showBrowseOptions()
      },"choose> ")
      return
    }
    term.echo("Error: Invalid option.")
  }, {
  prompt: "choose> ",
  greetings: ""
}]

function showBrowseOptions(startup=false) {
  term.echo()
  if (!startup) term.echo("What should you look for next?")
  term.echo("Options:")
  if (player.loreId == 4) {
    term.echo("1: How to solve captchas faster.")
  }
  term.echo("C: How to close the browser.")
  return ""
}
