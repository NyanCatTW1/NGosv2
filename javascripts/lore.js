var loreMessages = [
  null,
  // 1
  `Your computer is too weak for the game, you decides to do some captcha tasks online for some money for buying new hardwares.
captcha and lore command available.`,
  // 2
  `You have just done a task, to see your money and trust, type 'captcha stat'`,
  // 3
  `Now that you have money to spend, you can buy programs with them at the store.
store command available.`,
  // 4
  `So, somehow you don't have a web browser until now, what should you start checking first with your browser though...
OH! Speed up captcha solving! Why didn't I think of that first?
Time to get your browser on and search how to do that.`,
  // 5
  `After some searching you found the following tricks, in ascending order of usefulness to you
1. Practice so you can simply solve them faster
2. Get a faster network so you can download and solve captcha tasks faster
3. If you dare to, write an AI and let that solve it for you
Only second and thrid sounds useful to you right now, which one should you do first though?`,
  // 6
  `After searching you learned that you don't need AI for your simple captcha tasks.
Instead you can write codes to complete those tasks automatically.
Better go back and learn how to write codes to do that.`,
  // 7
  `After going through dozens of paid website ADs, you find a free website to learn coding
Better add it to your bookmark so you can learn coding and 'AIize' captcha solving`,
  // 8
  `You learned the very basics of programming, stuff like hello world, messing with small numbers, outputting things...
Now you think it's time you try and automate some stuff, maybe start with automatically accepting tasks?
People online say real programmers use vi, so you think you'll do that as well.
vi command available`,
  // 9
  `What is going on here? You can't seem to type anything, you can't even close the editor! Should have looked up tutorials first...
Well, I guess all you can do now is restart the system, physically, and make sure not to start the editor again until you learn how to use it.`,
  // 10
  `So according to the guide, you need to type certain commands in order to use the editor properly, and there are quite a few commands and hotkeys out there... You should learn them time to time.`
]

function checkLore() {
  switch (player.loreId) {
    case 0:
      if (player.rungameAttempts.gte(1)) {
        displayLore(1)
      }
      break
    case 1:
      if (player.trust.notEquals(0)) {
        displayLore(2)
      }
      break
    case 2:
      if (player.withdrawnMoney.notEquals(0)) {
        displayLore(3)
      }
      break
    case 3:
      if (player.storeProgramsBought.includes("browser")) {
        displayLore(4)
      }
      break
    case 7:
      if (player.skills.programming.level.gte(5)) {
        displayLore(8)
      }
      break
    case 8:
      if (player.skills.vi.level.gte(1)) {
        displayLore(9)
      }
      break
  }
}

function displayLore(id, displayId = false) {
  if (!(Number.isInteger(id) && id > 0)) return
  if (displayId) term.echo(`Lore ${id}`)
  let loreMessage = loreMessages[id].split("\n")
  for (let i = 0; i < loreMessage.length; i++) {
    term.echo(loreMessage[i])
  }
  player.loreId = Math.max(player.loreId, id)
}

function loreCmd(...args) {
  if (args.length === 0) displayLore(player.loreId, true)
  else if (args[0] == "all") {
    for (let i = 0; i <= player.loreId; i++) {
      displayLore(i, true)
    }
  } else if (Number.isInteger(args[0]) && parseInt(args[0]) > 0) {
    displayLore(parseInt(args[0]), true)
  } else {
    term.echo("Invalid lore id! It should be a integer higher than zero.")
  }
  return
}
