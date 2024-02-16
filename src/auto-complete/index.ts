import type * as Monaco from 'monaco-editor'

import { ImportAction } from './import-action'
import ImportCompletion from './import-completion'
import ImportDb from './import-db'

export let monaco: typeof Monaco

export interface Options {
  monaco: typeof Monaco
  editor: Monaco.editor.IStandaloneCodeEditor
}

class AutoImport {
  private readonly editor: Monaco.editor.IStandaloneCodeEditor
  public imports = new ImportDb()
  private disposables: Monaco.IDisposable[]

  constructor(options: Options) {
    monaco = options.monaco
    this.editor = options.editor

    this.attachCommands()
  }

  /**
   * Register the commands to monaco & enable auto-importation
   */
  public attachCommands() {
    this.disposables = new Array<Monaco.IDisposable>();

    const completor = new ImportCompletion(monaco, this.editor, this.imports)
    this.disposables.push(monaco.languages.registerCompletionItemProvider('javascript', completor))
    this.disposables.push(monaco.languages.registerCompletionItemProvider('typescript', completor))

    const actions = new ImportAction(this.editor, this.imports)
    this.disposables.push(monaco.languages.registerCodeActionProvider('javascript', actions as any))
    this.disposables.push(monaco.languages.registerCodeActionProvider('typescript', actions as any))
  }

  public dispose() {
    this.disposables.forEach(disposable => disposable.dispose())
  }
}

export default AutoImport
