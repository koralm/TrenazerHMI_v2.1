var simulateTyping = "Hello World!!1\b";

$('#keyboard').keyboard({
    // *** choose layout & positioning ***
    // choose from 'qwerty', 'alpha', 'international', 'dvorak', 'num' or
    // 'custom' (to use the customLayout below)
    layout: 'qwerty',
    customLayout: {
        'default': [
            'd e f a u l t',
            '{meta1} {meta2} {accept} {cancel}'
        ],
        'meta1': [
            'm y m e t a 1',
            '{meta1} {meta2} {accept} {cancel}'
        ],
        'meta2': [
            'M Y M E T A 2',
            '{meta1} {meta2} {accept} {cancel}'
        ]
    },
    position: {
        of: null, // null = attach to input/textarea; use $(sel) to attach elsewhere
        my: 'center top',
        at: 'center top',
        at2: 'center bottom' // used when "usePreview" is false
    },

    // true: preview added above keyboard; false: original input/textarea used
    usePreview: true,

    // if true, the keyboard will always be visible
    alwaysOpen: false,

    // if true, keyboard will remain open even if the input loses focus.
    stayOpen: false,

    // *** change keyboard language & look ***
    display: {
        'meta1' : '\u2666', // Diamond
        'meta2' : '\u2665', // Heart
        'a'     : '\u2714:Accept (Shift-Enter)', // check mark (accept)
        'accept': 'Accept:Accept (Shift-Enter)',
        'alt'   : 'AltGr:Alternate Graphemes',
        'b'     : '\u2190:Backspace', // Left arrow (same as &larr;)
        'bksp'  : 'Bksp:Backspace',
        'c'     : '\u2716:Cancel (Esc)', // big X, close/cancel
        'cancel': 'Cancel:Cancel (Esc)',
        'clear' : 'C:Clear', // clear num pad
        'combo' : '\u00f6:Toggle Combo Keys',
        'dec'   : '.:Decimal', // num pad decimal '.' (US) & ',' (EU)
        'e'     : '\u21b5:Enter', // down, then left arrow - enter symbol
        'enter' : 'Enter:Enter',
        's'     : '\u21e7:Shift', // thick hollow up arrow
        'shift' : 'Shift:Shift',
        'sign'  : '\u00b1:Change Sign', // +/- sign for num pad
        'space' : ' :Space',
        't'     : '\u21e5:Tab', // right arrow to bar
        'tab'   : '\u21e5 Tab:Tab' // \u21b9 is the true tab symbol
    },

    // Message added to the key title while hovering, if the mousewheel plugin exists
    wheelMessage: 'Use mousewheel to see other keys',

    // Class added to the Accept and cancel buttons (originally 'ui-state-highlight')
    actionClass: 'ui-state-active',

    // *** Useability ***
    // Auto-accept content when clicking outside the keyboard (popup will close)
    autoAccept: false,

    // Prevents direct input in the preview window when true
    lockInput: false,

    // Prevent keys not in the displayed keyboard from being typed in
    restrictInput: false,

    // Prevent pasting content into the area
    preventPaste: false,

    // Set the max number of characters allowed in the input, setting it to false disables this option
    maxLength: false,

    // Event (namespaced) on the input to reveal the keyboard. To disable it, just set it to ''.
    openOn: 'focus',

    // Event (namepaced) for when the character is added to the input (clicking on the keyboard)
    keyBinding: 'mousedown',

    // combos (emulate dead keys)
    // if user inputs `a the script converts it to à, ^o becomes ô, etc.
    useCombos: true,
    // if you add a new combo, you may need to update the regex below
    combos: {
// uncomment out the next line, then read the Combos Regex section below
//        '<': { 3: '\u2665' }, // turn <3 into ♥ - change regex below
        'a': { e: "\u00e6" }, // ae ligature
        'A': { E: "\u00c6" },
        'o': { e: "\u0153" }, // oe ligature
        'O': { E: "\u0152" }
    },

    // *** Methods ***
    // Callbacks - attach a function to any of these callbacks as desired
    initialized: function(e, keyboard, el) {},
    accepted: function(e, keyboard, el) {},
    canceled: function(e, keyboard, el) {},
    hidden: function(e, keyboard, el) {},
    visible: function(e, keyboard, el) {},
    beforeClose: function(e, keyboard, el, accepted) {}

})
// activate the typing extension
    .addTyping();

/* Combos Regex -
 Normally you would change $.keyboard.comboRegex before initializing the keyboard because it stores the current regex, but for this demo I moved it to the bottom and thus you need to change the stored regex.

 This regex is used to match combos to combine, the first part looks for the accent/letter and the second part matches the following letter
 ( first part )( 2nd )  */
$('#keyboard').getkeyboard().regex = /([`\'~\^\"ao])([a-z])/mig;

/* so lets say you want to do something crazy like turn "<3" into a heart. Add this to the combos '<' : { 3:"\u2665" } and add a comma to the end if needed. Then change the regex to this: /([<`\'~\^\"ao])([a-z3])/mig;

 if you look close, all that was added was "<" to the beginning of the first part; some characters need to be escaped with a backslash in front because they mean something else in regex. The second part has a 3 added after the 'a-z', so that should cover both parts :P */
