//var shuffleSequence = seq("intro", "setcounter", sepWith("sep", seq(rshuffle("sim", "fil"))), "submit", "thanks");
//// For testing:
var shuffleSequence = seq(rshuffle("sim", "fil"));
var practiceItemTypes = ["practice"];

var defaults = [
    "Separator", {
        transfer: 300,
        ignoreFailure: true,
        normalMessage: "Which pair of categories are more related to each other? (You can use keyboard keys or mouse.)",
        errorMessage: "Wrong. Please wait for the next sentence."
    },
    "DashedSentence", {
        mode: "self-paced reading"
    },
    "AcceptabilityJudgment", {
        as: ["1", "2", "3", "4", "5", "6", "7"],
        presentAsScale: true,
        instructions: "Use number keys or click boxes to answer.",
        leftComment: "(Bad)", rightComment: "(Good)"
    },
    "Question", {
        q: "Which pair of categories are more related to each other? (You can use keyboard keys or mouse.)<br><br>",
        hasCorrect: true,
        randomOrder: true,
        // instructions: "(If neither pair is closely related, or both pairs are, choose the pair that is even slightly more related.)",
    },
    "Message", {
        hideProgressBar: true
    },
    "Form", {
        hideProgressBar: true,
        continueOnReturn: true,
        saveReactionTime: true
    },
    "RelatednessForm", {
        hideProgressBar: false,
        continueOnReturn: true,
        saveReactionTime: true,
        html: { include: "relatedness.html" },
    },
];

var items = [

    // New in Ibex 0.3-beta-9. You can now add a '__SendResults__' controller in your shuffle
    // sequence to send results before the experiment has finished. This is NOT intended to allow
    // for incremental sending of results -- you should send results exactly once per experiment.
    // However, it does permit additional messages to be displayed to participants once the
    // experiment itself is over. If you are manually inserting a '__SendResults__' controller into
    // the shuffle sequence, you must set the 'manualSendResults' configuration variable to 'true', since
    // otherwise, results are automatically sent at the end of the experiment.
    //
    //["sr", "__SendResults__", { }],

    ["sep", "Separator", { }],

    // New in Ibex 0.3-beta19. You can now determine the point in the experiment at which the counter
    // for latin square designs will be updated. (Previously, this was always updated upon completion
    // of the experiment.) To do this, insert the special '__SetCounter__' controller at the desired
    // point in your running order. If given no options, the counter is incremented by one. If given
    // an 'inc' option, the counter is incremented by the specified amount. If given a 'set' option,
    // the counter is set to the given number. (E.g., { set: 100 }, { inc: -1 })
    //
    //["setcounter", "__SetCounter__", { }],

    // NOTE: You could also use the 'Message' controller for the experiment intro (this provides a simple
    // consent checkbox).

    ["intro", "Form", {
        html: { include: "example_intro.html" },
    } ],


    ["submit", "__SendResults__", { }],

    ["thanks", "Message", {
        html: "<b>The results were successfully sent to the server. Thank you!</b><br><br><b>Your completion code for Mechanical Turk is: <mark style='font-size: 18pt'>tajine</mark></b>", // TODO Secretly replace this by the REAL code.
        transfer: null,
        },
    ],


    // The following is needed to do Latin Square through MTurk.
    // Taken from: https://tmalsburg.github.io/latin-squares-with-ibex.html
    ["setcounter", "__SetCounter__", { }],

    [["sim", 0], "RelatednessForm", {categories: ["constellation", "strait", "doctor of the church", "patron saint",], definitions: ["a configuration of stars as seen from the earth", "a narrow channel of the sea joining two larger bodies of water", "(Roman Catholic Church) a title conferred on 33 saints who distinguished themselves through the orthodoxy of their theological teaching", "a saint who is considered to be a defender of some group or nation",],},],
    [["sim", 1], "RelatednessForm", {categories: ["constellation", "strait", "doctor of the church", "patron saint",], definitions: ["a configuration of stars as seen from the earth", "a narrow channel of the sea joining two larger bodies of water", "(Roman Catholic Church) a title conferred on 33 saints who distinguished themselves through the orthodoxy of their theological teaching", "a saint who is considered to be a defender of some group or nation",],},],
    [["sim", 2], "RelatednessForm", {categories: ["constellation", "strait", "doctor of the church", "patron saint",], definitions: ["a configuration of stars as seen from the earth", "a narrow channel of the sea joining two larger bodies of water", "(Roman Catholic Church) a title conferred on 33 saints who distinguished themselves through the orthodoxy of their theological teaching", "a saint who is considered to be a defender of some group or nation",],},],
    [["sim", 3], "RelatednessForm", {categories: ["constellation", "strait", "doctor of the church", "patron saint",], definitions: ["a configuration of stars as seen from the earth", "a narrow channel of the sea joining two larger bodies of water", "(Roman Catholic Church) a title conferred on 33 saints who distinguished themselves through the orthodoxy of their theological teaching", "a saint who is considered to be a defender of some group or nation",],},],

];
