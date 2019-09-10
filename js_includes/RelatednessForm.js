/* This software is licensed under a BSD license; see the LICENSE file for details. */

define_ibex_controller({
name: "RelatednessForm",

jqueryWidget: {
    _init: function () {
        this.cssPrefix = this.options._cssPrefix;
        this.finishedCallback = this.options._finishedCallback;
        this.utils = this.options._utils;

        this.html = dget(this.options, "html");
        this.continueOnReturn = dget(this.options, "continueOnReturn", false);
        this.continueMessage = dget(this.options, "continueMessage", "Click here to continue");
        this.checkedValue = dget(this.options, "checkedValue", "yes");
        this.uncheckedValue = dget(this.options, "uncheckedValue", "no");
        this.validators = dget(this.options, "validators", { });
        this.errorCSSClass = dget(this.options, "errorCSSClass", "error");
        this.saveReactionTime = dget(this.options, "saveReactionTime", false);
        this.obligatoryErrorGenerator =
            dget(this.options, "obligatoryErrorGenerator",
                 function (field) { return "The \u2018" + field + "\u2019 field is obligatory."; });
        this.obligatoryCheckboxErrorGenerator =
            dget(this.options, "obligatoryCheckboxErrorGenerator",
                 function (field) { return "You must check the " + field + " checkbox to continue."; });
        this.obligatoryRadioErrorGenerator =
            dget(this.options, "obligatoryRadioErrorGenerator",
                 function (field) { return "You must consent and select \"YES\" to partake in this study."; });

        window.categories = dget(this.options, "categories");
        window.definitions = dget(this.options, "definitions");

        // Shuffle pairs
        if (Math.floor(Math.random()*2) == 1) {
            temp0 = window.categories[0]
            temp1 = window.categories[1]
            window.categories[0] = window.categories[2]
            window.categories[1] = window.categories[3]
            window.categories[2] = temp0
            window.categories[3] = temp1
            temp0d = window.definitions[0]
            temp1d = window.definitions[1]
            window.definitions[0] = window.definitions[2]
            window.definitions[1] = window.definitions[3]
            window.definitions[2] = temp0d
            window.definitions[3] = temp1d
        }

        // Shuffle items within pair
        if (Math.floor(Math.random()*2) == 1) {
            temp0 = window.categories[0]
            window.categories[0] = window.categories[1]
            window.categories[1] = temp0
            temp0d = window.definitions[0]
            window.definitions[0] = window.definitions[1]
            window.definitions[1] = temp0d
        }
        if (Math.floor(Math.random()*2) == 1) {
            temp2 = window.categories[2]
            window.categories[2] = window.categories[3]
            window.categories[3] = temp2
            temp2d = window.definitions[2]
            window.definitions[2] = window.definitions[3]
            window.definitions[3] = temp2d
        }


        var t = this;

        function alertOrAddError(name, error) {
            var ae = $("label." + escape(t.errorCSSClass) + "[for=__ALL_FIELDS__]");
            if (ae.length > 0) {
                ae.addClass(t.cssPrefix + "error-text").text(error);
                return;
            }

            var e = $("label." + escape(t.errorCSSClass) + "[for=" + escape(name) + "]");
            if (e.length > 0)
                e.addClass(t.cssPrefix + "error-text").text(error);
            else 
                alert(error);
        }

        var HAS_LOADED = false;

        function handleClick(dom) {
            return function (e) {
                var answerTime = new Date().getTime();

                e.preventDefault();
                if (! HAS_LOADED) return;

                // Get rid of any previous errors.
                $("." + t.cssPrefix + "error-text").empty();

                var rlines = [];

                var inps = $(dom).find("input[type=text]");
                var tas = $(dom).find("textarea");
                for (var i = 0; i < tas.length; ++i) { inps.push(tas[i]); }

                for (var i = 0; i < inps.length; ++i) {
                    var inp = $(inps[i]);

                    if (inp.hasClass("obligatory") && ((! inp.attr('value')) || inp.attr('value').match(/^\s*$/))) {
                        alertOrAddError(inp.attr('name'), t.obligatoryErrorGenerator(inp.attr('name')));
                        return;
                    }

                    if (t.validators[inp.attr('name')]) {
                        var er = t.validators[inp.attr('name')](inp.attr('value'));
                        if (typeof(er) == "string") {
                            alertOrAddError(inp.attr('name'), er);
                            return;
                        }
                    }

                    rlines.push([["Field name", csv_url_encode(inp.attr('name'))],
                                 ["Field value", csv_url_encode(inp.attr('value'))]]);
                }

                var checks = $(dom).find("input[type=checkbox]");
                for (var i = 0; i < checks.length; ++i) {
                    var check = $(checks[i]);
 
                    // Checkboxes with the 'obligatory' class must be checked.
                    if (! check.attr('checked') && check.hasClass('obligatory')) {
                        alertOrAddError(check.attr('name'), t.obligatoryCheckboxErrorGenerator(check.attr('name')));
                        return;
                    }

                    rlines.push([["Field name", check.attr('name')],
                                 ["Field value", check.attr('checked') ? t.checkedValue : t.uncheckedValue]]);
                }

                var rads = $(dom).find("input[type=radio]");
                // Sort by name.
                var rgs = { };
                for (var i = 0; i < rads.length; ++i) {
                    var rad = $(rads[i]);
                    if (rad.attr('name')) {
                        if (! rgs[rad.attr('name')])
                            rgs[rad.attr('name')] = [];
                        rgs[rad.attr('name')].push(rad);
                    }
                }
                for (k in rgs) {
                    // Check if it's oblig.
                    var oblig = false;
                    var oneIsSelected = false;
                    var oneThatWasSelected;
                    var val;
                    for (var i = 0; i < rgs[k].length; ++i) {
                        if (rgs[k][i].hasClass('obligatory')) oblig = true;
                        if (rgs[k][i].attr('checked')) {
                            oneIsSelected = true;
                            oneThatWasSelected = i;
                            val = rgs[k][i].attr('value');
                        }
                    }
                    if (oblig && (! oneIsSelected)) {
                        alertOrAddError(rgs[k][0].attr('name'), t.obligatoryRadioErrorGenerator(rgs[k][0].attr('name')));
                        return;
                    }
                    if (oneIsSelected) {
                        rlines.push([["Field name", rgs[k][0].attr('name')],
                                     ["Field value", rgs[k][oneThatWasSelected].attr('value')]]);
                    }
                }

                if (t.saveReactionTime) {
                    rlines.push([["Field name", "_REACTION_TIME_"],
                                 ["Field value", answerTime - t.creationTime]]);
                }
                t.finishedCallback(rlines);
            }
        }

        var dom = htmlCodeToDOM(this.html, function (dom) {
            HAS_LOADED = true;

            if (t.continueOnReturn) {
                t.safeBind($(dom).find("input[type=text]"), 'keydown', function (e) { if (e.keyCode == 13) { console.log("H"); return handler(e);  } });
                // TODO Add other keys (1, 2) here too.

            }
        });
        window.handler = handleClick(dom);

        this.element.append(dom);

        if (this.continueMessage) {
            this.element.append($("<p style='visibility: hidden'>").append($("<a>").attr('href', '').attr('id', 'continue-link').text("\u2192 " + this.continueMessage)
                                                .addClass(ibex_controller_name_to_css_prefix("Message") + "continue-link")
                                                .click(window.handler)));
        }

        this.creationTime = new Date().getTime();
    }
},

properties: {
    obligatory: ["html"],
    countsForProgressBar: false,
    htmlDescription: function (opts) {
        return htmlCodeToDOM(opts.html);
    }
}
});


// Helper function for delayed hiding/showing
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



// For keyboard shortcuts of radio buttons
window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 49 || key == 50) {
        if (document.getElementById("item_" + (key-48))) {
            document.getElementById("item_" + (key-48)).click()
        }
    }
}



async function toggleAnswerRadio(element) {
    await sleep(100)
    document.getElementById("continue-link").click()
}


async function init() {

    // Store invisible answers
    document.getElementById("cat1").value = window.categories[0];
    document.getElementById("cat2").value = window.categories[1];
    document.getElementById("cat3").value = window.categories[2];
    document.getElementById("cat4").value = window.categories[3];

    // Store visible answers
    document.getElementById("cat1s").innerHTML = window.categories[0];
    document.getElementById("cat2s").innerHTML = window.categories[1];
    document.getElementById("cat3s").innerHTML = window.categories[2];
    document.getElementById("cat4s").innerHTML = window.categories[3];

    await sleep(200)

    document.getElementById("item").style.visibility = "visible"

};

