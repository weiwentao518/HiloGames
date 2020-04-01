(function (ns) {

  var Asset = ns.Asset = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    bg: null,
    roleAtlas: null,

    load: function () {
      var resources = [
        {
          id: 'bg',
          src: 'images/bg.png'
        },
        {
          id: 'role',
          src: 'images/role.png'
        },
        {
          id: 'role3',
          src: 'images/role-third.png'
        },
        {
          id: 'number',
          src: 'images/number.png'
        },
        {
          id: 'door',
          src: 'images/door.png'
        },
        {
          id: 'dog',
          src: 'images/dog.png'
        },
        {
          id: 'treasure',
          src: 'images/treasure.png'
        },
        {
          id: 'bloodEmpty',
          src: 'images/blood-empty.png'
        },
        {
          id: 'bloodFull',
          src: 'images/blood-full.png'
        }
      ];

      this.queue = new Hilo.LoadQueue();
      this.queue.add(resources);
      this.queue.on('complete', this.onComplete.bind(this));
      this.queue.start();
    },

    onComplete: function () {
      this.bg = this.queue.getContent('bg')
      this.door = this.queue.getContent('door')
      this.treasure = this.queue.getContent('treasure')
      this.bloodFull = this.queue.getContent('bloodFull')
      this.bloodEmpty = this.queue.getContent('bloodEmpty')

      this.roleAtlas = (() => {
        var w = 46
        var h = 62
        return new Hilo.TextureAtlas({
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
            standing: [0],
            down: [0, 1, 2, 3],
            left: [4, 5, 6, 7],
            right: [8, 9, 10, 11],
            up: [12, 13, 14, 15],
          },
        })
      })()

      this.roleMaxAtlas = (() => {
        var w = 70
        var h = 80
        return new Hilo.TextureAtlas({
          image: this.queue.getContent('role3'),
          frames: [
            [0, 0, w, h],
            [w, 0, w, h],
            [w * 2, 0, w, h],
            [w * 3, 0, w, h],

            [0, h, w, h],
            [w, h, w, h],
            [w * 2, h, w, h],
            [w * 3, h, w, h],

            [0, h * 2, w + 2, h - 21],
            [w, h * 2, w + 2, h - 21],
            [w * 2, h * 2, w + 2, h - 21],
            [w * 3, h * 2, w + 2, h - 21],

            [0, h * 2.8, w + 5, h],
            [w, h * 2.8, w + 5, h],
            [w * 2, h * 2.8, w + 5, h],
            [w * 3, h * 2.8, w + 5, h],
          ],
          sprites: {
            standing: [0],
            down: [0, 1, 2, 3],
            left: [4, 5, 6, 7],
            right: [8, 9, 10, 11],
            up: [12, 13, 14, 15],
          }
        })
      })()

      this.dogAtlas = (() => {
        var w = 63
        var h = 60
        return new Hilo.TextureAtlas({
          image: this.queue.getContent('dog'),
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
            standing: [0],
            down: [0, 1, 2, 3],
            left: [4, 5, 6, 7],
            right: [8, 9, 10, 11],
            up: [12, 13, 14, 15],
          },
        })
      })()

      var number = this.queue.get('number').content
      this.numberGlyphs = {
        0: {
          image: number,
          rect: [0, 0, 60, 91]
        },
        1: {
          image: number,
          rect: [61, 0, 60, 91]
        },
        2: {
          image: number,
          rect: [121, 0, 60, 91]
        },
        3: {
          image: number,
          rect: [191, 0, 60, 91]
        },
        4: {
          image: number,
          rect: [261, 0, 60, 91]
        },
        5: {
          image: number,
          rect: [331, 0, 60, 91]
        },
        6: {
          image: number,
          rect: [401, 0, 60, 91]
        },
        7: {
          image: number,
          rect: [471, 0, 60, 91]
        },
        8: {
          image: number,
          rect: [541, 0, 60, 91]
        },
        9: {
          image: number,
          rect: [611, 0, 60, 91]
        }
      }

      this.queue.off('complete');
      this.fire('complete');
    }
  });

  Asset.great = true

})(window.game);