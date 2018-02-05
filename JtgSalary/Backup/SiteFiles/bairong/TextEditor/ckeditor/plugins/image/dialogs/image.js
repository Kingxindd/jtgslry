﻿
(function()
{var IMAGE=1,LINK=2,PREVIEW=4,CLEANUP=8,regexGetSize=/^\s*(\d+)((px)|\%)?\s*$/i,regexGetSizeOrEmpty=/(^\s*(\d+)((px)|\%)?\s*$)|^$/i,pxLengthRegex=/^\d+px$/;var onSizeChange=function()
{var value=this.getValue(),dialog=this.getDialog(),aMatch=value.match(regexGetSize);if(aMatch)
{if(aMatch[2]=='%')
switchLockRatio(dialog,false);value=aMatch[1];}
if(dialog.lockRatio)
{var oImageOriginal=dialog.originalElement;if(oImageOriginal.getCustomData('isReady')=='true')
{if(this.id=='txtHeight')
{if(value&&value!='0')
value=Math.round(oImageOriginal.$.width*(value/oImageOriginal.$.height));if(!isNaN(value))
dialog.setValueOf('info','txtWidth',value);}
else
{if(value&&value!='0')
value=Math.round(oImageOriginal.$.height*(value/oImageOriginal.$.width));if(!isNaN(value))
dialog.setValueOf('info','txtHeight',value);}}}
updatePreview(dialog);};var updatePreview=function(dialog)
{if(!dialog.originalElement||!dialog.preview)
return 1;dialog.commitContent(PREVIEW,dialog.preview);return 0;};function commitContent()
{var args=arguments;var inlineStyleField=this.getContentElement('advanced','txtdlgGenStyle');inlineStyleField&&inlineStyleField.commit.apply(inlineStyleField,args);this.foreach(function(widget)
{if(widget.commit&&widget.id!='txtdlgGenStyle')
widget.commit.apply(widget,args);});}
var incommit;function commitInternally(targetFields)
{if(incommit)
return;incommit=1;var dialog=this.getDialog(),element=dialog.imageElement;if(element)
{this.commit(IMAGE,element);targetFields=[].concat(targetFields);var length=targetFields.length,field;for(var i=0;i<length;i++)
{field=dialog.getContentElement.apply(dialog,targetFields[i].split(':'));field&&field.setup(IMAGE,element);}}
incommit=0;}
var switchLockRatio=function(dialog,value)
{var oImageOriginal=dialog.originalElement,ratioButton=CKEDITOR.document.getById('btnLockSizes');if(oImageOriginal.getCustomData('isReady')=='true')
{if(value=='check')
{var width=dialog.getValueOf('info','txtWidth'),height=dialog.getValueOf('info','txtHeight'),originalRatio=oImageOriginal.$.width*1000/oImageOriginal.$.height,thisRatio=width*1000/height;dialog.lockRatio=false;if(!width&&!height)
dialog.lockRatio=true;else if(!isNaN(originalRatio)&&!isNaN(thisRatio))
{if(Math.round(originalRatio)==Math.round(thisRatio))
dialog.lockRatio=true;}}
else if(value!=undefined)
dialog.lockRatio=value;else
dialog.lockRatio=!dialog.lockRatio;}
else if(value!='check')
dialog.lockRatio=false;if(dialog.lockRatio)
ratioButton.removeClass('cke_btn_unlocked');else
ratioButton.addClass('cke_btn_unlocked');var lang=dialog._.editor.lang.image,label=lang[dialog.lockRatio?'unlockRatio':'lockRatio'];ratioButton.setAttribute('title',label);ratioButton.getFirst().setText(label);return dialog.lockRatio;};var resetSize=function(dialog)
{var oImageOriginal=dialog.originalElement;if(oImageOriginal.getCustomData('isReady')=='true')
{dialog.setValueOf('info','txtWidth',oImageOriginal.$.width);dialog.setValueOf('info','txtHeight',oImageOriginal.$.height);}
updatePreview(dialog);};var setupDimension=function(type,element)
{if(type!=IMAGE)
return;function checkDimension(size,defaultValue)
{var aMatch=size.match(regexGetSize);if(aMatch)
{if(aMatch[2]=='%')
{aMatch[1]+='%';switchLockRatio(dialog,false);}
return aMatch[1];}
return defaultValue;}
var dialog=this.getDialog(),value='',dimension=((this.id=='txtWidth')?'width':'height'),size=element.getAttribute(dimension);if(size)
value=checkDimension(size,value);value=checkDimension(element.getStyle(dimension),value);this.setValue(value);};var imageDialog=function(editor,dialogType)
{var previewPreloader;var onImgLoadEvent=function()
{var original=this.originalElement;original.setCustomData('isReady','true');original.removeListener('load',onImgLoadEvent);original.removeListener('error',onImgLoadErrorEvent);original.removeListener('abort',onImgLoadErrorEvent);CKEDITOR.document.getById('ImagePreviewLoader').setStyle('display','none');if(!this.dontResetSize)
resetSize(this);if(this.firstLoad)
CKEDITOR.tools.setTimeout(function(){switchLockRatio(this,'check');},0,this);this.firstLoad=false;this.dontResetSize=false;};var onImgLoadErrorEvent=function()
{var original=this.originalElement;original.removeListener('load',onImgLoadEvent);original.removeListener('error',onImgLoadErrorEvent);original.removeListener('abort',onImgLoadErrorEvent);var noimage=CKEDITOR.getUrl(editor.skinPath+'images/noimage.png');if(this.preview)
this.preview.setAttribute('src',noimage);CKEDITOR.document.getById('ImagePreviewLoader').setStyle('display','none');switchLockRatio(this,false);};return{title:(dialogType=='image')?editor.lang.image.title:editor.lang.image.titleButton,minWidth:420,minHeight:310,onShow:function()
{this.imageElement=false;this.linkElement=false;this.imageEditMode=false;this.linkEditMode=false;this.lockRatio=true;this.dontResetSize=false;this.firstLoad=true;this.addLink=false;var editor=this.getParentEditor(),sel=this.getParentEditor().getSelection(),element=sel.getSelectedElement(),link=element&&element.getAscendant('a');CKEDITOR.document.getById('ImagePreviewLoader').setStyle('display','none');previewPreloader=new CKEDITOR.dom.element('img',editor.document);this.preview=CKEDITOR.document.getById('previewImage');this.originalElement=editor.document.createElement('img');this.originalElement.setAttribute('alt','');this.originalElement.setCustomData('isReady','false');if(link)
{this.linkElement=link;this.linkEditMode=true;var linkChildren=link.getChildren();if(linkChildren.count()==1)
{var childTagName=linkChildren.getItem(0).getName();if(childTagName=='img'||childTagName=='input')
{this.imageElement=linkChildren.getItem(0);if(this.imageElement.getName()=='img')
this.imageEditMode='img';else if(this.imageElement.getName()=='input')
this.imageEditMode='input';}}
if(dialogType=='image')
this.setupContent(LINK,link);}
if(element&&element.getName()=='img'&&!element.getAttribute('_cke_realelement')||element&&element.getName()=='input'&&element.getAttribute('type')=='image')
{this.imageEditMode=element.getName();this.imageElement=element;}
if(this.imageEditMode)
{this.cleanImageElement=this.imageElement;this.imageElement=this.cleanImageElement.clone(true,true);this.setupContent(IMAGE,this.imageElement);switchLockRatio(this,true);}
else
this.imageElement=editor.document.createElement('img');if(!CKEDITOR.tools.trim(this.getValueOf('info','txtUrl')))
{this.preview.removeAttribute('src');this.preview.setStyle('display','none');}},onOk:function()
{if(this.imageEditMode)
{var imgTagName=this.imageEditMode;if(dialogType=='image'&&imgTagName=='input'&&confirm(editor.lang.image.button2Img))
{imgTagName='img';this.imageElement=editor.document.createElement('img');this.imageElement.setAttribute('alt','');editor.insertElement(this.imageElement);}
else if(dialogType!='image'&&imgTagName=='img'&&confirm(editor.lang.image.img2Button))
{imgTagName='input';this.imageElement=editor.document.createElement('input');this.imageElement.setAttributes({type:'image',alt:''});editor.insertElement(this.imageElement);}
else
{this.imageElement=this.cleanImageElement;delete this.cleanImageElement;}}
else
{if(dialogType=='image')
this.imageElement=editor.document.createElement('img');else
{this.imageElement=editor.document.createElement('input');this.imageElement.setAttribute('type','image');}
this.imageElement.setAttribute('alt','');}
if(!this.linkEditMode)
this.linkElement=editor.document.createElement('a');this.commitContent(IMAGE,this.imageElement);this.commitContent(LINK,this.linkElement);if(!this.imageElement.getAttribute('style'))
this.imageElement.removeAttribute('style');if(!this.imageEditMode)
{if(this.addLink)
{if(!this.linkEditMode)
{editor.insertElement(this.linkElement);this.linkElement.append(this.imageElement,false);}
else
editor.insertElement(this.imageElement);}
else
editor.insertElement(this.imageElement);}
else
{if(!this.linkEditMode&&this.addLink)
{editor.insertElement(this.linkElement);this.imageElement.appendTo(this.linkElement);}
else if(this.linkEditMode&&!this.addLink)
{editor.getSelection().selectElement(this.linkElement);editor.insertElement(this.imageElement);}}},onLoad:function()
{if(dialogType!='image')
this.hidePage('Link');var doc=this._.element.getDocument();this.addFocusable(doc.getById('btnResetSize'),5);this.addFocusable(doc.getById('btnLockSizes'),5);this.commitContent=commitContent;},onHide:function()
{if(this.preview)
this.commitContent(CLEANUP,this.preview);if(this.originalElement)
{this.originalElement.removeListener('load',onImgLoadEvent);this.originalElement.removeListener('error',onImgLoadErrorEvent);this.originalElement.removeListener('abort',onImgLoadErrorEvent);this.originalElement.remove();this.originalElement=false;}
delete this.imageElement;},contents:[{id:'Upload',hidden:true,filebrowser:'uploadButton',label:editor.lang.image.upload,elements:[{type:'file',id:'upload',label:editor.lang.image.btnUpload,style:'height:40px',size:38},{type:'fileButton',id:'uploadButton',filebrowser:'info:txtUrl',label:editor.lang.image.btnUpload,'for':['Upload','upload']}]},{id:'info',label:editor.lang.image.infoTab,accessKey:'I',elements:[{type:'vbox',padding:0,children:[{type:'hbox',widths:['280px','110px'],align:'right',children:[{id:'txtUrl',type:'text',label:editor.lang.common.url,required:true,onChange:function()
{var dialog=this.getDialog(),newUrl=this.getValue();if(newUrl.length>0)
{dialog=this.getDialog();var original=dialog.originalElement;dialog.preview.removeStyle('display');original.setCustomData('isReady','false');var loader=CKEDITOR.document.getById('ImagePreviewLoader');if(loader)
loader.setStyle('display','');original.on('load',onImgLoadEvent,dialog);original.on('error',onImgLoadErrorEvent,dialog);original.on('abort',onImgLoadErrorEvent,dialog);original.setAttribute('src',newUrl);previewPreloader.setAttribute('src',newUrl);dialog.preview.setAttribute('src',previewPreloader.$.src);updatePreview(dialog);}
else if(dialog.preview)
{dialog.preview.removeAttribute('src');dialog.preview.setStyle('display','none');}},setup:function(type,element)
{if(type==IMAGE)
{var url=element.getAttribute('_cke_saved_src')||element.getAttribute('src');var field=this;this.getDialog().dontResetSize=true;field.setValue(url);field.setInitValue();field.focus();}},commit:function(type,element)
{if(type==IMAGE&&(this.getValue()||this.isChanged()))
{element.setAttribute('_cke_saved_src',decodeURI(this.getValue()));element.setAttribute('src',decodeURI(this.getValue()));}
else if(type==CLEANUP)
{element.setAttribute('src','');element.removeAttribute('src');}},validate:CKEDITOR.dialog.validate.notEmpty(editor.lang.image.urlMissing)},{type:'button',id:'browse',style:'display:inline-block;margin-top:10px;',align:'center',label:editor.lang.common.browseServer,hidden:true,filebrowser:'info:txtUrl'}]}]},{id:'txtAlt',type:'text',label:editor.lang.image.alt,accessKey:'A','default':'',onChange:function()
{updatePreview(this.getDialog());},setup:function(type,element)
{if(type==IMAGE)
this.setValue(element.getAttribute('alt'));},commit:function(type,element)
{if(type==IMAGE)
{if(this.getValue()||this.isChanged())
element.setAttribute('alt',this.getValue());}
else if(type==PREVIEW)
{element.setAttribute('alt',this.getValue());}
else if(type==CLEANUP)
{element.removeAttribute('alt');}}},{type:'hbox',widths:['140px','240px'],children:[{type:'vbox',padding:10,children:[{type:'hbox',widths:['70%','30%'],children:[{type:'vbox',padding:1,children:[{type:'text',width:'40px',id:'txtWidth',labelLayout:'horizontal',label:editor.lang.image.width,onKeyUp:onSizeChange,onChange:function()
{commitInternally.call(this,'advanced:txtdlgGenStyle');},validate:function()
{var aMatch=this.getValue().match(regexGetSizeOrEmpty);if(!aMatch)
alert(editor.lang.image.validateWidth);return!!aMatch;},setup:setupDimension,commit:function(type,element,internalCommit)
{var value=this.getValue();if(type==IMAGE)
{if(value)
element.setStyle('width',CKEDITOR.tools.cssLength(value));else if(!value&&this.isChanged())
element.removeStyle('width');!internalCommit&&element.removeAttribute('width');}
else if(type==PREVIEW)
{var aMatch=value.match(regexGetSize);if(!aMatch)
{var oImageOriginal=this.getDialog().originalElement;if(oImageOriginal.getCustomData('isReady')=='true')
element.setStyle('width',oImageOriginal.$.width+'px');}
else
element.setStyle('width',value+'px');}
else if(type==CLEANUP)
{element.removeAttribute('width');element.removeStyle('width');}}},{type:'text',id:'txtHeight',width:'40px',labelLayout:'horizontal',label:editor.lang.image.height,onKeyUp:onSizeChange,onChange:function()
{commitInternally.call(this,'advanced:txtdlgGenStyle');},validate:function()
{var aMatch=this.getValue().match(regexGetSizeOrEmpty);if(!aMatch)
alert(editor.lang.image.validateHeight);return!!aMatch;},setup:setupDimension,commit:function(type,element,internalCommit)
{var value=this.getValue();if(type==IMAGE)
{if(value)
element.setStyle('height',CKEDITOR.tools.cssLength(value));else if(!value&&this.isChanged())
element.removeStyle('height');if(!internalCommit&&type==IMAGE)
element.removeAttribute('height');}
else if(type==PREVIEW)
{var aMatch=value.match(regexGetSize);if(!aMatch)
{var oImageOriginal=this.getDialog().originalElement;if(oImageOriginal.getCustomData('isReady')=='true')
element.setStyle('height',oImageOriginal.$.height+'px');}
else
element.setStyle('height',value+'px');}
else if(type==CLEANUP)
{element.removeAttribute('height');element.removeStyle('height');}}}]},{type:'html',style:'margin-top:10px;width:40px;height:40px;',onLoad:function()
{var resetButton=CKEDITOR.document.getById('btnResetSize'),ratioButton=CKEDITOR.document.getById('btnLockSizes');if(resetButton)
{resetButton.on('click',function(evt)
{resetSize(this);evt.data.preventDefault();},this.getDialog());resetButton.on('mouseover',function()
{this.addClass('cke_btn_over');},resetButton);resetButton.on('mouseout',function()
{this.removeClass('cke_btn_over');},resetButton);}
if(ratioButton)
{ratioButton.on('click',function(evt)
{var locked=switchLockRatio(this),oImageOriginal=this.originalElement,width=this.getValueOf('info','txtWidth');if(oImageOriginal.getCustomData('isReady')=='true'&&width)
{var height=oImageOriginal.$.height/oImageOriginal.$.width*width;if(!isNaN(height))
{this.setValueOf('info','txtHeight',Math.round(height));updatePreview(this);}}
evt.data.preventDefault();},this.getDialog());ratioButton.on('mouseover',function()
{this.addClass('cke_btn_over');},ratioButton);ratioButton.on('mouseout',function()
{this.removeClass('cke_btn_over');},ratioButton);}},html:'<div>'+'<a href="javascript:void(0)" tabindex="-1" title="'+editor.lang.image.unlockRatio+'" class="cke_btn_locked" id="btnLockSizes" role="button"><span class="cke_label">'+editor.lang.image.unlockRatio+'</span></a>'+'<a href="javascript:void(0)" tabindex="-1" title="'+editor.lang.image.resetSize+'" class="cke_btn_reset" id="btnResetSize" role="button"><span class="cke_label">'+editor.lang.image.resetSize+'</span></a>'+'</div>'}]},{type:'vbox',padding:1,children:[{type:'text',id:'txtBorder',width:'60px',labelLayout:'horizontal',label:editor.lang.image.border,'default':'',onKeyUp:function()
{updatePreview(this.getDialog());},onChange:function()
{commitInternally.call(this,'advanced:txtdlgGenStyle');},validate:CKEDITOR.dialog.validate.integer(editor.lang.image.validateBorder),setup:function(type,element)
{if(type==IMAGE)
{var value,borderStyle=element.getStyle('border-width');borderStyle=borderStyle&&borderStyle.match(/^(\d+px)(?: \1 \1 \1)?$/);value=borderStyle&&parseInt(borderStyle[1],10);isNaN(parseInt(value,10))&&(value=element.getAttribute('border'));this.setValue(value);}},commit:function(type,element,internalCommit)
{var value=parseInt(this.getValue(),10);if(type==IMAGE||type==PREVIEW)
{if(!isNaN(value))
{element.setStyle('border-width',CKEDITOR.tools.cssLength(value));element.setStyle('border-style','solid');}
else if(!value&&this.isChanged())
{element.removeStyle('border-width');element.removeStyle('border-style');element.removeStyle('border-color');}
if(!internalCommit&&type==IMAGE)
element.removeAttribute('border');}
else if(type==CLEANUP)
{element.removeAttribute('border');element.removeStyle('border-width');element.removeStyle('border-style');element.removeStyle('border-color');}}},{type:'text',id:'txtHSpace',width:'60px',labelLayout:'horizontal',label:editor.lang.image.hSpace,'default':'',onKeyUp:function()
{updatePreview(this.getDialog());},onChange:function()
{commitInternally.call(this,'advanced:txtdlgGenStyle');},validate:CKEDITOR.dialog.validate.integer(editor.lang.image.validateHSpace),setup:function(type,element)
{if(type==IMAGE)
{var value,marginLeftPx,marginRightPx,marginLeftStyle=element.getStyle('margin-left'),marginRightStyle=element.getStyle('margin-right');marginLeftStyle=marginLeftStyle&&marginLeftStyle.match(pxLengthRegex);marginRightStyle=marginRightStyle&&marginRightStyle.match(pxLengthRegex);marginLeftPx=parseInt(marginLeftStyle,10);marginRightPx=parseInt(marginRightStyle,10);value=(marginLeftPx==marginRightPx)&&marginLeftPx;isNaN(parseInt(value,10))&&(value=element.getAttribute('hspace'));this.setValue(value);}},commit:function(type,element,internalCommit)
{var value=parseInt(this.getValue(),10);if(type==IMAGE||type==PREVIEW)
{if(!isNaN(value))
{element.setStyle('margin-left',CKEDITOR.tools.cssLength(value));element.setStyle('margin-right',CKEDITOR.tools.cssLength(value));}
else if(!value&&this.isChanged())
{element.removeStyle('margin-left');element.removeStyle('margin-right');}
if(!internalCommit&&type==IMAGE)
element.removeAttribute('hspace');}
else if(type==CLEANUP)
{element.removeAttribute('hspace');element.removeStyle('margin-left');element.removeStyle('margin-right');}}},{type:'text',id:'txtVSpace',width:'60px',labelLayout:'horizontal',label:editor.lang.image.vSpace,'default':'',onKeyUp:function()
{updatePreview(this.getDialog());},onChange:function()
{commitInternally.call(this,'advanced:txtdlgGenStyle');},validate:CKEDITOR.dialog.validate.integer(editor.lang.image.validateVSpace),setup:function(type,element)
{if(type==IMAGE)
{var value,marginTopPx,marginBottomPx,marginTopStyle=element.getStyle('margin-top'),marginBottomStyle=element.getStyle('margin-bottom');marginTopStyle=marginTopStyle&&marginTopStyle.match(pxLengthRegex);marginBottomStyle=marginBottomStyle&&marginBottomStyle.match(pxLengthRegex);marginTopPx=parseInt(marginTopStyle,10);marginBottomPx=parseInt(marginBottomStyle,10);value=(marginTopPx==marginBottomPx)&&marginTopPx;isNaN(parseInt(value,10))&&(value=element.getAttribute('vspace'));this.setValue(value);}},commit:function(type,element,internalCommit)
{var value=parseInt(this.getValue(),10);if(type==IMAGE||type==PREVIEW)
{if(!isNaN(value))
{element.setStyle('margin-top',CKEDITOR.tools.cssLength(value));element.setStyle('margin-bottom',CKEDITOR.tools.cssLength(value));}
else if(!value&&this.isChanged())
{element.removeStyle('margin-top');element.removeStyle('margin-bottom');}
if(!internalCommit&&type==IMAGE)
element.removeAttribute('vspace');}
else if(type==CLEANUP)
{element.removeAttribute('vspace');element.removeStyle('margin-top');element.removeStyle('margin-bottom');}}},{id:'cmbAlign',type:'select',labelLayout:'horizontal',widths:['35%','65%'],style:'width:90px',label:editor.lang.image.align,'default':'',items:[[editor.lang.common.notSet,''],[editor.lang.image.alignLeft,'left'],[editor.lang.image.alignRight,'right']],onChange:function()
{updatePreview(this.getDialog());commitInternally.call(this,'advanced:txtdlgGenStyle');},setup:function(type,element)
{if(type==IMAGE)
{var value=element.getStyle('float');switch(value)
{case'inherit':case'none':value='';}!value&&(value=(element.getAttribute('align')||'').toLowerCase());this.setValue(value);}},commit:function(type,element,internalCommit)
{var value=this.getValue();if(type==IMAGE||type==PREVIEW)
{if(value)
element.setStyle('float',value);else
element.removeStyle('float');if(!internalCommit&&type==IMAGE)
{value=(element.getAttribute('align')||'').toLowerCase();switch(value)
{case'left':case'right':element.removeAttribute('align');}}}
else if(type==CLEANUP)
element.removeStyle('float');}}]}]},{type:'vbox',height:'250px',children:[{type:'html',style:'width:95%;',html:'<div>'+CKEDITOR.tools.htmlEncode(editor.lang.common.preview)+'<br>'+'<div id="ImagePreviewLoader" style="display:none"><div class="loading">&nbsp;</div></div>'+'<div id="ImagePreviewBox"><table><tr><td>'+'<a href="javascript:void(0)" target="_blank" onclick="return false;" id="previewLink">'+'<img id="previewImage" alt="" /></a>'+
(editor.config.image_previewText||'')+'</td></tr></table></div></div>'}]}]}]},{id:'Link',label:editor.lang.link.title,padding:0,elements:[{id:'txtUrl',type:'text',label:editor.lang.common.url,style:'width: 100%','default':'',setup:function(type,element)
{if(type==LINK)
{var href=element.getAttribute('_cke_saved_href');if(!href)
href=element.getAttribute('href');this.setValue(href);}},commit:function(type,element)
{if(type==LINK)
{if(this.getValue()||this.isChanged())
{element.setAttribute('_cke_saved_href',decodeURI(this.getValue()));element.setAttribute('href','javascript:void(0)/*'+
CKEDITOR.tools.getNextNumber()+'*/');if(this.getValue()||!editor.config.image_removeLinkByEmptyURL)
this.getDialog().addLink=true;}}}},{type:'button',id:'browse',filebrowser:{action:'Browse',target:'Link:txtUrl',url:editor.config.filebrowserImageBrowseLinkUrl||editor.config.filebrowserBrowseUrl},style:'float:right',hidden:true,label:editor.lang.common.browseServer},{id:'cmbTarget',type:'select',label:editor.lang.common.target,'default':'',items:[[editor.lang.common.notSet,''],[editor.lang.common.targetNew,'_blank'],[editor.lang.common.targetTop,'_top'],[editor.lang.common.targetSelf,'_self'],[editor.lang.common.targetParent,'_parent']],setup:function(type,element)
{if(type==LINK)
this.setValue(element.getAttribute('target'));},commit:function(type,element)
{if(type==LINK)
{if(this.getValue()||this.isChanged())
element.setAttribute('target',this.getValue());}}}]},{id:'advanced',label:editor.lang.common.advancedTab,elements:[{type:'hbox',widths:['50%','25%','25%'],children:[{type:'text',id:'linkId',label:editor.lang.common.id,setup:function(type,element)
{if(type==IMAGE)
this.setValue(element.getAttribute('id'));},commit:function(type,element)
{if(type==IMAGE)
{if(this.getValue()||this.isChanged())
element.setAttribute('id',this.getValue());}}},{id:'cmbLangDir',type:'select',style:'width : 100px;',label:editor.lang.common.langDir,'default':'',items:[[editor.lang.common.notSet,''],[editor.lang.common.langDirLtr,'ltr'],[editor.lang.common.langDirRtl,'rtl']],setup:function(type,element)
{if(type==IMAGE)
this.setValue(element.getAttribute('dir'));},commit:function(type,element)
{if(type==IMAGE)
{if(this.getValue()||this.isChanged())
element.setAttribute('dir',this.getValue());}}},{type:'text',id:'txtLangCode',label:editor.lang.common.langCode,'default':'',setup:function(type,element)
{if(type==IMAGE)
this.setValue(element.getAttribute('lang'));},commit:function(type,element)
{if(type==IMAGE)
{if(this.getValue()||this.isChanged())
element.setAttribute('lang',this.getValue());}}}]},{type:'text',id:'txtGenLongDescr',label:editor.lang.common.longDescr,setup:function(type,element)
{if(type==IMAGE)
this.setValue(element.getAttribute('longDesc'));},commit:function(type,element)
{if(type==IMAGE)
{if(this.getValue()||this.isChanged())
element.setAttribute('longDesc',this.getValue());}}},{type:'hbox',widths:['50%','50%'],children:[{type:'text',id:'txtGenClass',label:editor.lang.common.cssClass,'default':'',setup:function(type,element)
{if(type==IMAGE)
this.setValue(element.getAttribute('class'));},commit:function(type,element)
{if(type==IMAGE)
{if(this.getValue()||this.isChanged())
element.setAttribute('class',this.getValue());}}},{type:'text',id:'txtGenTitle',label:editor.lang.common.advisoryTitle,'default':'',onChange:function()
{updatePreview(this.getDialog());},setup:function(type,element)
{if(type==IMAGE)
this.setValue(element.getAttribute('title'));},commit:function(type,element)
{if(type==IMAGE)
{if(this.getValue()||this.isChanged())
element.setAttribute('title',this.getValue());}
else if(type==PREVIEW)
{element.setAttribute('title',this.getValue());}
else if(type==CLEANUP)
{element.removeAttribute('title');}}}]},{type:'text',id:'txtdlgGenStyle',label:editor.lang.common.cssStyle,'default':'',setup:function(type,element)
{if(type==IMAGE)
{var genStyle=element.getAttribute('style');if(!genStyle&&element.$.style.cssText)
genStyle=element.$.style.cssText;this.setValue(genStyle);var height=element.$.style.height,width=element.$.style.width,aMatchH=(height?height:'').match(regexGetSize),aMatchW=(width?width:'').match(regexGetSize);this.attributesInStyle={height:!!aMatchH,width:!!aMatchW};}},onChange:function()
{commitInternally.call(this,['info:cmbFloat','info:cmbAlign','info:txtVSpace','info:txtHSpace','info:txtBorder','info:txtWidth','info:txtHeight']);updatePreview(this);},commit:function(type,element)
{if(type==IMAGE&&(this.getValue()||this.isChanged()))
{element.setAttribute('style',this.getValue());}}}]}]};};CKEDITOR.dialog.add('image',function(editor)
{return imageDialog(editor,'image');});CKEDITOR.dialog.add('imagebutton',function(editor)
{return imageDialog(editor,'imagebutton');});})();