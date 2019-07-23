//TODO Tool functions

const rNF = (x) => {
    return Math.floor(Math.random() * x)
}

//TODO Tool functions End


window.onload = () => {
    paper.install(window)

    // TODO define audio
    let path = './audio/'
    let format = '.mp3'
    let sound, soundSprites
    let soundFM, soundFMSprites
    let soundTV,soundSong
    let fm = 0

    //TODO 点击后加载音频和事件
    document.getElementById('btn1').onclick = () => {
        sound = new Howl({
            src: [`${path}pureNoise${format}`]
        })

        soundFM = new Howl({
            src: [`${path}changeFM+${format}`]
        })

        soundTV = new Howl({
            src: [`${path}tv1${format}`],
            loop: true
        })

        soundSong = new Howl({
            src:[`${path}song1${format}`],
            loop:true
        })

        sound.once('load', () => {
            //TODO 给整段音频拆分若干个精灵,每个长度1000
            for (let i = 0; i < Math.round(sound._duration); i++) {
                sound._sprite[`part${i}`] = [i * 1000, [i + 1] * 1000]
            }
            soundSprites = Object.keys(sound._sprite)
        });

        soundFM.once('load', () => {
            for (let i = 0; i < Math.round(soundFM._duration); i++) {
                soundFM._sprite[`part${i}`] = [i * 1000, [i + 1] * 1000]
            }
            soundFMSprites = Object.keys(soundFM._sprite)
        })

        //TODO 添加滑轮事件给窗口
        document.body.addEventListener("wheel", wheelHandler, false)

    }




    let fmDegreeArr = [88,90,93,96,100,104,106,108]
    let amDegreeArr = [540,600,700,800,1000,1200,1400,1600]




    //TODO PaperCanvas
    let paperCanvas = document.createElement('canvas')
    paperCanvas.id = 'paperCanvas'
    paperCanvas.width = 1024
    paperCanvas.height = 1024
    document.body.appendChild(paperCanvas)
    paper.setup('paperCanvas')
    let pathText
    let [w,h] = [window.innerWidth,window.innerHeight]

    var image = new Image();

    var glitchParams = {
        seed:       rNF(99), // integer between 0 and 99
        quality:    22, // integer between 0 and 99
        amount:     10, // integer between 0 and 99
        iterations: 1  // integer
    };


    var canvas,ctx
    image.onload = function () {
        glitch(glitchParams)
            .fromImage( image )
            .toImageData()
            .then( function( imgData ) {
                canvas = document.createElement( 'canvas' );
                canvas.setAttribute('id','bgImg')
                canvas.width = w
                canvas.height =h
                ctx = canvas.getContext( '2d' );

                ctx.putImageData( imgData, 0, 0 );
                document.body.appendChild( canvas );
                canvas.style.left = "auto"
            } );
    };

    image.style.width = w
    image.src = './js/RADIO-01.jpg'


    project.activeLayer.clear()
    let pathG = new Group()

    let verticalLine = new Path.Line([0,0])
    verticalLine.addSegment(new Point(0,120))
    verticalLine.name = "redLine"
    verticalLine.style={
        strokeColor:'red',
        strokeWidth:5
    }
    pathG.addChild(verticalLine)
    // pathG.fitBounds(view.bounds)
    pathG.position.x += 300
    pathG.position.y += h/2
    pathG.scale(0.8)

    let timer

    function wheelHandler(e) {

        //TODO 鼠标滑轮改变fm值
        let [min, max] = [-10, 10]
        let delta = Math.min(max, Math.max(min, e.deltaY))
        fm += Math.round(delta)
        if (fm < 0) fm = 0
        if(fm==0) return
        switch (Math.floor(fm/100)) {
            //TODO 播放不同的音频
            case 3:
                //TODO 当FM值滚动到300的时候会激活这个音频
                sound.stop()
                soundFM.stop()
                sound.play(soundSprites[rNF(soundSprites.length)])
                soundFM.play(soundFMSprites[rNF(soundFMSprites.length)])
                if (!soundTV.playing()) {
                    soundTV.fade(0, 1, 1)
                    soundTV.play()
                }
                break;
            case 6:
                sound.stop()
                soundFM.stop()
                sound.play(soundSprites[rNF(soundSprites.length)])
                soundFM.play(soundFMSprites[rNF(soundFMSprites.length)])
                if (!soundSong.playing()) {
                    soundSong.play()
                }
                break;
            default:
                soundSong.pause()
                soundTV.pause()
                sound.stop()
                soundFM.stop()
                soundFM.play(soundFMSprites[rNF(soundFMSprites.length-1)])
                sound.play(soundSprites[rNF(soundSprites.length-1)])
                break;

        }

        if(fm<1000){
            let line = pathG.children['redLine']
            line.position.x += delta
        }

        clearTimeout(timer);
        timer = setTimeout(()=>{
            glitchParams.seed = rNF(100)
            glitchParams.quality = Math.max(80,rNF(100))
            glitchParams.iterations = rNF(3)
            glitch(glitchParams)
                .fromImage( image )
                .toImageData()
                .then( function( imageData ) {
                    ctx.putImageData( imageData, 0, 0 );
                } );
        },100)



    }//滑轮事件end


}