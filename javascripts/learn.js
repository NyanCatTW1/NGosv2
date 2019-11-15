function until(conditionFunction) {
  // https://stackoverflow.com/a/52657929

  const poll = resolve => {
    if (conditionFunction()) resolve()
    else setTimeout(_ => poll(resolve), 400)
  }

  return new Promise(poll)
}

function giveExp(subject, amount) {
  player.skills[subject].exp = player.skills[subject].exp.plus(amount)
  if (player.skills[subject].exp.gte(player.skills[subject].levelUpReq)) {
    player.skills[subject].exp = new Decimal(0)
    player.skills[subject].level = player.skills[subject].level.plus(1)
    player.skills[subject].levelUpReq = player.skills[subject].levelUpReq.plus(player.skills[subject].levelUpReqScale)
    term.echo(`Your ${subject} skill has level up to level ${shortenMoney(player.skills[subject].level)}! Next level up at ${shortenMoney(player.skills[subject].levelUpReq)} exp.`)
  }
}

async function learnProgramming() {
  let keepLearning = true
  let cycleDone = false
  term.echo("You opened up the website and started to learn how to code...")
  while (keepLearning) {
    term.echo("The webpage is being downloaded...")
    runNetTimer(new Decimal(10), function() {
      term.echo("The browser is rendering the webpage...")
      runCPUTimer(new Decimal(10), function() {
        term.echo("You are learning about the webpage's content...")
        runWaitTimer(5, function() {
          term.echo("Done! You gained 1 exp.")
          giveExp("programming", new Decimal(1))
          keepLearning = false
          cycleDone = true
        })
      })
    })
    await until(_ => cycleDone == true)
  }
}
