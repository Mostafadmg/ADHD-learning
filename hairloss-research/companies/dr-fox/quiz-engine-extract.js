                    return;
                }
                var a = document.createElement('script'),
                    t = document.getElementsByTagName('script'),
                    m = t[t.length - 1];
                a.src = "https://www.google.com/recaptcha/api.js?onload=CaptchaCallback&render=explicit";
                m.parentNode.insertBefore(a, m.nextSibling);
            }
        });
        /*
         *
         */
    }, 250);
    /*
     * By default our overlay email form is disabled.
     * But if changed && its !VISIBLE run our checks
     */
    $document.on("load change paste keyup input", '.captchaEmail', function () {
        //check ifg on login url!
        checkEmail($(this));
    });
    //var showPwdBtn = $form.find(".hideShowPassword-wrapper button");
    $(".password").hideShowPassword(false, true, {
        toggle: {
            styles: {position: 'absolute', bottom: '5px'},
        },
        wrapper: {
            enforceWidth: false,
            styles: {position: 'relative', display: 'block'},
            inheritStyles: [
                'display',
                'verticalAlign',
                'marginTop',
                'marginRight',
                'marginBottom',
                'marginLeft'
            ],
        }
    });
});
$(function () {
    /*
     * 
     */
    var BUTTON_DISABLE_CLASS = 'button-grey';
    var $form = $('#answer_form');
    var $submitButton = $('#submit_btn');
    if (!$form.length) {
        return;
    }
    /*
     * Our 3 types of question/nodes.
     * ***Most important, "single source of truth".
     * 
     * Before this was spread accross  HTMl & JS, <form/> inputs & HTML.
     * 1. markup all HTML (must be for SEO) & only manipulated with JS. before was JS & HTML
     * 2. Form data from JS; was both <form/> & JS
     * 
     */
    function Consultation() {
        var questions = [];
        return {
            /*
             *
             */
            addQuestion: function (q) {
                questions.push(q);
                q.onChange = function (q) {
                    alert('has changed');
                };
                return this;
            },
            /*
             *
             */
            checkSubmit: function (checkOnly) {
                var showErrors = !checkOnly;
                var wrongAnswer = false;
                var data = {};
                var canSubmit = true;
                for (var i=0; i<questions.length; i++) {
                    var question = questions[i];
                    // not used or not used yet! (forking)
                    if (!question.isRequired()) {
                        continue;
                    }
                    if (!question.isAnswered()) {
                        if (showErrors) {
                            question.showUnanswered();
                        }
                        canSubmit = false;
                    } else if (!question.isCorrect()) {
                        if (showErrors) {
                            if(question.type != 'freetext') {
                                wrongAnswer = true;
                            }
                            question.showIncorrectAnswer();
                        }
                        //console.log('question incorrect', question);
                        canSubmit = false;
                    } else {
                        data[ question.getId()] = question.getValue();
                    }
                }
                //console.log(canSubmit, data);
                if (canSubmit) {
                    return data;
                }
                if (showErrors && wrongAnswer) {
                    alert('We are unable to provide you with this treatment. You may still benefit from treatment. Please discuss this with your regular doctor who knows you, has your records, and can carry out tests and examine you as needed.');
                }
            },
            /*
             *
             * @returns {undefined}
             */
            canSubmit: function () {
                return this.checkSubmit(true);
            },
            isConsultationPage: function() {
                return (typeof this.questions != 'undefined' && this.questions.length > 0);
            }
        }
    }
    /*
     * Simple composition.
     * We still support IE 8,9 so no Object.create, .assign, extends ...
     * Just KISS!, not optimal, but we dont have to worry about memory leaks
     */
    function ConsultationQuestion($el) {
        /*
         *
         */
        var that = this;
        /*
         *
         */
        this.id = $el.attr('data-id');
        this.type = $el.attr('data-type');
        this.value = null;
        this.answer = false;
        this.multipleExclusionRules = false;
        this.required = $el.attr('data-required') ? true : false;
        var branch = $el.attr('data-branch');
        /*
         * Dont have to unbind as
         * not SPA or dynamic questionaire
         */
        $el.on('change', 'input.answer', function () {
            var $input = $(this);
            var productId = $input.attr('data-product_id');
            /*
             * Pull the answer params from HTML
             */
            that.answer = {
                correct: $input.attr('data-correct'),
                text: $input.parent().find('.answer-text').html(),
                product_id: productId
            };
            if ($input.data('multiexclusionrules')*1 == 1) {
                that.multipleExclusionRules = {
                    message: $input.parent().find('.multi-exclude-answer-message').html(),
                };
            }
            if(productId){
                $el.closest('form').find('input[name="product_id"]').val(productId);
            }
            that.value = $input.val();
            if($input.is(':checkbox')) {
                that.valueMulti = [];
                $input.closest('.multiple_answers').find('input:checkbox[name="'+$input.attr('name')+'"]:checked').each(function(){
                    that.valueMulti.push($(this).val());
                });
            } else {
                that.popup('');
            }
            that.onAnswered();
            if(that.type == 'freetext') {
                if(that.isCorrect()) {
                    that.showCorrectAnswer();
                }
            } else if($input.is(':checkbox')) {
                if($input.is(':checked')) {
                    that.showCorrectAnswer(that.value);
                } else {
                    that.popup('', 'correct_answer notification--information', that.value);
                }
            } else {
                that[that.isCorrect() ? 'showCorrectAnswer' : 'showIncorrectAnswer']();
            }
        });
        /*
         *
         * A tree->branch has changed; been activated.
         * a) If this question is part of the tree & the active branch then show
         * b) If this question is part of the tree & inactive branch then hide
         *
         * Only 1 branch. ATM we have to be compatiable with IE8/9.
         * When this goes due to TLS1.0 removal mid 2018, we can do a much btter job with pub/sub
         *
         * Rather than disable <input>, just remove HTML; clear unambiguous, suported by all browsers!
         */
        if (branch) {
            this.required = false;
            $el.parent().on("treeChange", function (e, newBranch) {
                var allBranches = [];
                $el.parent().find("[data-type='tree'] input:checkbox:checked:visible, [data-type='tree'] input:radio:checked:visible").each(function(){
                    allBranches.push($(this).val());
                });
                var removeBranches = [];
                for(var i = allBranches.length - 1; i>= 0; i--) {
                    branchLabel = allBranches[i];
                    if(branchLabel.startsWith('!')) {
                        removeBranches.push(branchLabel);
                        allBranches.splice(i,1);
                    }
                }
                for(var j = removeBranches.length - 1; j>= 0; j--) {
                    bL = removeBranches[j];
                    allBranches = allBranches.filter(function(x) {
                        return '!'+x !== bL;
                    });
                }
                that.required = $.inArray(branch, allBranches) !== -1;
                if (that.required) {
                    $el.find('input').prop("disabled", false);
                    $el.show();
                } else {
                    $el.find('input').prop("disabled", true);
                    $el.hide();
                }
            });
        }
        /*
         *
         */
        this.onAnswered = function () {
        }
        /*
         *
         * @type type
         */
        this.popup = function (text, clss, multiple) {
            multiple = multiple || false;
            if(multiple) {
                $el.find('.popup div.unanswered').remove();
                if(text) {
                    $el.find('.popup').append('<div class="notification ' + clss + '" rel="'+multiple.replace("|", "-")+'">' + text + '</div>');
                } else {
                    $el.find('.popup div[rel="'+multiple.replace("|", "-")+'"]').remove();
                }
            } else {
                $el.find('.popup').html(text ? '<div class="notification ' + clss + '">' + text + '</div>' : '');
            }
        }
    }
    ConsultationQuestion.prototype = {
        /*
         *
         * @returns {Boolean}
         */
        isRequired: function () {
            return this.required;
        },
        /*
         *
         */
        isAnswered: function () {
            return this.answer;
        },
        /*
         *
         */
        isCorrect: function () {
            var a = this.isAnswered();
            return a && a.correct;
        },
        /*
         *
         */
        getId: function () {
            return this.id;
        },
        /*
         *
         */
        getValue: function () {
            if(this.valueMulti) {
                return this.valueMulti.join(', ');
            } else {
                return this.value;
            }
        },
        /*
         * Only called externally when checking submit
         */
        showUnanswered: function () {
            this.popup("Please answer this question to proceed", 'unanswered  notification--warning');
        },
        /*
         *
         */
        showIncorrectAnswer: function () {
            this.popup(this.answer.text, 'incorrect_answer  notification--warning');
        },
        /*
         *
         */
        showCorrectAnswer: function (multiple) {
            multiple = multiple || false;
            if (this.multipleExclusionRules !== false) {
                this.popup(this.multipleExclusionRules.message, 'correct_answer notification--information', multiple);
            } else {
                this.popup(this.answer.text, 'correct_answer notification--information', multiple);
            }
        }
    }
    /*
     *
     */
    function ConsultationQuestionTree($el) {
        var question = new ConsultationQuestion($el);
        /*
         * Selected answer is the branch
         */
        question.onAnswered = function () {
            if(question.valueMulti) {
                $el.parent().trigger("treeChange", [question.valueMulti.join("|")]);
            } else {
                $el.parent().trigger("treeChange", [question.value]);
            }
        }
        return question;
    }
    /*
     *
     */
    function ConsultationQuestionFreetext($el) {
        var
                question = new ConsultationQuestion($el),
                $freetext = $el.find('.freetext'),
                $textarea = $freetext.find('textarea'),
                textAreaCache;
        $textarea.on('change', function () {
            var isCorrect = ($(this).val().length==0)?0:1;
            question.answer.correct = isCorrect;
            if(!isCorrect) {
                question.answer.text = "Please enter text in box above to continue, or change your answer to 'No'";
            } else {
                question.answer.text = "";
            }
            question.popup('');
            question[question.isCorrect() ? 'showCorrectAnswer' : 'showIncorrectAnswer']();
        });
        /*
         *
         */
        question.onAnswered = function () {
            if (this.value == 'yes') {
                $textarea.val(textAreaCache || '');
                $freetext.show();
                var isCorrect = ($textarea.val().length==0)?0:1;
                question.answer.correct = isCorrect;
                if(!isCorrect) {
                    question.answer.text = "Please enter text in box above to continue, or change your answer to 'No'";
                } else {
                    question.answer.text = "";
                }
            } else {
                $freetext.hide();
                textAreaCache = $textarea.val();
                $textarea.val('');
            }
            question.showCorrectAnswer();
        }
        return question;
    }
    var consultation = new Consultation;
    /*
     * 
     */
    $form.find('.question').each(function (i, el) {
        var
                $el = $(el),
                question;
        /*
         * 
         */
        switch ($el.attr('data-type')) {
            case 'tree':
                question = new ConsultationQuestionTree($el);
                break;
            case 'freetext':
                question = new ConsultationQuestionFreetext($el);
                break;
            default:
                question = new ConsultationQuestion($el);
        }
        consultation.addQuestion(question);
    });
    /*
     * 
     */
    $form.on('change', function () {
        if (consultation.canSubmit()) {
            $submitButton.removeClass(BUTTON_DISABLE_CLASS);
        }
    });
    /*
     * Un check all answers in case browser has set
     */
    $form.find(".answer").attr("checked", false);
    /*
     * 
     */
    $submitButton.addClass(BUTTON_DISABLE_CLASS).on('click', function (e) {
        var canSubmit = consultation.checkSubmit() ? true : false;
        return canSubmit;
    });
    /*
     * 
     */
    var productPreselect = $form.data('productPreselect');
    if(productPreselect > 0) {
        $form.find('.answer[data-product_id="'+productPreselect+'"]').each(function () {
            $(this).parent().siblings('label').find('.answer[data-product_id]').trigger('click');
        });
    }
});
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
