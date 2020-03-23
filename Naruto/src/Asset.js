(function (ns) {

  var Asset = ns.Asset = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    bg: null,
    roleAtlas: null,

    load: function () {
      var resources = [{
          id: 'bg',
          src: 'images/bg.png'
        },
        {
          id: 'role',
          src: 'images/role.png'
        }
      ];

      this.queue = new Hilo.LoadQueue();
      this.queue.add(resources);
      this.queue.on('complete', this.onComplete.bind(this));
      this.queue.start();
    },

    onComplete: function () {
      var w = 46
      var h = 62
      this.bg = this.queue.getContent('bg')

      this.roleAtlas = new Hilo.TextureAtlas({
        image: this.queue.getContent('role'),
        frames: [
          [0, 0, w, h],
          [w, 0, w, h],
          [w * 2, 0, w, h],
          [w * 3, 0, w, h],

          [0, h, w, h],
          [w, h, w, h],
          [w * 2, h, w, h],
          [w * 3, h, w, h],

          [0, h * 2, w, h],
          [w, h * 2, w, h],
          [w * 2, h * 2, w, h],
          [w * 3, h * 2, w, h],

          [0, h * 3, w, h],
          [w, h * 3, w, h],
          [w * 2, h * 3, w, h],
          [w * 3, h * 3, w, h],
        ],
        sprites: {
          forward: [0, 1, 2, 3],
          left: [4, 5, 6, 7],
          right: [8, 9, 10, 11],
          backward: [12, 13, 14, 15],
        },
        width: 100,
        height: 200,
      });

      this.queue.off('complete');
      this.fire('complete');
    }
  });

  Asset.great = true

})(window.game);