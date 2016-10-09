'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    //atom.workspace.getActiveTextEditor().onWillSave () => this.addSemicolons()

    // Register command that toggles this
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'matlab-linter:add-semicolons': () => this.addSemicolons(),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  addSemicolons() {
    let editor = atom.workspace.getActiveTextEditor()
    if (editor){
      let path = editor.buffer.file.path
      let extension = path.split('.').pop()
      if (extension === 'm') {
        this.insertMissingSemicolons(editor)
      }

    }
  },

  insertMissingSemicolons(editor) {
    let oldCursorPos = editor.getCursorBufferPosition()
    let line
    for (let i = 0; i < editor.getLineCount(); i++) {
      line = editor.lineTextForBufferRow(i)

      line = line.trim()

      let lastChar = line[line.length - 1]

      if (lastChar === ';'){
        continue
      }
      else {
        let wordArr = line.split(' ')

        let firstWord = wordArr[0]

        const commentLine = line[0] === '%'
        const forLoop = firstWord === 'for' && wordArr[1] !== '='
        const functionHeader = firstWord === 'function'

        const emptyLine = firstWord == undefined || firstWord == ''
        const endLine = firstWord === 'end' && wordArr.length === 1
        const whileLoop = firstWord === 'while' && wordArr[1] !== '='

        if (!commentLine
          && !forLoop
          && !functionHeader
          && !endLine
          && !whileLoop
          && !emptyLine)
        {
          editor.setCursorBufferPosition([i, line.length])
          editor.insertText(';')
        }
      }
    }
    editor.setCursorBufferPosition(oldCursorPos)
  }




};
