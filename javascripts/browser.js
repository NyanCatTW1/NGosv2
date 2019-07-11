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
        term.echo("After some searching you found the following tricks, in ascending order of usefulness to you")
        term.echo("1. Practice so you can simply solve them faster")
        term.echo("2. Get a faster network so you can download and solve captcha tasks faster")
        term.echo("3. If you dare to, write an AI and let that solve it for you")
        term.echo("Only second and thrid sounds useful to you right now, which should you do first though?")
        player.loreId++
        showBrowseOptions()
      },"choose> ")
      return
    } else if (cmd == "1" && player.loreId > 4) {
      term.echo("Looking through the list of ISP ads...")
      runTimer(new Decimal(10),new Decimal(1),new Decimal(0),function(){},function(){
        term.echo("After some searching you found the following AD.")
        term.echo("Having enough with your ancient morse-code based network?")
        term.echo("Now for just TWO dollars you can enjoy your brand new DIAL UP network, ORDER NOW!")
        term.echo("How to order: Run the network command included in your operating system, then follow the instructions to choose our service and pay, our worker will get your internet upgraded instantly then.")
        term.echo("Note: By offering our service you accept our terms of service, and will have a 5 kilobit/s network, with up to 10 megabits of download/upload capacity, where you must pay for our service again.")
        if (!player.storeProgramsBought.includes("network")) {
          player.storeProgramsBought.push("network")
          term.echo("\nnetwork command available")
        }
        showBrowseOptions()
      },"choose> ")
      return
    }
    if (cmd == "2" && player.loreId == 5) {
      term.echo("Looking for tutorials online...")
      runTimer(new Decimal(60),new Decimal(1),new Decimal(0),function(){},function(){
        term.echo("After searching you learned that you don't need AI for your simple captcha tasks.")
        term.echo("Instead you can write codes to complete those tasks automatically.")
        term.echo("Better go back and learn how to write codes to do that.")
        player.loreId++
        showBrowseOptions()
      },"choose> ")
      return
    } else if (cmd == "2" && player.loreId == 6) {
      term.echo("Looking for more tutorials online...")
      runTimer(new Decimal(120),new Decimal(1),new Decimal(0),function(){},function(){
        term.echo("After going through dozens of paid website ADs, you find a free website to learn coding")
        term.echo("Better add it to your bookmark so you can learn coding and 'AIize' captcha solving")
        if (!player.storeProgramsBought.includes("learn")) {
          player.storeProgramsBought.push("learn")
          term.echo("\nlearn command available")
        }
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
  } else {
    term.echo("1: How to speed up your internet speed.")
  }
  if (player.loreId == 5) {
    term.echo("2: How to make an AI that does thing for you.")
  } else if (player.loreId == 6) {
    term.echo("2: How to write code that does thing for you.")
  }
  term.echo("C: How to close the browser.")
  return ""
}
