import { Plugin, Editor } from 'obsidian'; 

export default class EmDashReplacePlugin extends Plugin {
    onload() {
        this.registerEvent(
            this.app.workspace.on('editor-change', (editor: Editor) => {
                const cursor = editor.getCursor();
                if (!cursor) return;
				
                if (cursor.ch >= 2) {
                    const lastThree = editor.getRange(
                        { line: cursor.line, ch: cursor.ch - 3 },
                        { line: cursor.line, ch: cursor.ch }
                    );

                    if (lastThree === " --") {
                        if (this.cursorInCode(editor)) {
                            return;
                        }

						editor.replaceRange("—",
                            { line: cursor.line, ch: cursor.ch - 2 },
                            { line: cursor.line, ch: cursor.ch }
                        );
                        editor.setCursor({ line: cursor.line, ch: cursor.ch - 1 });
                    }
                }
            })
        );
    }

    /**
     * Checks if the cursor is inside a code block (```) or inline code (`)
     * @param editor - Obsidian editor
     * @returns true, if cursor is inside code block or inline code, otherwise false
     */
    cursorInCode(editor: Editor): boolean {
        const cursor = editor.getCursor();
        if (!cursor) return false;

        const currentLine = editor.getLine(cursor.line);
        if (!currentLine) return false;

        const beforeCursor = currentLine.substring(0, cursor.ch);
        const inlineCodeMatches = (beforeCursor.match(/`/g) || []).length;
        if (inlineCodeMatches % 2 === 1) {
            const afterCursor = currentLine.substring(cursor.ch);
            if (!afterCursor.startsWith('``')) {
                return true;
            }
        }

        const doc = editor.getValue();
        const lines = doc.split('\n');
        let inCodeBlock = false;
        let codeBlockDelimiter = '';

        for (let i = 0; i <= cursor.line; i++) {
            const line = lines[i];
            if (!line) continue;

            const codeBlockMatch = line.match(/^(`{3,}|~{3,})(\w*)/);
            if (codeBlockMatch && codeBlockMatch[1]) {
                const delimiter = codeBlockMatch[1];

				if (i === cursor.line) {
                    const delimiterPos = line.indexOf(delimiter);
                    if (delimiterPos !== -1 && delimiterPos < cursor.ch) {
						if (inCodeBlock && delimiter === codeBlockDelimiter) {
                            inCodeBlock = false;
                            codeBlockDelimiter = '';
                        } else if (!inCodeBlock) {
                            inCodeBlock = true;
                            codeBlockDelimiter = delimiter;
                        }
                    }
                } else {
                    if (inCodeBlock && delimiter === codeBlockDelimiter) {
                        inCodeBlock = false;
                        codeBlockDelimiter = '';
                    } else if (!inCodeBlock) {
                        inCodeBlock = true;
                        codeBlockDelimiter = delimiter;
                    }
                }
            }
        }

        return inCodeBlock;
    }
}
