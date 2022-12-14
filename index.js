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
            // GRP???bin????????????????????????????????????????????????192KB??????????????????????????????????????????12?????????
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
 * ???????????????????????????
 */
function fileOnChange(file){
    if(file){
        console.log('upload file: ', file.name)
        if (!/audio\/\w+/.test(file.type)) {
            // selectButton.disabled = false
            // selectButton.style.opacity = '1'
            startOverButton.disabled = false
            setTip({type: 'error', message: Recorder.ERROR_MESSAGE.ERROR_CODE_1006.message, showTip: true})
            return
        }
        fileSwitchButton.disabled = true

        uploadFile = file
        // ?????????????????????????????????duration??????
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
 * ????????????
 */
fileSwitchButton.onclick = function (){
    if(fileSwitchButton.classList.contains('fileDownload')){
        // ??????
        let fileDownloadLink = document.getElementById('fileDownloadLink')
        fileDownloadLink.click()
    }else {
        setTip({showTip: false})
        // ????????????????????????
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

        // ??????
        let duration = recordingDurationInput.value
        consoleLogPrint('start file conversion ==> ' + uploadFile.name)
        console.log('start file conversion: ', uploadFile.name)
        consoleLogPrint('recorder duration ' + duration)
        console.log('audio fade out enabled ', audioFadeOut.checked)
        consoleLogPrint('audio fade out enabled ' + audioFadeOut.checked)
        let outputFormat = outputFormatSelect.options[outputFormatSelect.selectedIndex].value
        console.log('outputFormat:', outputFormat)

        audioEncoder({
            file: uploadFile,
            duration: duration,   // ??????????????????
            encoderType: outputFormat,
            audioFadeOut: audioFadeOut.checked,

            /**
             * ????????????
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
             * ???????????????????????????mediaRecorder.ondataavailable ??????
             * @param file
             * @param blob
             */
            doneCallBack:function (file, blob){
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
                if(outputFormat !== 'bin'){  // gsbin ????????????????????????
                    let audioPlayer = document.querySelector("#player > audio")
                    audioPlayer.src = url;
                    recorderPlayer.style.display = 'block'
                }

                // ??????????????????
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
             * ????????????
             * @param error
             */
            errorCallBack: function (error){
                console.error(error.message)
                consoleLogPrint('???Error???' + error.message, 'red')

                selectButton.disabled = false
                selectButton.style.opacity = '1'
                fileSwitchButton.disabled = true
                startOverButton.style.display = 'inline-block'
                setTip({type: 'error', message: error.message, showTip: true})
            }
        })
    }
}

function setTip(data){
    if(data.showTip){
        if(data.type === 'complete'){
            tipIcon.classList.remove('tip-icon-close')
            tipIcon.classList.add('tip-icon-complete')
            tipText.innerText = 'Conversion complete.'  // ????????????
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

/************************************************??????????????????******************************************************/
fileUploadContent.addEventListener("drop",function(e){
    this.style.borderColor = '#288ef6';
    console.warn('dataTransfer file: ', e.dataTransfer.files[0])
    fileOnChange(e.dataTransfer.files[0])
})

/**
 * ?????????????????????????????????????????????????????????
 * @param event
 */
fileUploadContent.ondragover = function (event) {
    event.preventDefault();
    // for firefox
    event.stopPropagation();
    this.style.borderColor = '#00bcd4';
}

/**
 * ?????????????????????????????????
 */
fileUploadContent.ondragleave = function () {
    this.style.borderColor = '#288ef6';
}
document.addEventListener("drop",function(e){ // ??????
    e.preventDefault();
})
document.addEventListener("dragleave",function(e){ // ?????????
    e.preventDefault();
})
document.addEventListener("dragenter",function(e){ // ??????
    e.preventDefault();
})
document.addEventListener("dragover",function(e){ // ????????????
    e.preventDefault();
})

/**
 * ??????????????????
 * @param watermarkConfig
 */
function watermark(watermarkConfig) {
    //????????????
    let defaultSettings = Object.assign({
        watermark_txt: "GRANDSTREAM",
        watermark_x: 20, //??????????????????x?????????
        watermark_y: 20, //??????????????????Y?????????
        watermark_rows: 1, //????????????
        watermark_cols: 1, //????????????
        watermark_x_space: 100, //??????x?????????
        watermark_y_space: 50, //??????y?????????
        watermark_color: '#ddd', //??????????????????
        watermark_alpha: 0.4, //???????????????
        watermark_fontsize: '125px', //??????????????????
        watermark_font: 'BankGothicMdBTMedium', //????????????
        watermark_letter_spacing: '-17px',   // ??????
        watermark_width: '100%', //????????????
        watermark_height: 350, //????????????
        watermark_angle: 20, //??????????????????
    }, watermarkConfig)

    let oTemp = document.createDocumentFragment();
    //????????????????????????
    let page_width = Math.max(document.body.scrollWidth, document.body.clientWidth, window.screen.availWidth);
    let cutWidth = page_width * 0.0150;
    page_width = page_width - cutWidth;
    //????????????????????????
    let page_height = Math.max(document.body.scrollHeight, document.body.clientHeight) + 450;
    page_height = Math.max(page_height, window.innerHeight - 30);

    //??????????????????????????????0????????????????????????????????????????????????????????????????????????????????????????????????x?????????
    if (defaultSettings.watermark_cols === 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
        defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
        defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
    }
    //??????????????????????????????0????????????????????????????????????????????????????????????????????????????????????????????????y?????????
    if (defaultSettings.watermark_rows === 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
        defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
        defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
    }

    let x;
    let y;
    for (let i = 0; i < defaultSettings.watermark_rows; i++) {  // ????????????
        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
        for (let j = 0; j < defaultSettings.watermark_cols; j++) {  // ????????????
            x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
            let mask_div = document.createElement('div');
            mask_div.id = 'mask_div' + i + j;
            mask_div.className = 'mask_div';
            mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
            //????????????div????????????
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
            //???????????????????????????????????????
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

            // ????????????
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

/************************************************????????????******************************************************/
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

