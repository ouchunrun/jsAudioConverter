(()=>{let e,t=document.getElementsByClassName("tip")[0],a=document.getElementsByClassName("tip-icon")[0],o=document.getElementsByClassName("tip-text")[0],n=document.getElementById("fileUploadContent"),r=document.getElementById("fileConversion"),l=document.getElementsByClassName("fileIcon")[0],i=document.getElementsByClassName("fileName")[0],s=(document.getElementsByClassName("console")[0],document.getElementById("consoleLog")),d=document.getElementById("uploadFile"),c=document.getElementById("selectButton"),m=document.getElementById("fileSwitch"),u=document.getElementById("startOver"),p=document.getElementById("grpModel"),y=document.getElementById("outputFormat"),w=document.querySelector("div.duration > input[type=range]"),k=document.getElementsByClassName("durationShow")[0],g=document.getElementById("progress"),_=document.getElementById("audioFadeOut"),f=document.querySelector("div.duration"),h=document.getElementById("player");function b(t){if(t){if(console.log("upload file: ",t.name),!/audio\/\w+/.test(t.type))return u.disabled=!1,void v({type:"error",message:Recorder.ERROR_MESSAGE.ERROR_CODE_1006.message,showTip:!0});m.disabled=!0,e=t,l.style.display="none",n.style.display="none",n.style.padding="0",r.style.display="block",i.innerText=t.name,v({showTip:!1}),p.disabled=!1,y.disabled="custom"!==p.value,w.disabled=!1,_.disabled=!1,g.style.width="0",f.style.display="block",h.style.display="none",m.classList.remove("fileDownload"),m.innerText="Convert",m.style.display="inline-block",m.disabled=!1;let a=document.getElementById("fileDownloadLink");a&&a.remove()}else v({type:"error",message:"Please upload the file first!",showTip:!0})}function v(e){e.showTip?("complete"===e.type?(a.classList.remove("tip-icon-close"),a.classList.add("tip-icon-complete"),o.innerText="Conversion complete."):(a.classList.remove("tip-icon-complete"),a.classList.add("tip-icon-close"),e.message?o.innerText=e.message:o.innerText="Conversion failed, please try again."),t.style.opacity="1"):t.style.opacity="0"}function x(e,t){if(!e)return;let a=document.createElement("p");a.innerText=e,t&&(a.style.color=t),s.appendChild(a)}y.onchange=function(){let e=y.options[y.selectedIndex].value;switch(console.log("set output format:",e),e){case"ogg":w.value=30;break;case"bin":w.value=25}k.textContent=w.value},p.onchange=function(){switch(p.options[p.selectedIndex].value){case"ogg":y.options.selectedIndex=0,y.disabled=!0,w.value=30;break;case"bin":y.options.selectedIndex=1,y.disabled=!0,w.value=25;break;case"custom":y.options.selectedIndex=0,y.disabled=!1,w.value=30}k.textContent=w.value},c.onclick=function(){console.log("Trigger the real file upload button"),d.click()},d.onchange=function(){b(this.files[0])},u.onclick=function(){d.click()},w.onchange=function(e){k.textContent=e.target.value},m.onclick=function(){if(m.classList.contains("fileDownload"))document.getElementById("fileDownloadLink").click();else{v({showTip:!1}),n.style.display="none",u.style.display="none",c.disabled=!0,c.style.opacity="0.6",m.disabled=!0,p.disabled=!0,w.disabled=!0,_.disabled=!0,y.disabled=!0;let t=w.value;x("start file conversion ==> "+e.name),console.log("start file conversion: ",e.name),x("recorder duration "+t),console.log("audio fade out enabled ",_.checked),x("audio fade out enabled "+_.checked);let a=y.options[y.selectedIndex].value;console.log("outputFormat:",a),audioEncoder({file:e,duration:t,encoderType:a,audioFadeOut:_.checked,progressCallback:function(e){"recording"===e.state?g.style.width=Math.round(100*e.percent)+"%":"done"===e.state&&(g.style.width="100%",console.log("recorder complete!"),e.fileExceedsLimit&&(console.log("Due to file size limitations, the conversion time did not reach the recording duration."),x("Due to file size limitations, the conversion time did not reach the recording duration.")),x("Recorder complete!"))},doneCallBack:function(e,t){f.style.display="none",m.classList.add("fileDownload"),m.innerText="Download",m.style.opacity="inline-block",m.disabled=!1,c.disabled=!1,c.style.opacity="1",u.style.display="inline-block",v({type:"complete",showTip:!0}),x("recorder ondataavailable received!");let o=new Blob([t],{type:`audio/${a}`}),n=URL.createObjectURL(o);"bin"!==a&&(document.querySelector("#player > audio").src=n,h.style.display="block"),console.warn("file size:",function(e){if(e<1024)return e+" B";if(e<1048576){let t=e/1024;return t=t.toFixed(2),t+" KB"}if(e<1073741824){let t=e/1048576;return t=t.toFixed(2),t+" MB"}{let t=e/1073741824;return t=t.toFixed(2),t+" GB"}}(e.size));let r=document.createElement("a");r.id="fileDownloadLink",r.href=n,r.download=e.name,r.style.display="none",r.innerHTML="<br>["+(new Date).toLocaleString()+"] "+e.name,h.appendChild(r),x("download link generated!")},errorCallBack:function(e){console.error(e.message),x("【Error】"+e.message,"red"),c.disabled=!1,c.style.opacity="1",m.disabled=!0,u.style.display="inline-block",v({type:"error",message:e.message,showTip:!0})}})}},n.addEventListener("drop",(function(e){this.style.borderColor="#288ef6",console.warn("dataTransfer file: ",e.dataTransfer.files[0]),b(e.dataTransfer.files[0])})),n.ondragover=function(e){e.preventDefault(),e.stopPropagation(),this.style.borderColor="#00bcd4"},n.ondragleave=function(){this.style.borderColor="#288ef6"},document.addEventListener("drop",(function(e){e.preventDefault()})),document.addEventListener("dragleave",(function(e){e.preventDefault()})),document.addEventListener("dragenter",(function(e){e.preventDefault()})),document.addEventListener("dragover",(function(e){e.preventDefault()})),window.onload=function(){!function(e){let t=Object.assign({watermark_txt:"GRANDSTREAM",watermark_x:20,watermark_y:20,watermark_rows:1,watermark_cols:1,watermark_x_space:100,watermark_y_space:50,watermark_color:"#ddd",watermark_alpha:.4,watermark_fontsize:"125px",watermark_font:"BankGothicMdBTMedium",watermark_letter_spacing:"-17px",watermark_width:"100%",watermark_height:350,watermark_angle:20},{}),a=document.createDocumentFragment(),o=Math.max(document.body.scrollWidth,document.body.clientWidth,window.screen.availWidth);o-=.015*o;let r,l,i=Math.max(document.body.scrollHeight,document.body.clientHeight)+450;i=Math.max(i,window.innerHeight-30),(0===t.watermark_cols||parseInt(t.watermark_x+t.watermark_width*t.watermark_cols+t.watermark_x_space*(t.watermark_cols-1))>o)&&(t.watermark_cols=parseInt((o-t.watermark_x+t.watermark_x_space)/(t.watermark_width+t.watermark_x_space)),t.watermark_x_space=parseInt((o-t.watermark_x-t.watermark_width*t.watermark_cols)/(t.watermark_cols-1))),(0===t.watermark_rows||parseInt(t.watermark_y+t.watermark_height*t.watermark_rows+t.watermark_y_space*(t.watermark_rows-1))>i)&&(t.watermark_rows=parseInt((t.watermark_y_space+i-t.watermark_y)/(t.watermark_height+t.watermark_y_space)),t.watermark_y_space=parseInt((i-t.watermark_y-t.watermark_height*t.watermark_rows)/(t.watermark_rows-1)));for(let e=0;e<t.watermark_rows;e++){l=t.watermark_y+(t.watermark_y_space+t.watermark_height)*e;for(let o=0;o<t.watermark_cols;o++){r=t.watermark_x+(t.watermark_width+t.watermark_x_space)*o;let n=document.createElement("div");n.id="mask_div"+e+o,n.className="mask_div",n.appendChild(document.createTextNode(t.watermark_txt)),n.style.visibility="",n.style.position="absolute",n.style.overflow="hidden",n.style.zIndex="-1",n.style.pointerEvents="none",n.style.opacity=t.watermark_alpha,n.style.fontSize=t.watermark_fontsize,n.style.fontFamily=t.watermark_font,n.style.letterSpacing=t.watermark_letter_spacing,n.style.color=t.watermark_color,n.style.textAlign="center",n.style.width=t.watermark_width+"px",n.style.height=t.watermark_height+"px",n.style.display="block",n.style.top="0",n.style.left="0",n.style.right="0",n.style.bottom="0",n.style.margin="auto",n.style["line-height"]=t.watermark_height+"px",n.style["text-align"]="center",a.appendChild(n)}}n.appendChild(a)}()}})();