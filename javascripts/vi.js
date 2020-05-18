var storyViCLI = [
  function (cmd) {
    term.echo(`${cmd}?`)
    if (player.skills.vi.level.lt(1) && cmd.length > 0) giveExp("vi", 1, false, false)
  },
  {
    prompt: ":",
    greetings: ""
  }
]
