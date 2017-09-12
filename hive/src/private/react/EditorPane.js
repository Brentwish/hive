import React, { Component } from 'react';
import "./EditorPane.css"
import AIManagerModal from "./AIManagerModal.js";
import GameOptionsModal from "./GameOptionsModal.js";
import EditorControls from "./EditorControls.js";
import { Pane, PaneContent } from "./Pane.js";

import ace from "brace";
import brace from "brace";
import AceEditor from "react-ace";

import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/keybinding/vim';

import { Tab, Tabs } from "react-bootstrap";

class EditorPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      watchingFile: false,
      showModal: false,
      showGameOptionsModal: false,
    };
  }
  componentDidMount() {
    ace.config.loadModule('ace/keyboard/vim', (module) => {
      var VimApi = module.CodeMirror.Vim;
      VimApi.defineEx('write', 'w', (cm, input) => {
        this.props.onRun();
      });
    });
  }
  closeGameOptionsModal = () => {
    this.setState({ showGameOptionsModal: false });
  }
  openGameOptionsModal = () => {
    this.setState({ showGameOptionsModal: true });
  }
  closeModal = () => {
    this.setState({ showModal: false });
  }
  openModal = () => {
    this.setState({ showModal: true });
  }
  updatePlayerCodeFromFile = () => {
    let file;

    if (typeof window.FileReader !== 'function') {
      console.log("The file API isn't supported on this browser yet.");
      return;
    }

    const input = this._file;
    if (!input) {
      console.log("Um, couldn't find the filename element.");
    }
    else if (!input.files) {
      console.log("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      console.log("Please select a file before clicking 'Show Size'");
    } else {
      file = input.files[0];
      if (!this.state.fileLastModified || this.state.fileLastModified < file.lastModified) {
        const reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = ((theFile) => {
          return (e) => {
            this.props.updatePlayerCode(e.target.result);
            this.setState({ fileLastModified: theFile.lastModified });
            this.props.onRun();
          };
        })(file);

        reader.readAsText(file);
      }
    }
  }
  onLoad = (editor) => {
    editor.scrollToLine(1, true, true, () => {});
    editor.gotoLine(1, 0, true);
    editor.focus();
  }
  render() {
    return (
      <Pane>
        <EditorControls
          onRun={ this.props.onRun }
          onManageAIs={ this.openModal }
          onOpenGameOptions={ this.openGameOptionsModal }
          onDownload={ this.props.onDownload }
          changeHandler={ this.props.changeHandler }
        />
        <PaneContent>
          <AceEditor
            width={ "100%" }
            height={ "100%" }
            mode="javascript"
            theme="monokai"
            keyboardHandler="vim"
            onLoad={this.onLoad}
            onChange={ this.props.updatePlayerCode }
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={ this.props.playerCode }
            cursorStart={3}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </PaneContent>
        <AIManagerModal
          showModal={ this.state.showModal }
          close={ this.closeModal }
          addAI={ this.props.addAI }
          updateAI={ this.props.updateAI }
          selectAI={ this.props.selectAI }
          deleteAI={ this.props.deleteAI }
          AIs={ this.props.AIs }
        />
        <GameOptionsModal
          showModal={ this.state.showGameOptionsModal }
          close={ this.closeGameOptionsModal }
          width={ this.props.width }
          height={ this.props.height }
          sparsity={ this.props.sparsity }
          density={ this.props.density }
          saturation={ this.props.saturation }
          changeHandler={ this.props.changeHandler }
          startGame={ this.props.startGame }
          players={ this.props.players }
          AIs={ this.props.AIs }
          onAddPlayer={ this.props.onAddPlayer }
          removePlayer={ this.props.removePlayer }
          updatePlayer={ this.props.updatePlayer }
        />
      </Pane>
    );
  }
}

export default EditorPane;
