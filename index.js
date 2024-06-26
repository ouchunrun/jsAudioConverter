let tip = document.getElementsByClassName('tip')[0]
let tipIcon = document.getElementsByClassName('tip-icon')[0]
let tipText = document.getElementsByClassName('tip-text')[0]

let fileUploadContent = document.getElementById('fileUploadContent')
let fileConversion = document.getElementById('fileConversion')
let fileIcon = document.getElementsByClassName('fileIcon')[0]
let fileName = document.getElementsByClassName('fileName')[0]
let consoleArea = document.getElementsByClassName('console')[0]
let consoleLog = document.getElementById('consoleLog')

let uploadFile
let uploadFileInput = document.getElementById('uploadFile')
let selectButton = document.getElementById('selectButton')
let fileSwitchButton = document.getElementById('fileSwitch')
let startOverButton = document.getElementById('startOver')

let grpModelSelect = document.getElementById('grpModel')
let outputFormatSelect = document.getElementById('outputFormat')
let recordingDurationInput = document.querySelector('div.duration > input[type=range]')
let durationShow = document.getElementsByClassName('durationShow')[0]
let switchProcess = document.getElementById('progress')
let audioFadeOut = document.getElementById('audioFadeOut')
let durationSelect = document.querySelector('div.duration')
let recorderPlayer = document.getElementById('player')

outputFormatSelect.onchange = function (){
    let format = outputFormatSelect.options[outputFormatSelect.selectedIndex].value
    console.log('set output format:', format)
    switch (format) {
        case 'ogg':
            recordingDurationInput.value = 30
            break
        case 'bin':
            recordingDurationInput.value = 25
            break
        default:
            break
    }
    durationShow.textContent = recordingDurationInput.value
}

grpModelSelect.onchange = function (){
    let model = grpModelSelect.options[grpModelSelect.selectedIndex].value
    switch (model) {
        case 'ogg':
            outputFormatSelect.options.selectedIndex = 0
            outputFormatSelect.disabled = true
            recordingDurationInput.value = 30

            break
        case 'bin':
            outputFormatSelect.options.selectedIndex = 1
            outputFormatSelect.disabled = true
            // GRP对bin格式文件大小存在限制，最大不超过192KB，对应转换后的音频文件最长在12秒左右
            recordingDurationInput.value = 25
            break
        case 'custom':
            outputFormatSelect.options.selectedIndex = 0
            outputFormatSelect.disabled = false
            recordingDurationInput.value = 30
            break
        default:
            break
    }
    durationShow.textContent = recordingDurationInput.value
}

selectButton.onclick = function (){
    console.log('Trigger the real file upload button')
    uploadFileInput.click()
}
uploadFileInput.onchange = function (){
    fileOnChange(this.files[0])
}
startOverButton.onclick = function (){
     uploadFileInput.click()
}

/**
 * duration
 * @param e
 */
recordingDurationInput.onchange = function (e){
    durationShow.textContent = e.target.value
}

/**
 * 上传的文件发生改变
 */
function fileOnChange(file){
    if(file){
        console.log('upload file: ', file.name)
        // setWavesurfer(file)
        if (!/audio\/\w+/.test(file.type)) {
            // selectButton.disabled = false
            // selectButton.style.opacity = '1'
            startOverButton.disabled = false
            setTip({type: 'error', message: Recorder.ERROR_MESSAGE.ERROR_CODE_1006.message, showTip: true})
            return
        }
        fileSwitchButton.disabled = true

        uploadFile = file
        // 显示上传的文件名和文件duration设置
        fileIcon.style.display = 'none'
        fileUploadContent.style.display = 'none'
        fileUploadContent.style.padding = '0'
        fileConversion.style.display = 'block'
        fileName.innerText = file.name
        // consoleArea.style.display = 'block'
        setTip({showTip: false})

        grpModelSelect.disabled = false
        outputFormatSelect.disabled = grpModelSelect.value !== 'custom';
        recordingDurationInput.disabled = false
        audioFadeOut.disabled = false
        switchProcess.style.width = '0'

        durationSelect.style.display = 'block'
        recorderPlayer.style.display = 'none'
        fileSwitchButton.classList.remove('fileDownload')
        fileSwitchButton.innerText = 'Convert'
        fileSwitchButton.style.display = 'inline-block'
        fileSwitchButton.disabled = false
        let fileDownloadLink = document.getElementById('fileDownloadLink')
        fileDownloadLink && fileDownloadLink.remove()
    }else {
        setTip({type: 'error', message: 'Please upload the file first!', showTip: true})
    }
}

