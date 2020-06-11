(function () {
  var haveEvents = 'ongamepadconnected' in window
  var controllers = {}
  // https://blog.csdn.net/github_35568698/article/details/79033687
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
  function connecthandler(e) {
    console.log(e.gamepad)
    addgamepad(e.gamepad)
  }

  function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad
    requestAnimationFrame(updateStatus)
  }

  function disconnecthandler(e) {
    removegamepad(e.gamepad)
  }

  function removegamepad(gamepad) {
    var d = document.getElementById("controller" + gamepad.index)
    document.body.removeChild(d)
    delete controllers[gamepad.index]
  }

  function updateStatus() {
    if (!haveEvents) {
      scangamepads()
    }

    var i = 0
    var j

    for (j in controllers) {
      var controller = controllers[j]

      for (i = 0; i < controller.buttons.length; i++) {
        var val = controller.buttons[i]

        if (val.pressed) {
          console.log("button pressed", i)
        }
      }

      for (i = 0; i < controller.axes.length; i++) {
        if (i === 0) {
          const row1 = controller.axes[i]
          if (row1 >= 0.8) {
            console.log('right!', row1.toFixed(4))
          } else if (row1 <= -0.8) {
            console.log('left!', row1.toFixed(4))
          }
        }

        if (i === 1) {
          const col1 = controller.axes[i]
          if (col1 >= 0.8) {
            console.log('down!', col1.toFixed(4))
          } else if (col1 <= -0.8) {
            console.log('go up!', col1.toFixed(4))
          }
        }
      }
    }

    requestAnimationFrame(updateStatus)
  }

  function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [])
    for (var i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        if (gamepads[i].index in controllers) {
          controllers[gamepads[i].index] = gamepads[i]
        } else {
          addgamepad(gamepads[i])
        }
      }
    }
  }

  window.addEventListener("gamepadconnected", connecthandler)
  window.addEventListener("gamepaddisconnected", disconnecthandler)
})()