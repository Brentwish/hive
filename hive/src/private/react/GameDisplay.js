import React, { Component } from 'react';
import _ from "lodash";
import "./GameDisplay.css";

class GameDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curDown: false,
      curXPos: 0,
      curYPos: 0,
    }
  }
  componentWillMount = () => {
    this.delayedCallback = _.debounce((deltaY) => {
      if (deltaY < 0) {
        /* scrolling up */
        this.props.onZoomIn();
      } else {
      /* scrolling down */
        this.props.onZoomOut();
      }
    }, 25);
  }
  onMouseMove = (e) => {
    if (this.state.curDown) {
      this.props.onPan(
        this.state.curXPos - e.nativeEvent.pageX,
        this.state.curYPos - e.nativeEvent.pageY
      )
    }
  }
  onMouseUp = () => {
    this.setState({ curDown: false });
  }
  onMouseDown = (e) => {
    let x = Math.floor(e.nativeEvent.offsetX / this.props.pixelScale);
    let y = Math.floor(e.nativeEvent.offsetY / this.props.pixelScale);
    this.props.onTileSelect(x, y);
    this.setState({
      curDown: true,
      curXPos: e.nativeEvent.pageX,
      curYPos: e.nativeEvent.pageY,
    });
  }
  onScroll = (e) => {
    if (Math.abs(e.nativeEvent.deltaY) > 10) {
      this.delayedCallback(e.nativeEvent.deltaY);
    }
    e.preventDefault();
  }
  renderUpdates() {
    const ctx = this._canvas.getContext('2d');
    const updatedTiles = window.hive.getUpdatedTiles();
    if (updatedTiles.length > 0) {
      updatedTiles.forEach((tile) => {
        ctx.clearRect(
          this.props.pixelScale * tile.x,
          this.props.pixelScale * tile.y,
          this.props.pixelScale,
          this.props.pixelScale
        );
        ctx.fillStyle = tile.color(this.props.showTrails);
        ctx.fillRect(
          this.props.pixelScale * tile.x,
          this.props.pixelScale * tile.y,
          this.props.pixelScale,
          this.props.pixelScale
        );
      });
      window.hive.clearUpdatedTiles();
    }
  }
  renderAll = () => {
    const ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (var i = 0; i < window.hive.board.width; i++) {
      for (var j = 0; j < window.hive.board.height; j++) {
        ctx.fillStyle = window.hive.board.tiles[i][j].color(this.props.showTrails);
        ctx.fillRect(
          this.props.pixelScale * i,
          this.props.pixelScale * j,
          this.props.pixelScale,
          this.props.pixelScale
        );
      }
    }
  }
  render() {
    return (
      <div className="GameDisplay" ref={ (d) => this._div = d }>
        <canvas
          ref={ (c) => this._canvas = c }
          className="game_board"
          onMouseDown={ this.onMouseDown }
          onMouseUp={ this.onMouseUp }
          onMouseMove={ this.onMouseMove }
          onWheel={ this.onScroll }
          width={ this.props.gameWidth * this.props.pixelScale }
          height={ this.props.gameHeight * this.props.pixelScale }>
        </canvas>
      </div>
    );
  }
}

export default GameDisplay;
