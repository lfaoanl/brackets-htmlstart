define(function (require, exports, module) {
    "use strict";

    /*
     *   Brackets modules
     */
    var KeyEvent = brackets.getModule("utils/KeyEvent"),
        EditorManager = brackets.getModule("editor/EditorManager");

    var allowedExtensions = [
        ".php",
        ".html"
    ];
    var doctypeText = "<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n</body>\n</html>";
    var command = "doctype";

    function getCommand(editor) {
        var document    = editor.document,
            pos         = editor.getCursorPos(),
            line        = document.getLine(pos.line),
            start       = pos.ch,
            end         = pos.ch,
            cmnd        = false;

        while (start > 0 && (/\S/).test(line.charAt(start - 1))) {
            --start;
        }

        cmnd = document.getRange({line: pos.line, ch: start}, {line: pos.line, ch: end});

        if (cmnd.match(/doctype/)) {
            cmnd = cmnd.substring(cmnd.match(/doctype/).index);
        }

        return cmnd === command ? true : false;
    }

    function handleKeyEvent(jqEvent, editor, event) {
        var cmnd = false,
            text = "",
            start = 0,
            end = 0,
            codemirror = null,
            i = 0,
            filename = editor.document.file._name;

        if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB) && allowedExtensions.indexOf(filename.substr(filename.lastIndexOf("."))) != -1) {
            cmnd = getCommand(editor);
            if (cmnd) {
                text = doctypeText;
                end = editor.getCursorPos();
                start = {
                    line: end.line,
                    ch: end.ch - command.length
                };
                editor.document.replaceRange(text, start, end);
            }
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

    function editorListener(event, newEditor, oldEditor) {
        if (newEditor) {
            $(newEditor).on("keyEvent", handleKeyEvent);
        }

        if (oldEditor) {
            $(oldEditor).off("keyEvent", handleKeyEvent);
        }
    }

    $(EditorManager).on("activeEditorChange", editorListener);
    $(EditorManager.getCurrentFullEditor()).on("keyEvent", handleKeyEvent);
});