function formatFileSize(fileSize){
    if (fileSize < 1024) {
        return fileSize + ' B';
    } else if (fileSize < (1024*1024)) {
        let temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + ' KB';
    } else if (fileSize < (1024*1024*1024)) {
        let temp = fileSize / (1024*1024);
        temp = temp.toFixed(2);
        return temp + ' MB';
    } else {
        let temp = fileSize / (1024*1024*1024);
        temp = temp.toFixed(2);
        return temp + ' GB';
    }
}

/**
 * 建立一个可存取到该file的url
 * @param file
 * @returns {null}
 */
function getObjectURL(file) {
    var url = null;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
    if (window.createObjectURL != undefined) {   // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) {        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {  // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url;

}

/**
 * 加载并显示音频波形可视化组件
 * @param file
 */
function setWavesurfer(file){
    let wavesurfer = WaveSurfer.create({
        normalize: true,
        container: document.querySelector('#waveform'),
        plugins: [
            WaveSurfer.cursor.create({
                showTime: true,
                opacity: 1,
                customShowTimeStyle: {
                    'background-color': '#000',
                    color: '#fff',
                    padding: '2px',
                    'font-size': '10px'
                }
            })
        ]
    });

    // 设置文件路径，显示wave波形
    wavesurfer.load(getObjectURL(file));

    document.getElementById('btnPlay').addEventListener('click', function () {
        wavesurfer.play(); // 播放的开始时间和结束时间
    });
    document.getElementById('btnPause').addEventListener('click', function () {
        wavesurfer.pause();
    });
}

/**
 * 文件转换
 */
fileSwitchButton.onclick = function (){
    if(fileSwitchButton.classList.contains('fileDownload')){
        // 下载
        let fileDownloadLink = document.getElementById('fileDownloadLink')
        fileDownloadLink.click()
    }else {
        setTip({showTip: false})
        // 隐藏文件上传区域
        fileUploadContent.style.display = 'none'
        startOverButton.style.display = 'none'
        selectButton.disabled = true
        selectButton.style.opacity = '0.6'

        // fileSwitchButton.style.opacity = '0.6'
        fileSwitchButton.disabled = true
        grpModelSelect.disabled = true
        recordingDurationInput.disabled = true
        audioFadeOut.disabled = true
        outputFormatSelect.disabled = true

        // 转换
        let duration = recordingDurationInput.value
        consoleLogPrint('start file conversion ==> ' + uploadFile.name)
        console.log('start file conversion: ', uploadFile.name)
        consoleLogPrint('recorder duration ' + duration)
        console.log('audio fade out enabled ', audioFadeOut.checked)
        consoleLogPrint('audio fade out enabled ' + audioFadeOut.checked)
        let outputFormat = outputFormatSelect.options[outputFormatSelect.selectedIndex].value
        console.log('outputFormat:', outputFormat)

        window.onsetDetection = new AudioOnsetDetection()
        onsetDetection.init()
        onsetDetection.on('onVibrationDataCompleted', function (){
            processGraphicDisplay()
        })

        // console.warn('上传的文件:', uploadFile)
        audioEncoder({
            file: uploadFile,
            duration: duration,   // 文件录制时长
            encoderType: outputFormat,
            audioFadeOut: audioFadeOut.checked,

            /**
             * 进度处理
             * @param data
             */
            progressCallback: function (data){
                if(data.state === 'recording'){
                    switchProcess.style.width = Math.round(data.percent * 100) + '%'
                }else if(data.state === 'done'){
                    switchProcess.style.width = '100%'
                    console.log('recorder complete!')
                    if(data.fileExceedsLimit){
                        console.log('Due to file size limitations, the conversion time did not reach the recording duration.')
                        consoleLogPrint('Due to file size limitations, the conversion time did not reach the recording duration.')
                    }
                    consoleLogPrint('Recorder complete!')
                }
            },
            /**
             * 转换完成后的处理，mediaRecorder.ondataavailable 返回
             * @param file
             * @param tagsInfo 振动时间段：铃声文件上传接口（POST /cgi-bin/ringtone）会增加一个查询参数 tags，值为JSON数组 （["VIBRATION=0.0-1.1;"]，需要用 encodeURIComponent 编码。以秒为单位，保留两位小数
             * @param blob
             */
            doneCallBack:function (file, tagsInfo, blob){
                console.log('tagsInfo:', tagsInfo)
                durationSelect.style.display = 'none'
                fileSwitchButton.classList.add('fileDownload')
                fileSwitchButton.innerText = 'Download'
                fileSwitchButton.style.opacity = 'inline-block'
                fileSwitchButton.disabled = false
                selectButton.disabled = false
                selectButton.style.opacity = '1'
                startOverButton.style.display = 'inline-block'

                setTip({type: 'complete', showTip: true})
                consoleLogPrint('recorder ondataavailable received!')

                let dataBlob = new Blob([blob], {type: `audio/${outputFormat}`});
                let url = URL.createObjectURL(dataBlob)
                setWavesurfer(file)

                if(outputFormat !== 'bin'){  // gsbin 格式无法在线播放
                    let audioPlayer = document.querySelector("#player > audio")
                    audioPlayer.src = url;
                    recorderPlayer.style.display = 'block'

                    /*******************************************音频可视化处理******************************************/
                    // 方案一：
                    // let parentEle = document.getElementById('vibrationElement')
                    // let averageScore = window.averageVolume * 50
                    // parentEle.style.height = averageScore + 'px'
                    // for(let i = 0; i<maxVolumeBuffer.length; i++){
                    //     let buffer = maxVolumeBuffer[i] * 50   // 放大，否则高度太小，不利于观察
                    //     let newEle = document.createElement('div')
                    //     newEle.style.height = (buffer) + 'px'
                    //     newEle.className = 'line'
                    //
                    //     if(buffer>=averageScore){
                    //         // console.log('振动...')
                    //         newEle.style.backgroundColor = 'red'
                    //     }
                    //     parentEle.appendChild(newEle)
                    // }

                    processGraphicDisplay(true)
                }

                // 生成下载链接
                console.warn('file size:', formatFileSize(file.size))
                let downLoadLink = document.createElement('a')
                downLoadLink.id = 'fileDownloadLink'
                downLoadLink.href = url;
                downLoadLink.download = file.name;
                downLoadLink.style.display = 'none'
                downLoadLink.innerHTML = '<br>' + '[' + new Date().toLocaleString() + '] '+ file.name
                recorderPlayer.appendChild(downLoadLink)
                consoleLogPrint('download link generated!')
            },
            /**
             * 错误处理
             * @param error
             */
            errorCallBack: function (error){
                console.error(error.message)
                consoleLogPrint('【Error】' + error.message, 'red')

                selectButton.disabled = false
                selectButton.style.opacity = '1'
                fileSwitchButton.disabled = true
                startOverButton.style.display = 'inline-block'
                setTip({type: 'error', message: error.message, showTip: true})
            }
        })
    }
}

function processGraphicDisplay(average){
    let createDiv = function (chunks, parentId, childClass, color){
        let parentEle = document.getElementById(parentId)

        let width = (800 / chunks.length).toFixed(2)
        for(let i = 0; i<chunks.length; i++){
            let buffer = chunks[i]
            let newEle = document.createElement('div')
            newEle.className = childClass
            newEle.style.width = width + 'px'

            if(buffer){
                let height = Number(buffer * 50) + 5   // 放大，否则高度太小，不利于观察
                newEle.style.height = height + 'px'
                newEle.style.backgroundColor = color

            }else {
                newEle.style.height = '0.1px'
                newEle.style.backgroundColor = '#abb3bf'
            }
            parentEle.appendChild(newEle)
        }
    }

    if(average){
        if(window.maxVolumeBuffer){
            createDiv(window.maxVolumeBuffer, 'maxVolume', 'maxVolume', '#2d72d2')
        }
    }else {
        if(window.onsetDetection){
            // 方案二：
            // 光谱通量
            if(onsetDetection.spectralFlux){
                createDiv(onsetDetection.spectralFlux, 'spectralFlux', 'spectralFlux', 'orange')
            }
            // 修剪后的光谱通量峰值数据
            if(onsetDetection.prunnedSpectralFlux){
                createDiv(onsetDetection.prunnedSpectralFlux, 'prunnedSpectralFlux', 'prunnedSpectralFlux', 'blue')
            }
            // 光谱通量平均值
            if(onsetDetection.threshold){
                createDiv(onsetDetection.threshold, 'threshold', 'threshold', 'green')
            }
        }else {
            console.error('window.onsetDetection is not found!')
        }
    }
}

function setTip(data){
    if(data.showTip){
        if(data.type === 'complete'){
            tipIcon.classList.remove('tip-icon-close')
            tipIcon.classList.add('tip-icon-complete')
            tipText.innerText = 'Conversion complete.'  // 转换完成
        }else {
            tipIcon.classList.remove('tip-icon-complete')
            tipIcon.classList.add('tip-icon-close')

            if(data.message){
                tipText.innerText = data.message
            }else {
                tipText.innerText = 'Conversion failed, please try again.'
            }
        }
        tip.style.opacity = '1'
    }else {
        tip.style.opacity = '0'
    }
}

/************************************************文件拖拽上传******************************************************/
fileUploadContent.addEventListener("drop",function(e){
    this.style.borderColor = '#288ef6';
    console.warn('dataTransfer file: ', e.dataTransfer.files[0])
    fileOnChange(e.dataTransfer.files[0])
})

/**
 * 文件拖来拖去并进入区域时，设置边框颜色
 * @param event
 */
fileUploadContent.ondragover = function (event) {
    event.preventDefault();
    // for firefox
    event.stopPropagation();
    this.style.borderColor = '#00bcd4';
}

/**
 * 文件拖离时恢复边框颜色
 */
fileUploadContent.ondragleave = function () {
    this.style.borderColor = '#288ef6';
}
document.addEventListener("drop",function(e){ // 拖离
    e.preventDefault();
})
document.addEventListener("dragleave",function(e){ // 拖后放
    e.preventDefault();
})
document.addEventListener("dragenter",function(e){ // 拖进
    e.preventDefault();
})
document.addEventListener("dragover",function(e){ // 拖来拖去
    e.preventDefault();
})

/**
 * 添加水印效果
 * @param watermarkConfig
 */
function watermark(watermarkConfig) {
    //默认设置
    let defaultSettings = Object.assign({
        watermark_txt: "GRANDSTREAM",
        watermark_x: 20, //水印起始位置x轴坐标
        watermark_y: 20, //水印起始位置Y轴坐标
        watermark_rows: 1, //水印行数
        watermark_cols: 1, //水印列数
        watermark_x_space: 100, //水印x轴间隔
        watermark_y_space: 50, //水印y轴间隔
        watermark_color: '#ddd', //水印字体颜色
        watermark_alpha: 0.4, //水印透明度
        watermark_fontsize: '125px', //水印字体大小
        watermark_font: 'BankGothicMdBTMedium', //水印字体
        watermark_letter_spacing: '-17px',   // 间距
        watermark_width: '100%', //水印宽度
        watermark_height: 350, //水印长度
        watermark_angle: 20, //水印倾斜度数
    }, watermarkConfig)

    let oTemp = document.createDocumentFragment();
    //获取页面最大宽度
    let page_width = Math.max(document.body.scrollWidth, document.body.clientWidth, window.screen.availWidth);
    let cutWidth = page_width * 0.0150;
    page_width = page_width - cutWidth;
    //获取页面最大高度
    let page_height = Math.max(document.body.scrollHeight, document.body.clientHeight) + 450;
    page_height = Math.max(page_height, window.innerHeight - 30);

    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (defaultSettings.watermark_cols === 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
        defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
        defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (defaultSettings.watermark_rows === 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
        defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
        defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
    }

    let x;
    let y;
    for (let i = 0; i < defaultSettings.watermark_rows; i++) {  // 水印行数
        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
        for (let j = 0; j < defaultSettings.watermark_cols; j++) {  // 水印列数
            x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
            let mask_div = document.createElement('div');
            mask_div.id = 'mask_div' + i + j;
            mask_div.className = 'mask_div';
            mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
            //设置水印div倾斜显示
            // mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            // mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            // mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            // mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            // mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.visibility = "";
            mask_div.style.position = "absolute";
            // mask_div.style.left = x + 'px';
            // mask_div.style.top = y + 'px';
            mask_div.style.overflow = "hidden";
            mask_div.style.zIndex = "-1";
            //让水印不遮挡页面的点击事件
            mask_div.style.pointerEvents = 'none';
            mask_div.style.opacity = defaultSettings.watermark_alpha;
            mask_div.style.fontSize = defaultSettings.watermark_fontsize;
            mask_div.style.fontFamily = defaultSettings.watermark_font;
            mask_div.style.letterSpacing = defaultSettings.watermark_letter_spacing;
            mask_div.style.color = defaultSettings.watermark_color;
            mask_div.style.textAlign = "center";
            mask_div.style.width = defaultSettings.watermark_width + 'px';
            mask_div.style.height = defaultSettings.watermark_height + 'px';
            mask_div.style.display = "block";

            // 居中设置
            mask_div.style.top = '0';
            mask_div.style.left = '0';
            mask_div.style.right = '0';
            mask_div.style.bottom = '0';
            mask_div.style.margin = 'auto';
            mask_div.style['line-height'] = defaultSettings.watermark_height + 'px';
            mask_div.style['text-align'] = 'center';
            // mask_div.style['text-shadow'] = 'rgb(255 255 255) 3px 5px 0px, rgb(165 165 165) 4px 6px 3px, rgb(173 173 173) 8px 11px 10px'
            oTemp.appendChild(mask_div);
        }
    }
    // document.body.appendChild(oTemp)
    fileUploadContent.appendChild(oTemp)
}

window.onload = function (){
    watermark({})
}

/************************************************日志打印******************************************************/
function consoleLogPrint(text, color) {
    if(!text){
        return
    }
    let p = document.createElement('p')
    p.innerText = text
    if(color){
        p.style.color = color
    }
    consoleLog.appendChild(p)
}

