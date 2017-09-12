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
      watchFileName: "",
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
  onStopFileWatch = () => {
    this.setState({ watchingFile: false, watchFileName: "" });
  }
  onStartFileWatch = (filename) => {
    this.setState({ watchingFile: true, watchFileName: filename });
  }
  onLoad = (editor) => {
    editor.scrollToLine(1, true, true, () => {});
    editor.gotoLine(1, 0, true);
    editor.focus();
  }
  renderOverlay() {
    return (
      <div className="WatchFileOverlayContainer">
        <div className="WatchFileOverlay"/>
        <div className="WatchFileOverlayMessage">
          <div>Currently watching:</div>
          <div>{ this.state.watchFileName }</div>
          <div>Any changes made to the file will be imported, and a new game will be started. Press the eye button again to stop.</div>
        </div>
      </div>
    );
  }
  render() {
    let watchFileOverlay;
    if (this.state.watchingFile) {
      watchFileOverlay = this.renderOverlay();
    }
    return (
      <Pane>
        <EditorControls
          onRun={ this.props.onRun }
          onManageAIs={ this.openModal }
          onOpenGameOptions={ this.openGameOptionsModal }
          onDownload={ this.props.onDownload }
          updatePlayerCode={ this.props.updatePlayerCode }
          watchingFile={ this.state.watchingFile }
          watchFileName={ this.state.watchFileName }

          onStopFileWatch={ this.onStopFileWatch }
          onStartFileWatch={ this.onStartFileWatch }
        />
        <PaneContent>
          { watchFileOverlay }
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
