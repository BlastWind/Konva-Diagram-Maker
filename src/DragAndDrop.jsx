import React, { Component } from "react";
import cloudPic from "./download.png";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { imageSrc: null, displayThumbnail: cloudPic };
  }

  handleFileInput = event => {
    this.setState(
      { imageSrc: URL.createObjectURL(event.target.files[0]) },
      () => {
        console.log(this.state.imageSrc);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <DragAndDrop
          handleDrop={file => {
            this.setState({ displayThumbnail: URL.createObjectURL(file) });
          }}
        >
          <img
            src={this.state.displayThumbnail}
            style={{
              width: "384px",
              height: "216px",
              marginLeft: "auto",
              marginRight: "auto",
              display: "block"
            }}
          />

          <span
            style={{
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              display: "block",
              lineHeight: "1.3rem"
            }}
          >
            Drop image here
          </span>
        </DragAndDrop>
      </React.Fragment>
    );
  }
}

class DragAndDrop extends Component {
  dropRef = React.createRef();
  handleDrag = e => {
    console.log("drag over");
    e.preventDefault();
    e.stopPropagation();
  };
  state = {
    dragging: false
  };
  handleDragIn = e => {
    console.log("drag entered");

    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ dragging: true });
    }
  };
  handleDragOut = e => {
    console.log("drag leaved");
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter > 0) return;
    this.setState({ dragging: false });
  };
  handleDrop = event => {
    console.log("dropped");

    event.preventDefault();
    event.stopPropagation();
    this.setState({ drag: false });
    if (event.dataTransfer.files && event.dataTransfer.files.length === 1) {
      this.props.handleDrop(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
      this.dragCounter = 0;
      this.setState({ dragging: false });
    }
  };
  componentDidMount() {
    this.dragCounter = 0;
    let div = this.dropRef.current;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
  }
  componentWillUnmount() {
    let div = this.dropRef.current;
    div.removeEventListener("dragenter", this.handleDragIn);
    div.removeEventListener("dragleave", this.handleDragOut);
    div.removeEventListener("dragover", this.handleDrag);
    div.removeEventListener("drop", this.handleDrop);
  }
  render() {
    return (
      <div
        style={{ display: "inline-block", position: "relative" }}
        ref={this.dropRef}
      >
        {this.state.dragging && (
          <div
            style={{
              border: "dashed grey 4px",
              backgroundColor: "rgba(255,255,255,.8)",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: 0,
                left: 0,
                textAlign: "center",
                color: "grey",
                fontSize: 36
              }}
            >
              <div>Drop it like it's hot :)</div>
            </div>
          </div>
        )}
        {this.props.children}
      </div>
    );
  }
}

export default App;
