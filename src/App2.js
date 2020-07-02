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
  state = { dragging: false };

  handleDragEnter = event => {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter++;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      this.setState({ dragging: true });
    }
  };

  handleDragLeave = event => {
    event.preventDefault();
    event.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter > 0) return; //exit early without setting dragging to false
    this.setState({ dragging: false });
  };

  handleDragOver = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  handleDrop = event => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files.length === 1) {
      this.props.handleDrop(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
      this.dragCounter = 0;
      this.setState({ dragging: false });
    }
  };

  componentDidMount() {
    this.dragCounter = 0;

    let bigDiv = this.dropRef.current;
    bigDiv.addEventListener("dragenter", this.handleDragEnter);

    bigDiv.addEventListener("dragleave", this.handleDragLeave);
    bigDiv.addEventListener("drop", this.handleDrop);
    bigDiv.addEventListener("dragover", this.handleDragOver);
  }
  componentWillMount() {
    //remove the aevent listeners
  }

  render() {
    return (
      <div
        ref={this.dropRef}
        style={{ display: "inline-block", position: "relative" }}
      >
        {this.state.dragging && (
          <div
            style={{
              border: "dashed grey 1px",
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
              <span>Drop it like it's hot :)</span>
            </div>
          </div>
        )}

        {this.props.children}
      </div>
    );
  }
}

export default App;
