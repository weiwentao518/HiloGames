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
          id: 'bg-start',
          src: 'images/bg-start.png'
        },
        {
          id: 'bg-end',
          src: 'images/bg-end.png'
        },
        {
          id: 'start-button',
          src: 'images/start-button.png'
        },
        {
          id: 'restart-button.png',
          src: 'images/restart-button.png'
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
          id: 'skill',
          src: 'images/skill.png'
        },
        {
          id: 'skill3',
          src: 'images/skill3.png'
        },
        {
          id: 'score-tag',
          src: 'images/score-tag.png'
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
          id: 'shuimu',
          src: 'images/shuimu.png'
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
          id: 'scoreText',
          src: 'images/score-text.png'
        },
        {
          id: 'score-bg',
          src: 'images/score-bg.png'
        },
      ]

      this.queue = new Hilo.LoadQueue()
      this.queue.add(resources)
      this.queue.on('complete', this.onComplete.bind(this))
      this.queue.start()
    },

    onComplete: function () {
      this.bg = this.queue.getContent('bg')
      this.door = this.queue.getContent('door')
      this.bgEnd = this.queue.getContent('bg-end')
      this.bgStart = this.queue.getContent('bg-start')
      this.playBtn = this.queue.getContent('start-button')
      this.playAgainBtn = this.queue.getContent('restart-button.png')
      this.fail = this.queue.getContent('fail')
      this.treasure = this.queue.getContent('treasure')
      this.scoreBg = this.queue.getContent('score-bg')
      this.scoreTag = this.queue.getContent('score-tag')
      this.scoreText = this.queue.getContent('score-text')
      this.bloodFull = this.queue.getContent('bloodFull')
      this.bloodEmpty = this.queue.getContent('bloodEmpty')

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