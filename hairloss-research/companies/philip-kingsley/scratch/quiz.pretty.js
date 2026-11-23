define(['jquery','mage/cookies','Magento_Ui/js/modal/modal','domReady!'],function($,cookies,modal){
var scrollToTop=()=>{
setTimeout(function(){
window.scrollTo({
top:0,behavior:'smooth'});
},500);
};
if(!window.quiz){
window.quiz={
previousStep:"welcome",currentStep:"welcome",nextStep:"",data:{
},dataLoaded:false,popup:null,shouldRenderNextButton:false,state:{
},quizId:null,loadState:function(state){
this.state=state;
if(localStorage.getItem("quizData")!==null&&localStorage.getItem("quizData")!=='undefined'){
let restoreData=JSON.parse(localStorage.getItem('quizData'));
this.data=restoreData;
}
$("#pk-quiz-step-wrapper").html(this.getTemplate(this.state.current));
},getTemplate:function(index){
return this.state.templates[index];
},getData:function(key){
if(typeof key!=='undefined'&&typeof this.data!=='undefined'&&this.quizId&&typeof this.data[this.quizId]!=='undefined'&&typeof this.data[this.quizId][key]!=='undefined'){
return this.data[this.quizId][key];
}
if(typeof key!=='undefined'&&typeof this.data!=='undefined'&&typeof this.data[key]!=='undefined'){
return this.data[key];
}
return null;
},setData:function(key,value){
if(typeof this.data==='undefined'){
this.data={
};
}
if(this.quizId){
if(typeof this.data[this.quizId]==='undefined'){
this.data[this.quizId]={
};
}
this.data[this.quizId][key]=value;
}else{
this.data[key]=value;
}
this.handleChanges();
},start:function(callback,forceSync){
var self=this;
if(!self.dataLoaded){
var hasData=localStorage.getItem("quizData")&&localStorage.getItem("quizData")!=='undefined'&&localStorage.getItem("quizData")!==null&&typeof localStorage.getItem("quizData")!=='undefined'&&Object.keys(JSON.parse(localStorage.getItem("quizData"))).length;
var sessionId=typeof self.data.session_id!=="undefined"?self.data.session_id:null;
self.persistData(!hasData||forceSync).then(function(response){
self.dataLoaded=true;
if(sessionId&&response.data.session_id!==sessionId){
self.data={
};
}else{
self.data=response.data;
}
localStorage.setItem('quizData',JSON.stringify(self.data));
self.renderStep();
if(callback){
callback();
}});
}else{
self.renderStep();
if(callback){
callback();
}}
var options={
'type':'popup','title':'Sign In','modalClass':'quiz-popup-authentication','responsive':true,'innerScroll':true,'buttons':[],'opened':function(){
}};
this.popup=$('#quiz-login-modal');
modal(options,this.popup);
scrollToTop();
window.addEventListener("popstate",function(e){
if(window.historyInitiated){
window.location.reload();
}});
$('#pk-quiz-step-wrapper').css({
'left':'-40px'});
setTimeout(function(){
$('#pk-quiz-step-wrapper').animate({
opacity:1,left:'0px'},150,'linear');
},50);
self.backAction=quiz.createAction("Back",function(event){
event.preventDefault();
self.fadeOut(function(){
var prevStepCode=self.getPreviousStepCode();
if(window.historyInitiated){
history.back();
self.shouldRenderNextButton=true;
window.location.reload();
}else{
if(self.currentStep!==self.previousStep){
scrollToTop();
window.location.href=window.BASE_URL+'/quiz/step/view/stepId/'+prevStepCode;
}}});
});
this.initAdditionalInformationModal();
},initAdditionalInformationModal:function(){
var options={
type:'popup',responsive:true,innerScroll:true,title:'',modalClass:'information-modal',buttons:[{
text:'Close',class:'',click:function(){
this.closeModal();
}}]};
modal(options,$('#information-modal'));
$(document).on('click','.answer-info-icon',function(e){
e.preventDefault();
let hashId=$(this).data('hash-id');
let descriptionContent=$('.answer-info-description[data-hash-id="'+hashId+'"]').html();
$('#information-modal .information-modal-body-content').html(descriptionContent);
$('#information-modal').modal('openModal');
});
},fadeOut:function(callback){
$('#pk-quiz-step-wrapper').animate({
opacity:0},150,'linear');
setTimeout(function(){
callback();
},150);
},handleChanges:function(){
var self=this;
$(".pk-quiz-control-group").each(function(index,elem){
if($(elem).data('if')&&typeof $(elem).data('if')=='object'){
var condition=$(elem).data('if');
var canRender=false;
if(Array.isArray(condition.value)){
for(let i=0;
i<condition.value.length;
i++){
var checkValue=condition.value[i];
canRender=canRender||(checkValue?checkValue==(self.getData(condition.field)?self.getData(condition.field).value:null):typeof self.getData(condition.field)!=='undefined');
if(self.isQuestionMultiple(condition.field)){
var savedData=self.getData(condition.field);
if(savedData&&savedData.value){
var answers=savedData.value.split("|");
if(answers.indexOf(checkValue)!==-1){
canRender=true;
}}}}}else{
canRender=condition.value?condition.value==(self.getData(condition.field)?self.getData(condition.field).value:null):typeof self.getData(condition.field)!=='undefined';
if(self.isQuestionMultiple(condition.field)){
var savedData=self.getData(condition.field);
if(savedData&&savedData.value){
var answers=savedData.value.split("|");
if(answers.indexOf(condition.value)!==-1){
canRender=true;
}}}}
if(canRender){
$(elem).removeClass('hidden');
$(elem).show(0);
}else{
$(elem).hide(0);
if(condition.code){
self.data[self.quizId][condition.code]={
label:$(elem).find('.pk-quiz-control').first().data('quiz-label'),value:''};
$(elem).find('.pk-quiz-control').removeClass('selected');
}}}});
$(".pk-quiz-control").each(function(index,elem){
var quizQuestion=$(elem).data("quiz-question");
var quizData=$(elem).data("quiz-selection");
var savedData=self.getData(quizQuestion);
if(savedData&&savedData.value==quizData){
$(elem).addClass("selected");
}else{
$(elem).removeClass("selected");
}
if($(elem).hasClass('multiple')&&savedData){
var answers=savedData.value.split("|");
for(var i=0;
i<answers.length;
i++){
if(savedData&&answers[i]==quizData){
$(elem).addClass("selected");
}}}});
},getQuizType:function(){
if(localStorage.getItem('quizData')!==null){
let tempData=JSON.parse(localStorage.getItem('quizData'));
return tempData;
}},areConditionalQuestionsAnswered:function(){
var canProceed=true;
var self=this;
$(".pk-quiz-control-group").each(function(index,elem){
if($(elem).data('if')&&typeof $(elem).data('if')=='object'){
var condition=$(elem).data('if');
var canRender=condition.value?condition.value==(self.getData(condition.field)?self.getData(condition.field).value:null):typeof self.getData(condition.field)!=='undefined';
if(self.isQuestionMultiple(condition.field)){
var savedData=self.getData(condition.field);
if(savedData&&savedData.value){
var answers=savedData.value.split("|");
if(answers.indexOf(condition.value)!==-1){
canRender=true;
}}}
if(canRender&&condition.code){
canProceed=canProceed&&(self.getData(condition.code)!==null&&self.getData(condition.code).value!=="");
}}});
return canProceed;
},isQuestionMultiple:function(code){
var isMultiple=false;
$(".pk-quiz-control").each(function(index,elem){
if($(elem).hasClass('multiple')&&$(elem).data('quiz-question')==code){
isMultiple=true;
}});
return isMultiple;
},isUniqueAnswerSelected:function($clickedQuestion){
var uniqueSelected=false;
$checkSelections=$clickedQuestion.parent().children(".pk-quiz-control.selected");
$checkSelections.each(function(index,elem){
if($(elem).data('quiz-unique')){
uniqueSelected=true;
}});
return uniqueSelected;
},renderStep:function(){
var self=this;
$(".pk-quiz-control").off("click");
var specialHandling=parseInt(self.currentStep)==10||parseInt(self.currentStep)==12;
if(!specialHandling&&($(".pk-quiz-control.multiple").length!=0||$(".pk-quiz-control-group textarea").length!=0||self.currentStep=='user')){
self.shouldRenderNextButton=true;
}
var shouldAutomaticallyProgress=(self.areConditionalQuestionsAnswered()&&$(".pk-quiz-control.multiple").length==0);
if(self.currentStep=="women_quiz_step_user")return;
if(self.currentStep=="men_quiz_step_user")return;
if(self.currentStep=="scalp_quiz_step_user")return;
$(".pk-quiz-control").on("click",function(){
var quizQuestion=$(this).data("quiz-question");
var quizQuestionLabel=$(this).data("quiz-label");
var quizData=$(this).data("quiz-selection");
if($(this).hasClass('multiple')){
var savedData=self.getData(quizQuestion);
if($(this).data('quiz-unique')){
}else{
if(savedData&&savedData.value){
var answers=savedData.value.split("|");
if(!self.isUniqueAnswerSelected($(this))&&!$('.pz-quiz-answer .pk-quiz-control.selected[data-quiz-unique="yes"]').length){
if(answers.indexOf(quizData)===-1){
answers.push(quizData);
}else{
answers=answers.filter((v,i,a)=>v!==quizData);
}
quizData=answers.join("|");
}}}}
self.setData(quizQuestion,{
label:quizQuestionLabel,value:quizData});
if(shouldAutomaticallyProgress&&!self.shouldRenderNextButton){
$(".pk-quiz-step-actions .pk-quiz-action.Next").click();
}
if(specialHandling&&quizData=="Yes"){
$(".pk-quiz-step-actions .pk-quiz-action.Next").show(0);
}});
self.handleChanges();
if($(".pk-quiz-control.selected").length!=0){
self.shouldRenderNextButton=true;
}},getResultsStep:function(){
if(this.data.quizId==='men_quiz'){
return'men_quiz_step_results';
}
if(this.data.quizId==='women_quiz'){
return'women_quiz_step_results';
}
return'scalp_quiz_step_results';
},renderActions:function(actions){
var self=this;
$(".pk-quiz-step-actions").html("");
for(var i=0;
i<actions.length;
i++){
$(".pk-quiz-step-actions").append(actions[i]);
}
if(quiz.currentStep!=="welcome"&&quiz.currentStep!==self.getResultsStep()){
$(".pk-quiz-step-actions").append(self.backAction);
}
var shouldRenderNextButton=self.shouldRenderNextButton||!self.dataLoaded;
if(!shouldRenderNextButton){
$(".pk-quiz-step-actions .pk-quiz-action.Next").hide(0);
}
if(self.currentStep=="user"){
$(".pk-quiz-step-actions .pk-quiz-action.Next").show(0);
}},createAction:function(label,callback,modifier){
var $button=$("<button class='pk-quiz-action'></button>");
$button.append("<span>"+label+"</span>");
$button.addClass(label);
if(modifier){
$button=modifier($button);
}
$button.on("click",callback);
return $button;
},createLoginAction:function(html){
var self=this;
var $button=$("<div class='pk-quiz-login-action'></div>");
$button.append("<span>"+html+"</span>");
$button.find("a").on("click",function(event){
event.preventDefault();
self.popup.modal("openModal");
});
return $button;
},getValuesByLabel:function(quizData,label){
for(let j=0;
j<Object.keys(quizData).length;
j++){
var question=quizData[Object.keys(quizData)[j]];
if(label==question.label){
return question.value.split('|');
}}
return null;
},validateGenericCondition:function(quizData,conditionMetadata,defaultValue){
var self=this;
switch(conditionMetadata.operator){
case'and':var values=self.getValuesByLabel(quizData,conditionMetadata.question);
if(!values){
return defaultValue;
}
var result=true;
conditionMetadata.values.forEach(function(value){
result=result&&(values.indexOf(value)!==-1);
});
return result;
break;
case'or':var values=self.getValuesByLabel(quizData,conditionMetadata.question);
if(!values){
return defaultValue;
}
var result=false;
conditionMetadata.values.forEach(function(value){
result=result||(values.indexOf(value)!==-1);
});
return result;
break;
}},validateCompositeCondition:function(quizData,conditionMetadata,defaultValue){
var self=this;
switch(conditionMetadata.operator){
case'and':var result=true;
conditionMetadata.conditions.forEach(function(childMetadata){
switch(childMetadata.type){
case'GenericCondition':result=result&&self.validateGenericCondition(quizData,childMetadata,defaultValue);
break;
case'CompositeCondition':result=result&&self.validateCompositeCondition(quizData,childMetadata,defaultValue);
break;
}});
return result;
break;
case'or':var result=false;
conditionMetadata.conditions.forEach(function(childMetadata){
switch(childMetadata.type){
case'GenericCondition':result=result||self.validateGenericCondition(quizData,childMetadata,defaultValue);
break;
case'CompositeCondition':result=result||self.validateCompositeCondition(quizData,childMetadata,defaultValue);
break;
}});
return result;
break;
}},validateCondition:function(quizData,condition,defaultValue){
if(condition.type=='GenericCondition'){
return this.validateGenericCondition(quizData,condition,defaultValue);
}
if(condition.type=='CompositeCondition'){
return this.validateCompositeCondition(quizData,condition,defaultValue);
}},processConditions:function(quizData,conditionGroup,defaultValue){
if(typeof quizData=='undefined'){
quizData={
};
}
return this.validateCondition(quizData,conditionGroup,defaultValue);
},checkProductAvailability:function(){
var skus=[];
var rules=(this.state.rules[this.quizId])?Object.values(this.state.rules[this.quizId]):[];
for(let i=0;
i<rules.length;
i++){
var canSelectRule=true;
var rule=rules[i];
var blockers=(typeof rule['blockers']!=='undefined')?rule['blockers']:false;
var conditions=(typeof rule['conditions']!=='undefined')?rule['conditions']:false;
var blockerActivated=blockers?this.processConditions(this.data[this.quizId],blockers,false):false;
var conditionsValid=conditions?this.processConditions(this.data[this.quizId],conditions,true):true;
canSelectRule=!blockerActivated&&conditionsValid;
if(canSelectRule){
skus.push(rule['sku']);
}}
return skus;
},persistData:function(synchronous,clearAction,forceSync){
var self=this;
var persistData=self.data;
persistData['quizId']=self.quizId;
persistData['quiz_id']=self.quizId;
$('.pk-quiz-action').attr('disabled','disabled');
if(synchronous){
localStorage.setItem('quizData',JSON.stringify(self.data));
return $.post({
url:"/quiz/step/persistData",data:{
quiz_data:persistData,clearAction:clearAction?true:false,form_key:self.getFormKey()},global:false});
}else{
localStorage.setItem('quizData',JSON.stringify(self.data));
return new Promise(function(resolve,reject){
$.post({
url:"/quiz/step/persistData",data:{
quiz_data:self.data,form_key:self.getFormKey()},global:false}).then(function(response){
var previousSteps=self.data.previousSteps;
var dataAnswers=self.data[self.quizId];
var responseAnswers=response.data[self.quizId];
self.data={
...self.data,...response.data};
self.data[self.quizId]={
...dataAnswers,...responseAnswers}
self.data.previousSteps=previousSteps;
});
resolve({
success:true,data:self.data});
});
}},getFormKey:function(){
return $.mage.cookies.get('form_key');
},register:function(){
var self=this;
var data=self.getData('user');
data.form_key=self.getFormKey();
data.quiz_selection=this.quizId?this.quizId:this.data.quizId;
return data;
},getPreviousStepCode(){
var self=this;
var prevStep=false;
if(!prevStep&&self.data.previousSteps&&self.data.previousSteps[self.quizId]){
prevStep=self.data.previousSteps[self.quizId].pop();
localStorage.setItem('quizData',JSON.stringify(self.data));
}
return prevStep?prevStep:(this.quizId==='scalp_quiz'?"scalp_quiz_step0":"welcome");
},getNextStepCode(){
var self=this;
let nextStep='';
if(self.state.conditional_transitions[self.state.current]){
let conditions=self.state.conditional_transitions[self.state.current].conditions;
let canProcess=true;
for(let i=0;
i<conditions.length;
i++){
let condition=conditions[i];
let data=self.getData(condition.question);
if(!data||data.value!==condition.answer){
canProcess=false;
}}
if(canProcess){
self.state.current=self.previousStep!=="welcome"?self.state.conditional_transitions[self.state.current].step:self.state.first_steps[self.quizId];
nextStep=self.previousStep!=="welcome"?self.state.current:self.state.first_steps[self.quizId];
}else{
self.state.current=self.previousStep!=="welcome"?self.state.transitions[self.state.current]:self.state.first_steps[self.quizId];
nextStep=self.previousStep!=="welcome"?self.state.transitions[self.state.current]:self.state.first_steps[self.quizId];
}}else{
self.state.current=self.previousStep!=="welcome"?self.state.transitions[self.state.current]:self.state.first_steps[self.quizId];
nextStep=self.previousStep!=="welcome"?self.state.transitions[self.state.current]:self.state.first_steps[self.quizId];
}
return nextStep;
},goToNextStep:function(nextStepcode){
var self=this;
var animated=false;
var onAnimationDone=null;
$('#pk-quiz-step-wrapper').animate({
opacity:0},150,'linear');
setTimeout(function(){
animated=true;
if(onAnimationDone){
onAnimationDone();
};
},150);
self.previousStep=self.state.current;
self.rememberPreviousStepInLocalStorage(self.state.current);
let nextStep=nextStepcode?nextStepcode:self.getNextStepCode();
self.state.current=nextStepcode?nextStepcode:self.state.current;
let stepHtml=self.getTemplate(self.state.current);
if(self.data.quizId&&(self.nextStep.indexOf('_step_results')!==-1)&&self.checkProductAvailability().length===0){
self.state.current=self.getResultsStep();
nextStep=self.state.current;
self.nextStep=self.state.current;
stepHtml=self.getTemplate('no_results');
self.setProgress(100);
}
self.currentStep=self.state.current;
self.nextStep=nextStep;
self.shouldRenderNextButton=false;
window.historyInitiated=true;
window.history.pushState({
url:window.BASE_URL+"/quiz/step/view/stepId/"+self.currentStep,previousStep:self.previousStep},"Hairloss Quiz","/quiz/step/view/stepId/"+self.currentStep);
onAnimationDone=function(){
if(self.currentStep==self.getResultsStep()){
window.location.reload();
}else{
$("#pk-quiz-step-wrapper").html(stepHtml);
$("#pk-quiz-main").removeClass().addClass("pk-quiz").addClass("step-"+self.currentStep);
}
if(self.data.quizId&&self.checkProductAvailability().length==0){
$('#pk-quiz-step-wrapper').animate({
opacity:1},150,'linear');
}};
if(animated){
onAnimationDone();
}},rememberPreviousStepInLocalStorage:function(stepCode){
var self=this;
if(!self.data.previousSteps){
self.data.previousSteps={
};
}
if(!self.data.previousSteps[self.quizId]){
self.data.previousSteps[self.quizId]=[];
}
self.data.previousSteps[self.quizId].push(stepCode);
localStorage.setItem('quizData',JSON.stringify(self.data));
},intersect:function(a,b){
return a.filter(Set.prototype.has,new Set(b));
},resolveNoResultsTemplate:function(){
var noResultRules=this.state['no_results_rules'][this.quizId]??[];
var defaultTemplate=this.state['default_no_rules_template'][this.quizId];
var data=this.data;
if(noResultRules){
for(let i=0;
i<noResultRules.length;
i++){
var rule=noResultRules[i];
for(let j=0;
j<Object.keys(data).length;
j++){
var question=data[Object.keys(data)[j]];
if(rule.question==question.label&&rule.answer==question.value){
return rule.template;
}
if(rule.question==question.label&&typeof rule.answer=='object'){
if(this.intersect(rule.answer,question.value.split('|')).length){
return rule.template;
}}}}}
return defaultTemplate;
},showMessages:function(messages){
if(typeof messages!=='undefined'&&messages.length>0){
var messagesHtml="";
for(var i=0;
i<messages.length;
i++){
messagesHtml+="<div class='message-error error message'><div>"+messages[i]+"</div></div>";
}
$(".pk-quiz-messages").html(messagesHtml);
}},setProgress:function(progress){
$("#quiz-progress-bar").width(progress+"%");
$("#quiz-progress-text").text(progress+"%");
},resetAnswers:function(stepId){
localStorage.setItem('quizData',"{
}");
localStorage.removeItem('quizData');
setTimeout(function(){
if(typeof stepId!=='undefined'){
window.location.href=window.BASE_URL+"/quiz/step/reset/stepId/"+stepId;
}else{
window.location.href=window.BASE_URL+'welcome';
}},100);
}};
}else{
scrollToTop();
}
return window.quiz;
});
