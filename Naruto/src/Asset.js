(function (ns) {

  var Asset = ns.Asset = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    bg: null,
    roleAtlas: null,
    resources: [],

    load: function () {
      this.resources = [
        {
          id: 'bg',
          src: 'images/bg.png'
        },
        {
          id: 'bgStart',
          src: 'images/bg-start.png'
        },
        {
          id: 'bgEnd',
          src: 'images/bg-end.png'
        },
        {
          id: 'playBtn',
          src: 'images/start-button.png'
        },
        {
          id: 'playAgainBtn',
          src: 'images/restart-button.png'
        },
        {
          id: 'door',
          src: 'images/door.png'
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
        },
        {
          id: 'fail',
          src: 'images/fail.png'
        },
        {
          id: 'scoreTag',
          src: 'images/score-tag.png'
        },
        {
          id: 'scoreText',
          src: 'images/score-text.png'
        },
        {
          id: 'scoreBg',
          src: 'images/score-bg.png'
        },
        {
          id: 'musicBtn',
          src: 'images/music.png'
        },
        {
          id: 'skillIcon',
          src: 'images/skill-icon.png'
        },
        {
          id: 'tutorial',
          src: 'images/tutorial.png'
        },
        {
          id: 'dialog',
          src: 'images/dialog.png'
        },
      ]

      var atlas = [
        {
          id: 'role',
          src: 'images/role-naruto.png'
        },
        {
          id: 'role3',
          src: 'images/role-third.png'
        },
        {
          id: 'skill',
          src: 'images/skill.png'
        },
        {
          id: 'skill33',
          src: 'images/skill33.png'
        },
        {
          id: 'shuimu',
          src: 'images/enemy-shuimu.png'
        },
        {
          id: 'dou',
          src: 'images/enemy-dou.png'
        },
        {
          id: 'ya',
          src: 'images/enemy-ya.png'
        },
        {
          id: 'number',
          src: 'images/number.png'
        },
      ]

      this.queue = new Hilo.LoadQueue()
      this.queue.add(atlas)
      this.queue.add(this.resources)
      this.queue.on('complete', this.onComplete.bind(this))
      this.queue.start()
    },

    onComplete: function () {
      this.resources.forEach(({ id, src }) => {
        this[id] = this.queue.getContent(src)
      })

      this.roleAtlas = (() => {
        var w = 32
        var h = 50
        var xr = w + 15
        var hr = h + 17
        return new Hilo.TextureAtlas({
          image: this.queue.getContent('role'),
          frames: [
            [5, 5, w, h],
            [xr, 5, w, h],
            [xr * 2, 5, w, h],
            [xr * 3, 5, w, h],

            [5, hr, w, h],
            [xr, hr, w, h],
            [xr * 2, hr, w, h],
            [xr * 3, hr, w, h],

            [5, hr * 2, w, h],
            [xr, hr * 2, w, h],
            [xr * 2, hr * 2, w, h],
            [xr * 3, hr * 2, w, h],

            [5, hr * 3, w, h],
            [xr, hr * 3, w, h],
            [xr * 2, hr * 3, w, h],
            [xr * 3, hr * 3, w, h],
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

      this.role3Atlas = (() => {
        var w = 55
        var h = 70
        var wc = 75
        var hc = 60
        return new Hilo.TextureAtlas({
          image: this.queue.getContent('role3'),
          frames: [
            [0, 0, w, h],
            [w + 15, 0, w, h],
            [w * 2 + 25, 0, w, h],
            [w * 3 + 55, 0, w, h],

            [0, 85, 55, 60],
            [70, 85, 75, 60],
            [145, 85, 55, 60],
            [215, 85, 75, 60],

            [0, 155, 70, 60],
            [70, 155, 75, 60],
            [145, 155, 70, 60],
            [215, 155, 75, 60],

            [0, 213, w, h],
            [w + 15, 213, w, h],
            [w * 2 + 25, 213, w, h],
            [w * 3 + 55, 213, w, h],
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

      this.shuimuAtlas = (() => {
        var w = 45
        var h = 70
        var xr = w + 20
        var hr = h + 20
        return new Hilo.TextureAtlas({
          image: this.queue.getContent('shuimu'),
          frames: [
            [5, 10, w, h],
            [xr, 10, w, h],
            [xr * 2, 10, w, h],
            [xr * 3, 10, w, h],

            [5, hr, w, h],
            [xr, hr, w, h],
            [xr * 2, hr, w, h],
            [xr * 3, hr, w, h],

            [5, hr * 2, w, h],
            [xr, hr * 2, w, h],
            [xr * 2, hr * 2, w, h],
            [xr * 3, hr * 2, w, h],

            [5, hr * 3, w, h],
            [xr, hr * 3, w, h],
            [xr * 2, hr * 3, w, h],
            [xr * 3, hr * 3, w, h],
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

      this.douAtlas = (() => {
        var w = 30
        var h = 50
        var xr = w + 15
        var hr = h + 16
        return new Hilo.TextureAtlas({
          image: this.queue.getContent('dou'),
          frames: [
            [10, 8, w, h],
            [10 + xr, 8, w, h],
            [10 + xr * 2, 8, w, h],
            [10 + xr * 3, 8, w, h],

            [10, hr, w, h],
            [10 + xr, hr, w, h],
            [10 + xr * 2, hr, w, h],
            [10 + xr * 3, hr, w, h],

            [10, hr * 2, w, h],
            [10 + xr, hr * 2, w, h],
            [10 + xr * 2, hr * 2, w, h],
            [10 + xr * 3, hr * 2, w, h],

            [10, hr * 3, w, h],
            [10 + xr, hr * 3, w, h],
            [10 + xr * 2, hr * 3, w, h],
            [10 + xr * 3, hr * 3, w, h],
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

      this.yaAtlas = (() => {
        var w = 35
        var h = 60
        var xr = w + 10
        var hr = h + 5
        return new Hilo.TextureAtlas({
          image: this.queue.getContent('ya'),
          frames: [
            [10, 0, w, h],
            [10 + xr, 0, w, h],
            [10 + xr * 2, 0, w, h],
            [10 + xr * 3, 0, w, h],

            [10, hr, w, h],
            [10 + xr, hr, w, h],
            [10 + xr * 2, hr, w, h],
            [10 + xr * 3, hr, w, h],

            [10, hr * 2, w, h],
            [10 + xr, hr * 2, w, h],
            [10 + xr * 2, hr * 2, w, h],
            [10 + xr * 3, hr * 2, w, h],

            [10, hr * 3, w, h],
            [10 + xr, hr * 3, w, h],
            [10 + xr * 2, hr * 3, w, h],
            [10 + xr * 3, hr * 3, w, h],
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

      this.skillAtlas = (() => {
        var w = 192
        var h = 95
        var xr = w + 0
        var hr = h + 95
        return new Hilo.TextureAtlas({
          image: this.queue.getContent('skill'),
          frames: [
            [0, 0, w, h],
            [xr, 0, w, h],
            [xr * 2, 0, w, h],
            [xr * 3, 0, w, h],
            [xr * 4, 0, w, h],

            [0, hr, w, h],
            [xr, hr, w, h],
            [xr * 2, hr, w, h],
            [xr * 3, hr, w, h],
            [xr * 4, hr, w, h],

            [0, hr * 2, w, h],
            [xr, hr * 2, w, h],
            [xr * 2, hr * 2, w, h],
            [xr * 3, hr * 2, w, h],
            [xr * 4, hr * 2, w, h],

            [0, hr * 3, w, h],
            [xr, hr * 3, w, h],
            [xr * 2, hr * 3, w, h],
            [xr * 3, hr * 3, w, h],
            [xr * 4, hr * 3, w, h],

            [0, hr * 4, w, h],
            [xr, hr * 4, w, h],
            [xr * 2, hr * 4, w, h],
            [xr * 3, hr * 4, w, h],
            [xr * 4, hr * 4, w, h],

            [0, hr * 5, w, h],
            [xr, hr * 5, w, h],
            [xr * 2, hr * 5, w, h],
            [xr * 3, hr * 5, w, h],
            [xr * 4, hr * 5, w, h],
          ],
          sprites: {
            start: new Array(30).fill(0).map((_, i) => i),
          },
        })
      })()

      this.skill3Atlas = (() => {
        var w = 480
        var h = 160
        var xr = w + 0
        var hr = h + 32
        return new Hilo.TextureAtlas({
          image: this.queue.getContent('skill33'),
          frames: [
            [0, 0, w, h],
            [xr, 0, w, h],
            [0, hr, w, h],
            [xr, hr, w, h],
            [0, hr * 2, w, h],
            [xr, hr * 2, w, h],
            [0, hr * 3, w, h],
            [xr, hr * 3, w, h],
            [0, hr * 4, w, h],
            [xr, hr * 4, w, h],
            [0, hr * 5, w, h],
            [xr, hr * 5, w, h],
            [0, hr * 6, w, h],
            [xr, hr * 6, w, h],
            [0, hr * 7, w, h],
            [xr, hr * 7, w, h],
            [0, hr * 8, w, h],
            [xr, hr * 8, w, h],
            [0, hr * 9, w, h],
            [xr, hr * 9, w, h],
            [0, hr * 10, w, h],
            [xr, hr * 10, w, h],
            [0, hr * 11, w, h],
            [xr, hr * 11, w, h],
            [0, hr * 12, w, h],
            [xr, hr * 12, w, h],
            [0, hr * 13, w, h],
            [xr, hr * 13, w, h],
            [0, hr * 14, w, h],
            [xr, hr * 14, w, h],
            [0, hr * 15, w, h],
            [xr, hr * 15, w, h],
          ],
          sprites: {
            start: new Array(32).fill(0).map((_, i) => i),
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

      this.queue.off('complete')
      this.fire('complete')
    }
  })

  Asset.great = true

})(window.game)