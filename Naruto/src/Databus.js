(function (ns) {
  let instance

  ns.Databus = Hilo.Class.create({
    constructor: function() {
      if (instance) return instance

      instance = this
      this.BG_CORNER = {
        top: 10,
        left: 55,
        right: 1065,
        bottom: 1040
      }

      this.reset()
    },

    reset () {

    }
  })
})(window.game);