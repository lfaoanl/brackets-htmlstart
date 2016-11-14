function getDoctypeCommand(editor) {
    var document    = editor.document,
        start       = pos.ch,
        end         = pos.ch,
        line        = document.getLine(pos.line),
        pos         = editor.getCursorPos(),
        command     = "";

    while (start > 0 && (/\S/).test(line.charAt(start - 1))) {
        --start;
    }

    command = document.getRange({line: pos.line, ch: start}, {line: pos.line, ch: end});

    if (command.match(/doctype/)) {
        command = command.substring(command.match(/doctype/).index);
    }

    return ((command.split("_")[0] === "doctype") ? command : "");
}

function handleKeyEvent(jqEvent, editor, event) {
    var command     = "",
        text        = "",
        start       = 0,
        end         = 0,
        codemirror  = null,
        i           = 0,
        filename    = editor.document.file._name;

    if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB) && allowedExtensions.indexOf(filename.substr(filename.lastIndexOf("."))) != -1) {
        command = getDoctypeCommand(editor);
        if (command) {
            text    = doctypeText;
            end     = editor.getCursorPos();
            start   = {line: end.line, ch: end.ch - command.length};
            editor.document.replaceRange(text, start, end);

            // Fix the line indentation
            codemirror = editor._codeMirror;
            if (codemirror) {
                end = editor.getCursorPos();
                for (i = (start.line); i <= end.line; i++) {
                    codemirror.indentLine(i);
                }
            }

            event.preventDefault();
        }
    }
}

    function editorListener(event, newEditor, oldEditor) {
        if (newEditor) {
            $(newEditor).on("keyEvent", handleKeyEvent);
        }

        if (oldEditor) {
            $(oldEditor).off("keyEvent", handleKeyEvent);
        }
    }
define(function (require, exports, module) {
    "use strict";

    /*
    *   Brackets modules
    */
    var KeyEvent        = brackets.getModule("utils/KeyEvent"),
        EditorManager   = brackets.getModule("editor/EditorManager");

    var allowedExtensions = [
        ".php",
        ".html"
    ];
    var doctypeText = "<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n</body>\n</html>";



    $(EditorManager).on("activeEditorChange", editorListener);
    $(EditorManager.getCurrentFullEditor()).on("keyEvent", handleKeyEvent);
});
