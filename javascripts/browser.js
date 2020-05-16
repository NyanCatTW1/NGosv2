var browserCLI = [
  function (cmd) {
    if (cmd == "C" || cmd == "c") {
      term.echo("Trying to turn off the browser...")
      runWaitTimer(
        3,
        function () {
          term.echo("Goodbye.")
          term.pop()
        },
        "choose> "
      )
      return
    }
    if (cmd == "1" && player.loreId == 4) {
      term.echo("Searching for some protips online...")
      runWaitTimer(
        30,
        function () {
          displayLore(5)
          showBrowseOptions()
        },
        "choose> "
      )
      return
    } else if (cmd == "1" && player.loreId > 4) {
      term.echo("Looking through the list of ISP ads...")
      runWaitTimer(
        10,
        function () {
          term.echo("After some searching you found the following AD.")
          term.echo("Having enough with your ancient morse-code based network?")
          term.echo("Now for just TWO money you can enjoy your brand new DIAL UP network, ORDER NOW!")
          term.echo("How to order: Run the network command included in your operating system with our ISPID 'dialup' and pay, our worker will get your internet upgraded instantly then.")
          term.echo("Note: By offering our service you accept our terms of service, and will have a 5 packet/s network, with up to 10000 packets of download/upload capacity, you must pay again once you reach that capacity.")
          term.echo("Dev note: You don't need to enter that ISPID thingy right now.")
          if (!player.storeProgramsBought.includes("network")) {
            player.storeProgramsBought.push("network")
            term.echo("\nnetwork command available")
          }
          showBrowseOptions()
        },
        "choose> "
      )
      return
    }
    if (cmd == "2" && player.loreId == 5) {
      term.echo("Looking for tutorials online...")
      runWaitTimer(
        60,
        function () {
          displayLore(6)
          showBrowseOptions()
        },
        "choose> "
      )
      return
    } else if (cmd == "2" && player.loreId == 6) {
      term.echo("Looking for more tutorials online...")
      runWaitTimer(
        120,
        function () {
          displayLore(7)
          if (!player.storeProgramsBought.includes("learn")) {
            player.storeProgramsBought.push("learn")
            term.echo("\nlearn command available")
          }
          player.loreId++
          showBrowseOptions()
        },
        "choose> "
      )
      return
    }
    term.echo("Error: Invalid option.")
  },
  {
    prompt: "choose> ",
    greetings: ""
  }
]

function showBrowseOptions(startup = false) {
  term.echo()
  if (!startup) term.echo("What should you look for next?")
  term.echo("Options:")
  if (player.loreId == 4) {
    term.echo("1: How to solve captchas faster.")
  } else {
    term.echo("1: How to speed up your internet speed.")
  }
  if (player.loreId == 5) {
    term.echo("2: How to make an AI that does things for you.")
  } else if (player.loreId == 6) {
    term.echo("2: How to write code that does things for you.")
  }
  term.echo("C: How to close the browser.")
  return ""
}
