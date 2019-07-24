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
    let soundTV,soundAudio1
    let fm = 0
    let btnAllowed = false
    let btnToggle = false
    const lanDetect = () => {
        if (btnToggle) {
            return 'ZH'
        } else {
            return ''
        }
    }

    //TODO 点击后加载音频和事件
    document.getElementById('btn1').onclick = (e) => {
        //* [`${path}文件名${format}`]
        sound = new Howl({
            //杂音
            src: [`${path}pureNoise${format}`]
        })

        soundFM = new Howl({
            //带人声的杂音
            src: [`${path}changeFM+${format}`]
        })

        soundTV = new Howl({
            src: [`${path}tv1${format}`],
            loop: true
        })

        soundAudio1 = new Howl({
            src:[`${path}audio1${format}`],
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

        

        //把按钮提示背景色取消
        document.getElementById("controller").style.background = 'transparent'
            document.body.addEventListener("wheel", wheelHandler, false)
        e.target.remove()
        // document.getElementById('tip').style.display = 'block'
        // document.getElementById('btn2').style.display = 'block'

    }

    // deleted 语言切换,更改播放路径
    //* 中文版的音频命名方式: ZH + oringal name
    // document.getElementById('btn2').onclick=(e)=>{
    //     btnToggle = !btnToggle
    //     if(btnToggle){
    //         e.target.innerHTML = 'Chinese'
    //     }else{
    //         e.target.innerHTML = 'English'
    //     }
    //
    //     //* 每增加一个段音频,都要复制一组这段代码, src:[`${path}${lanDetect()}文件名${format}`]
    //
    //     //* start
    //     soundAudio1.stop()
    //     soundAudio1 = new Howl({
    //         src: [`${path}${lanDetect()}audio1${format}`],
    //         loop:true
    //     })//* end
    //
    // }

    // //TODO 提示
    // document.querySelector('#tip div').onclick=(e)=>{
    //     document.body.addEventListener("wheel", wheelHandler, false)
    //     e.target.parentNode.remove()
    // }


    // let fmDegreeArr = [88,90,93,96,100,104,106,108]
    // let amDegreeArr = [540,600,700,800,1000,1200,1400,1600]




    //TODO PaperCanvas
    let paperCanvas = document.createElement('canvas')
    paperCanvas.id = 'paperCanvas'
    // paperCanvas.width = 1024
    // paperCanvas.height = 1024
    document.body.appendChild(paperCanvas)
    paper.setup('paperCanvas')
    let pathText
    let [w,h] = [window.innerWidth,window.innerHeight]

    var image = new Image();

    //* glitch效果的参数在这里改!!!
    var glitchParams = {
        seed:       rNF(99), // integer between 0 and 99
        quality:    88, // integer between 0 and 99
        amount:     8, // integer between 0 and 99
        iterations: 1 // integer between 0 and 99
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

    //* 背景图的路径在这里改,把图片放在js文件夹内
    image.style.width = w
    image.src = './js/delta-mirror-background.jpg'



    project.activeLayer.clear()
    let pathG = new Group()
    //* 红色刻度指针的长度
    let lineLength  = 120 
    let verticalLine = new Path.Line([0,0])
    verticalLine.addSegment(new Point(0, lineLength))
    verticalLine.name = "redLine"

    //* 红色刻度指针的样式
    verticalLine.style={
        strokeColor:'red',
        strokeWidth:5
    }

    pathG.addChild(verticalLine)
    
    //* 指针偏移的距离, 如果对不齐刻度,改这里
    pathG.position.x += 300
    pathG.position.y += h/1.5
    pathG.scale(0.8)

    let timer
    let line = pathG.children['redLine']
    function wheelHandler(e) {

        //TODO 鼠标滑轮改变fm值
        let [min, max] = [-10, 10]
        let delta = Math.min(max, Math.max(min, e.deltaY))
        fm += Math.round(delta)
        if (fm < 0) fm = 0
        if(fm==0) return
        console.log("fm当前值:" + Math.floor(fm / 100));
        switch (Math.floor(fm/100)) {
            //TODO 播放不同的音频
            case 3:
                //TODO 当FM值滚动到3的时候会激活这个音频
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
                soundTV.pause()
                soundFM.stop()
                sound.play(soundSprites[rNF(soundSprites.length)])
                soundFM.play(soundFMSprites[rNF(soundFMSprites.length)])
                if (!soundAudio1.playing()) {
                    soundAudio1.play()
                }
                break;
            default:
                soundAudio1.pause()
                soundTV.pause()
                sound.stop()
                soundFM.stop()
                soundFM.play(soundFMSprites[rNF(soundFMSprites.length-1)])
                sound.play(soundSprites[rNF(soundSprites.length-1)])
                break;

        }
        // console.log(image.width);
        
        line.position.x += delta
        if (line.position.x > image.width*0.9-200) {
            line.position.x = image.width * 0.9-200
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