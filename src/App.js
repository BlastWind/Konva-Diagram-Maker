//todo: allow for picture inside of rect/ellipse/stfar
//todo: connect using arrow
//todo: for rightToolBar, show fontSize,fontFamily for text for the rest allow to add pictures
//todo: zoomable
import React, { Component } from "react";

import {
  Stage,
  Layer,
  Rect,
  Transformer,
  Ellipse,
  Star,
  Text,
  Arrow
} from "react-konva";
import Connector from "./Connector.jsx";
import Toolbar from "./Toolbar.js";

import "./Graphics.css";

class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate() {
    this.checkNode();
  }
  checkNode() {
    const stage = this.transformer.getStage();

    const { selectedShapeName } = this.props;
    if (selectedShapeName === "") {
      this.transformer.detach();
      return;
    }
    const selectedNode = stage.findOne("." + selectedShapeName);
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      this.transformer.attachTo(selectedNode);
    } else {
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }
  render() {
    if (this.props.selectedShapeName.includes("text")) {
      var stuff = (
        <Transformer
          ref={node => {
            this.transformer = node;
          }}
          name="transformer"
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
          enabledAnchors={["middle-left", "middle-right"]}
        />
      );
    } else if (this.props.selectedShapeName.includes("star")) {
      var stuff = (
        <Transformer
          ref={node => {
            this.transformer = node;
          }}
          name="transformer"
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right"
          ]}
        />
      );
    } else if (this.props.selectedShapeName.includes("arrow")) {
      var stuff = (
        <Transformer
          ref={node => {
            this.transformer = node;
          }}
          name="transformer"
          resizeEnabled={false}
          rotateEnabled={false}
        />
      );
    } else {
      var stuff = (
        <Transformer
          ref={node => {
            this.transformer = node;
          }}
          name="transformer"
          keepRatio={true}
        />
      );
    }
    return stuff;
  }
}

var history = [];
var historyStep = 0;

class Graphics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layerX: 0,
      layerY: 0,
      layerScale: 1,
      selectedShapeName: "",
      errMsg: "",
      rectangles: [],
      ellipses: [],
      stars: [],
      texts: [],
      arrows: [],
      connectors: [],
      currentTextRef: "",
      shouldTextUpdate: true,
      textX: 0,
      textY: 0,
      textEditVisible: false,
      arrowDraggable: false,
      newArrowRef: "",
      count: 0,
      newArrowDropped: false,
      newConnectorDropped: false,
      arrowEndX: 0,
      arrowEndY: 0,
      isTransforming: false,
      lastFill: null,

      saving: null,
      saved: [],
      roadmapId: null,
      alreadyCreated: false,
      publishing: false,
      title: "",
      category: "",
      description: "",
      thumbnail: "",
      isPasteDisabled: false,
      ellipseDeleteCount: 0,
      starDeleteCount: 0,
      arrowDeleteCount: 0,
      textDeleteCount: 0,
      rectDeleteCount: 0
    };

    this.handleWheel = this.handleWheel.bind(this);

  }

  handleSave = () => {
    const rects = this.state.rectangles,
      ellipses = this.state.ellipses,
      stars = this.state.stars,
      texts = this.state.texts,
      arrows = this.state.arrows;
    if (
      JSON.stringify(this.state.saved) !==
      JSON.stringify([rects, ellipses, stars, texts, arrows])
    ) {
      this.setState({ saved: [rects, ellipses, stars, texts, arrows] });

      let arrows1 = this.state.arrows;
      arrows1.forEach(eachArrow => {
        //for "from & to of each arrow"
        if (eachArrow.from && eachArrow.from.attrs) {
          if (eachArrow.from.attrs.name.includes("text")) {
            eachArrow.from.textWidth = eachArrow.from.textWidth;

            eachArrow.from.textHeight = eachArrow.from.textHeight;
          }
        }
        if (eachArrow.to && eachArrow.to.attrs) {
          if (eachArrow.to.attrs.name.includes("text")) {
            eachArrow.to.attrs.textWidth = eachArrow.to.textWidth;
            eachArrow.to.attrs.textHeight = eachArrow.to.textHeight;
          }
        }
      });

      if (this.state.roadmapId) {
        //if draft already exists
        this.setState({ saving: true });
        fetch("/api/roadmap/modifyDraftDB", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roadmapId: this.state.roadmapId,

            data: {
              rects: rects,
              ellipses: ellipses,
              stars: stars,
              texts: texts,
              arrows: arrows1
            }
          })
        }).then(res => {
          this.setState({ saving: false });
        });
      } else {
        //if first time pressing sav
        this.setState({ saving: true });
        fetch("/api/roadmap/saveRoadmapToDB", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: this.props.auth.user.id,
            roadmapType: "draft",
            data: {
              rects: rects,
              ellipses: ellipses,
              stars: stars,
              texts: texts,
              arrows: arrows
            }
          })
        }).then(res =>
          res.json().then(data => {
            this.setState({ saving: false });
            this.setState({ roadmapId: data.roadmapId });
          })
        );
      }
    }
  };

  handleStageClick = e => {
    var pos = this.refs.layer2.getStage().getPointerPosition();
    var shape = this.refs.layer2.getIntersection(pos);

    console.log("texts", this.state.texts);

    if (
      shape !== null &&
      shape.name() !== undefined &&
      shape !== undefined &&
      shape.name() !== undefined
    ) {
      this.setState(
        {
          selectedShapeName: shape.name()
        },
        () => {
          this.refs.graphicStage.draw();
        }
      );
    }

    //arrow logic
    if (this.state.newArrowRef !== "") {
      if (this.state.previousShape) {
        if (this.state.previousShape.attrs.id !== "ContainerRect") {
          //console.log(this.refs.graphicStage.findOne("." + this.state.newArrowRef));
          //

          this.state.arrows.map(eachArrow => {
            if (eachArrow.name === this.state.newArrowRef) {
              eachArrow.to = this.state.previousShape;
            }
          });

          //console.log(newConnector, this.state.newArrowRef);
          //newConnector.setAttr("to", this.state.previousShape);
          //console.log(newConnector);
        }
      }

      //handle connector more
      //if the currentArrow ref has a from, and that e.target.attrs.id isn't containerRect,
      //then find the current shape with stage find name and then yeah
      this.state.arrows.map(eachArrow => {
        if (eachArrow.name === this.state.newArrowRef) {
          eachArrow.fill = "black";
          eachArrow.stroke = "black";
        }
      });
      //arrow logic, there's e.evt.pageX, pageY
      this.setState({
        arrowDraggable: false,
        newArrowRef: ""
      });
    }
  };
  handleMouseOver = event => {
    //get the currennt arrow ref and modify its position by filtering & pushing again
    //console.log("lastFill: ", this.state.lastFill);
    var pos = this.refs.graphicStage.getPointerPosition();
    var shape = this.refs.graphicStage.getIntersection(pos);

    if (shape && shape.attrs.link) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }

    //if we are moving an arrow
    if (this.state.newArrowRef !== "") {
      //filling color logic:

      var transform = this.refs.layer2.getAbsoluteTransform().copy();
      transform.invert();

      pos = transform.point(pos);
      this.setState({ arrowEndX: pos.x, arrowEndY: pos.y });
      //last non arrow object
      if (shape && shape.attrs && shape.attrs.name != undefined) {
        //  console.log(shape);
        if (!shape.attrs.name.includes("arrow")) {
          //after first frame
          if (this.state.previousShape)
            if (this.state.previousShape !== shape) {
              //arrow entered a new shape

              //set current arrow to blue
              if (this.state.previousShape.attrs.id !== "ContainerRect") {
                this.state.arrows.map(eachArrow => {
                  if (eachArrow.name === this.state.newArrowRef) {
                    eachArrow.fill = "black";
                    eachArrow.stroke = "black";
                  }
                });
                this.forceUpdate();
              } else {
                this.state.arrows.map(eachArrow => {
                  if (eachArrow.name === this.state.newArrowRef) {
                    eachArrow.fill = "#ccf5ff";
                    eachArrow.stroke = "#ccf5ff";
                  }
                });
                this.forceUpdate();
              }
            }
          //if arrow is moving in a single shape
        }

        if (!shape.attrs.name.includes("arrow")) {
          this.setState({ previousShape: shape });
        }
      }
    }
    var arrows = this.state.arrows;

    arrows.map(eachArrow => {
      if (eachArrow.name === this.state.newArrowRef) {
        var index = arrows.indexOf(eachArrow);
        let currentArrow = eachArrow;
        currentArrow.points = [
          currentArrow.points[0],
          currentArrow.points[1],
          pos.x,
          pos.y
          /*  event.evt.pageY -
            document.getElementById("NavBar").getBoundingClientRect().height */
        ];

        this.state.arrows[index] = currentArrow;
      }
    });
  };
  handleWheel(event) {
    if (
      this.state.rectangles.length === 0 &&
      this.state.ellipses.length === 0 &&
      this.state.stars.length === 0 &&
      this.state.texts.length === 0 &&
      this.state.arrows.length === 0
    ) {
    } else {
      event.evt.preventDefault();
      const scaleBy = 1.2;
      const stage = this.refs.graphicStage;
      const layer = this.refs.layer2;
      const oldScale = layer.scaleX();
      const mousePointTo = {
        x:
          stage.getPointerPosition().x / oldScale -
          this.state.layerX / oldScale,
        y:
          stage.getPointerPosition().y / oldScale - this.state.layerY / oldScale
      };

      const newScale =
        event.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

      layer.scale({ x: newScale, y: newScale });

      /*  console.log(
        oldScale,
        mousePointTo,
        stage.getPointerPosition().x,
        stage.getPointerPosition().y
      );
    */
      this.setState({
        layerScale: newScale,
        layerX:
          -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
          newScale,
        layerY:
          -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    let prevMainShapes = [
      prevState.rectangles,
      prevState.ellipses,
      prevState.stars,
      prevState.arrows,
      prevState.connectors,
      prevState.texts
    ];
    let currentMainShapes = [
      this.state.rectangles,
      this.state.ellipses,
      this.state.stars,
      this.state.arrows,
      this.state.connectors,
      this.state.texts
    ];

    if (!this.state.redoing && !this.state.isTransforming)
      if (JSON.stringify(this.state) !== JSON.stringify(prevState)) {
        if (
          JSON.stringify(prevMainShapes) !== JSON.stringify(currentMainShapes)
        ) {
          //if text shouldn't update, don't append to  history
          if (this.state.shouldTextUpdate) {
            var uh = history;
            history = uh.slice(0, historyStep + 1);
            //console.log("sliced", history);
            var toAppend = this.state;
            history = history.concat(toAppend);
            //console.log("new", history);
            historyStep += 1;
            //console.log(history, historyStep, history[historyStep]);
          }
        }
      } else {
        //console.log("compoenntDidUpdate but attrs didn't change");
      }
    this.state.redoing = false;
  }

  handleUndo = () => {
    if (!this.state.isTransforming) {
      if (!this.state.textEditVisible) {
        if (historyStep === 0) {
          return;
        }
        historyStep -= 1;

        this.setState(
          {
            rectangles: history[historyStep].rectangles,
            arrows: history[historyStep].arrows,
            ellipses: history[historyStep].ellipses,
            stars: history[historyStep].stars,
            texts: history[historyStep].texts,
            connectors: history[historyStep].connectors,
            redoing: true,
            selectedShapeName: this.shapeIsGone(history[historyStep])
              ? ""
              : this.state.selectedShapeName
          },
          () => {
            this.refs.graphicStage.draw();
          }
        );
      }
    }
  };

  handleRedo = () => {
    if (historyStep === history.length - 1) {
      return;
    }
    historyStep += 1;
    const next = history[historyStep];
    this.setState(
      {
        rectangles: next.rectangles,
        arrows: next.arrows,
        ellipses: next.ellipses,
        stars: next.stars,
        texts: next.texts,
        redoing: true,
        selectedShapeName: this.shapeIsGone(history[historyStep])
          ? ""
          : this.state.selectedShapeName
      },
      () => {
        this.forceUpdate();
      }
    );
  };

  shapeIsGone = returnTo => {
    var toReturn = true;
    let currentShapeName = this.state.selectedShapeName;
    let [rectangles, ellipses, stars, arrows, texts] = [
      returnTo.rectangles,
      returnTo.ellipses,
      returnTo.stars,
      returnTo.arrows,

      returnTo.texts
    ];
    rectangles.map(eachRect => {
      if (eachRect.name === currentShapeName) {
        toReturn = false;
      }
    });
    ellipses.map(eachEllipse => {
      if (eachEllipse.name === currentShapeName) {
        toReturn = false;
      }
    });
    stars.map(eachStar => {
      if (eachStar.name === currentShapeName) {
        toReturn = false;
      }
    });
    arrows.map(eachArrow => {
      if (eachArrow.name === currentShapeName) {
        toReturn = false;
      }
    });

    texts.map(eachText => {
      if (eachText.name === currentShapeName) {
        toReturn = false;
      }
    });

    return toReturn;
  };
  IsJsonString = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  async componentDidMount() {
    history.push(this.state);
    this.setState({ selectedShapeName: "" });



    //if draft

  }

  render() {
    let saveText;

    let saving = this.state.saving;
    if (saving !== null) {
      if (saving) {
        saveText = <div style={{ color: "white" }}>Saving</div>;
      } else {
        saveText = <div style={{ color: "white" }}>Saved</div>;
      }
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    var gradient = ctx.createLinearGradient(0, 0, 100, 100);
    gradient.addColorStop(0.0, "red");
    gradient.addColorStop(1 / 6, "orange");
    gradient.addColorStop(2 / 6, "yellow");
    gradient.addColorStop(3 / 6, "green");
    gradient.addColorStop(4 / 6, "aqua");
    gradient.addColorStop(5 / 6, "blue");
    gradient.addColorStop(1.0, "purple");

    const errMsg = this.state.errMsg;
    let errDisplay;
    if (errMsg !== "") {
      errDisplay = (
        <div className="errMsginner">
          <span style={{ color: "white" }}>
            {errMsg !== "" ? errMsg : null}
          </span>
        </div>
      );
    } else {
    }

    const countryOptions = [
      { key: "1", value: "Machine Learning", text: "Machine Learning" },
      { key: "2", value: "Computer Science", text: "Computer Science" },
      {
        key: "3",
        value: "Software Engineering",
        text: "Software Engineering"
      },
      { key: "12", value: "Technology", text: "Technology" },
      { key: "4", value: "Engineering", text: "Engineering" },

      {
        key: "6",
        value: "Sciences and Mathematics",
        text: "Sciences and Mathematics"
      },
      {
        key: "7",
        value: "Law, Economics and Social Sciences",
        text: "Law, Economics and Social Sciences"
      },
      { key: "8", value: "Humanities", text: "Humanities" },
      {
        key: "9",
        value: "Linguistics and Cultural Studies",
        text: "Linguistics and Cultural Studies"
      },
      { key: "10", value: "Art and Music", text: "Art and Music" },
      { key: "11", value: "Lifestyle", text: "Lifestyle" },
      {
        key: "13",
        value: "Others",
        text: "Others"
      }
    ];

    return (
      <React.Fragment>
        <div
          onKeyDown={event => {
            const x = 88,
              deleteKey = 46,
              copy = 67,
              paste = 86,
              z = 90,
              y = 89;

            if (
              ((event.ctrlKey && event.keyCode === x) ||
                event.keyCode === deleteKey) &&
              !this.state.isPasteDisabled
            ) {
              if (this.state.selectedShapeName !== "") {
                var that = this;
                //delete it from the state too
                let name = this.state.selectedShapeName;
                let rectDeleted = false,
                  ellipseDeleted = false,
                  starDeleted = false,
                  arrowDeleted = false,
                  textDeleted = false;

                var rects = this.state.rectangles.filter(function(eachRect) {
                  if (eachRect.name === name) {
                    that.setState({
                      rectDeleteCount: that.state.rectDeleteCount + 1
                    });
                  }
                  return eachRect.name !== name;
                });

                var ellipses = this.state.ellipses.filter(function(eachRect) {
                  if (eachRect.name === name) {
                    that.setState({
                      ellipseDeleteCount: that.state.ellipseDeleteCount + 1
                    });
                  }
                  return eachRect.name !== name;
                });

                var stars = this.state.stars.filter(function(eachRect) {
                  if (eachRect.name === name) {
                    that.setState({
                      starDeleteCount: that.state.starDeleteCount + 1
                    });
                  }
                  return eachRect.name !== name;
                });

                var arrows = this.state.arrows.filter(function(eachRect) {
                  if (eachRect.name === name) {
                    that.setState({
                      arrowDeleteCount: that.state.arrowDeleteCount + 1
                    });
                  }
                  return eachRect.name !== name;
                });

                var texts = this.state.texts.filter(function(eachRect) {
                  if (eachRect.name === name) {
                    that.setState({
                      textDeleteCount: that.state.textDeleteCount + 1
                    });
                  }
                  return eachRect.name !== name;
                });

                this.setState({
                  rectangles: rects,
                  ellipses: ellipses,
                  stars: stars,
                  arrows: arrows,
                  texts: texts,
                  selectedShapeName: ""
                });
              }
            } else if (event.shiftKey && event.ctrlKey && event.keyCode === z) {
              this.handleRedo();
            } else if (event.ctrlKey && event.keyCode === z) {
              this.handleUndo();
            } else if (event.ctrlKey && event.keyCode === y) {
              this.handleRedo();
            } else if (event.ctrlKey && event.keyCode === copy) {
              if (this.state.selectedShapeName !== "") {
                //find it
                let name = this.state.selectedShapeName;
                let copiedElement = null;
                if (name.includes("rect")) {
                  copiedElement = this.state.rectangles.filter(function(
                    eachRect
                  ) {
                    return eachRect.name === name;
                  });
                } else if (name.includes("ellipse")) {
                  copiedElement = this.state.ellipses.filter(function(
                    eachRect
                  ) {
                    return eachRect.name === name;
                  });
                } else if (name.includes("star")) {
                  copiedElement = this.state.stars.filter(function(eachRect) {
                    return eachRect.name === name;
                  });
                } else if (name.includes("text")) {
                  copiedElement = this.state.texts.filter(function(eachRect) {
                    return eachRect.name === name;
                  });
                } else if (name.includes("arrow")) {
                  copiedElement = this.state.arrows.filter(function(eachRect) {
                    return eachRect.name === name;
                  });
                }

                this.setState({ copiedElement: copiedElement }, () => {
                  console.log("copied ele", this.state.copiedElement);
                });
              }
            } else if (
              event.ctrlKey &&
              event.keyCode === paste &&
              !this.state.isPasteDisabled
            ) {
              let copiedElement = this.state.copiedElement[0];
              console.log(copiedElement);
              var length;
              if (copiedElement) {
                if (copiedElement.attrs) {
                } else {
                  if (copiedElement.name.includes("rectangle")) {
                    length =
                      this.state.rectangles.length +
                      1 +
                      this.state.rectDeleteCount;
                    var toPush = {
                      x: copiedElement.x + 10,
                      y: copiedElement.y + 10,
                      width: copiedElement.width,
                      height: copiedElement.height,
                      stroke: copiedElement.stroke,
                      strokeWidth: copiedElement.strokeWidth,
                      name:
                        "rectangle" +
                        (this.state.rectangles.length +
                          this.state.rectDeleteCount +
                          1),
                      ref:
                        "rectangle" +
                        (this.state.rectangles.length +
                          this.state.rectDeleteCount +
                          1),
                      fill: copiedElement.fill,
                      useImage: copiedElement.useImage,
                      link: copiedElement.link,
                      rotation: copiedElement.rotation
                    };
                    let newName = this.state.selectedShapeName;

                    this.setState(
                      prevState => ({
                        rectangles: [...prevState.rectangles, toPush]
                      }),
                      () => {
                        this.setState({
                          selectedShapeName:
                            "rectangle" + this.state.rectangles.length
                        });
                      }
                    );
                  } else if (copiedElement.name.includes("arrow")) {
                    length =
                      this.state.arrows.length +
                      1 +
                      this.state.arrowDeleteCount;

                    if (copiedElement.to || copiedElement.from) {
                      this.setState(
                        {
                          errMsg: "Connectors cannot be pasted"
                        },
                        () => {
                          var that = this;
                          setTimeout(function() {
                            that.setState({
                              errMsg: ""
                            });
                          }, 1000);
                        }
                      );
                    } else {
                      var toPush = {
                        points: [
                          copiedElement.points[0] + 30,
                          copiedElement.points[1] + 30,
                          copiedElement.points[2] + 30,
                          copiedElement.points[3] + 30
                        ],
                        fill: copiedElement.fill,
                        link: copiedElement.link,
                        stroke: copiedElement.stroke,
                        strokeWidth: copiedElement.strokeWidth,
                        name:
                          "arrow" +
                          (this.state.arrows.length +
                            1 +
                            this.state.arrowDeleteCount),
                        ref:
                          "arrow" +
                          (this.state.arrows.length +
                            1 +
                            this.state.arrowDeleteCount),
                        rotation: copiedElement.rotation
                      };

                      let newName = this.state.selectedShapeName;

                      this.setState(
                        prevState => ({
                          arrows: [...prevState.arrows, toPush]
                        }),
                        () => {
                          this.setState({
                            selectedShapeName:
                              "arrow" + this.state.arrows.length
                          });
                        }
                      );
                    }
                  } else if (copiedElement.name.includes("ellipse")) {
                    length =
                      this.state.ellipses.length +
                      1 +
                      this.state.ellipseDeleteCount;
                    var toPush = {
                      x: copiedElement.x + 10,
                      y: copiedElement.y + 10,
                      radiusX: copiedElement.radiusX,
                      radiusY: copiedElement.radiusY,
                      stroke: copiedElement.stroke,
                      strokeWidth: copiedElement.strokeWidth,
                      name:
                        "ellipse" +
                        (this.state.ellipses.length +
                          1 +
                          this.state.ellipseDeleteCount),
                      ref:
                        "ellipse" +
                        (this.state.ellipses.length +
                          1 +
                          this.state.ellipseDeleteCount),
                      fill: copiedElement.fill,
                      link: copiedElement.link,
                      useImage: copiedElement.useImage,
                      rotation: copiedElement.rotation
                    };
                    let newName = this.state.selectedShapeName;

                    this.setState(
                      prevState => ({
                        ellipses: [...prevState.ellipses, toPush]
                      }),
                      () => {
                        this.setState({
                          selectedShapeName:
                            "ellipse" + this.state.ellipses.length
                        });
                      }
                    );
                  } else if (copiedElement.name.includes("star")) {
                    length =
                      this.state.stars.length + 1 + this.state.starDeleteCount;
                    var toPush = {
                      x: copiedElement.x + 10,
                      y: copiedElement.y + 10,
                      link: copiedElement.link,
                      innerRadius: copiedElement.innerRadius,
                      outerRadius: copiedElement.outerRadius,
                      stroke: copiedElement.stroke,
                      strokeWidth: copiedElement.strokeWidth,
                      name:
                        "star" +
                        (this.state.stars.length +
                          1 +
                          this.state.starDeleteCount),
                      ref:
                        "star" +
                        (this.state.stars.length +
                          1 +
                          this.state.starDeleteCount),
                      fill: copiedElement.fill,
                      useImage: copiedElement.useImage,
                      rotation: copiedElement.rotation
                    };
                    let newName = this.state.selectedShapeName;

                    this.setState(
                      prevState => ({
                        stars: [...prevState.stars, toPush]
                      }),
                      () => {
                        this.setState({
                          selectedShapeName: "star" + this.state.stars.length
                        });
                      }
                    );
                  } else if (copiedElement.name.includes("text")) {
                    length =
                      this.state.texts.length + 1 + this.state.textDeleteCount;
                    var toPush = {
                      x: copiedElement.x + 10,
                      y: copiedElement.y + 10,
                      link: copiedElement.link,

                      name:
                        "text" +
                        (this.state.texts.length +
                          1 +
                          this.state.textDeleteCount),
                      ref:
                        "text" +
                        (this.state.texts.length +
                          1 +
                          this.state.textDeleteCount),
                      fill: copiedElement.fill,
                      fontSize: copiedElement.fontSize,
                      fontFamily: copiedElement.fontFamily,
                      useImage: copiedElement.useImage,
                      text: copiedElement.text,
                      width: copiedElement.width,
                      rotation: copiedElement.rotation
                    };
                    let newName = this.state.selectedShapeName;

                    this.setState(
                      prevState => ({
                        texts: [...prevState.texts, toPush]
                      }),
                      () => {
                        this.setState(
                          {
                            selectedShapeName:
                              "text" +
                              (this.state.texts.length +
                                this.state.textDeleteCount)
                          },
                          () => {
                            console.log(this.state.selectedShapeName);
                          }
                        );
                      }
                    );
                  }
                }
              }
            }
          }}
          tabIndex="0"
          style={{ outline: "none" }}
        >
          <Stage
            onClick={this.handleStageClick}
            onMouseMove={this.handleMouseOver}
            onWheel={event => this.handleWheel(event)}
            height={window.innerHeight}
            width={window.innerWidth}
            ref="graphicStage"
          >
            <Layer
              scaleX={this.state.layerScale}
              scaleY={this.state.layerScale}
              x={this.state.layerX}
              y={this.state.layerY}
              height={window.innerHeight}
              width={window.innerWidth}
              draggable
              onDragEnd={() => {
                this.setState({
                  layerX: this.refs.layer2.x(),
                  layerY: this.refs.layer2.y()
                });
              }}
              ref="layer2"
            >
              <Rect
                x={-5 * window.innerWidth}
                y={-5 * window.innerHeight}
                height={window.innerHeight * 10}
                width={window.innerWidth * 10}
                name=""
                id="ContainerRect"
              />

              {this.state.rectangles.map(eachRect => {
                return (
                  <Rect
                    onClick={() => {
                      var that = this;
                      if (eachRect.link !== undefined && eachRect.link !== "") {
                        this.setState(
                          {
                            errMsg: "Links will not be opened in create mode"
                          },
                          () => {
                            setTimeout(function() {
                              that.setState({
                                errMsg: ""
                              });
                            }, 1000);
                          }
                        );
                      }
                    }}
                    onTransformStart={() => {
                      this.setState({
                        isTransforming: true
                      });
                      let rect = this.refs[eachRect.ref];
                      rect.setAttr("lastRotation", rect.rotation());
                    }}
                    onTransform={() => {
                      let rect = this.refs[eachRect.ref];

                      if (rect.attrs.lastRotation !== rect.rotation()) {
                        this.state.arrows.map(eachArrow => {
                          if (
                            eachArrow.to &&
                            eachArrow.to.name() === rect.name()
                          ) {
                            this.setState({
                              errMsg:
                                "Rotating rects with connectors might skew things up!"
                            });
                          }
                          if (
                            eachArrow.from &&
                            eachArrow.from.name() === rect.name()
                          ) {
                            this.setState({
                              errMsg:
                                "Rotating rects with connectors might skew things up!"
                            });
                          }
                        });
                      }

                      rect.setAttr("lastRotation", rect.rotation());
                    }}
                    onTransformEnd={() => {
                      this.setState({
                        isTransforming: false
                      });
                      let rect = this.refs[eachRect.ref];
                      this.setState(
                        prevState => ({
                          errMsg: "",
                          rectangles: prevState.rectangles.map(eachRect =>
                            eachRect.name === rect.attrs.name
                              ? {
                                  ...eachRect,
                                  width: rect.width() * rect.scaleX(),
                                  height: rect.height() * rect.scaleY(),
                                  rotation: rect.rotation(),
                                  x: rect.x(),
                                  y: rect.y()
                                }
                              : eachRect
                          )
                        }),
                        () => {
                          this.forceUpdate();
                        }
                      );

                      rect.setAttr("scaleX", 1);
                      rect.setAttr("scaleY", 1);
                    }}
                    rotation={eachRect.rotation}
                    ref={eachRect.ref}
                    fill={eachRect.fill}
                    name={eachRect.name}
                    x={eachRect.x}
                    y={eachRect.y}
                    width={eachRect.width}
                    height={eachRect.height}
                    stroke={eachRect.stroke}
                    strokeWidth={eachRect.strokeWidth}
                    strokeScaleEnabled={false}
                    draggable
                    onDragMove={() => {
                      this.state.arrows.map(eachArrow => {
                        if (eachArrow.from !== undefined) {
                          if (eachRect.name === eachArrow.from.attrs.name) {
                            eachArrow.points = [
                              eachRect.x,
                              eachRect.y,
                              eachArrow.points[2],
                              eachArrow.points[3]
                            ];
                            this.forceUpdate();
                          }
                        }

                        if (eachArrow.to !== undefined) {
                          if (eachRect.name == eachArrow.to.attrs.name) {
                            eachArrow.points = [
                              eachArrow.points[0],
                              eachArrow.points[1],
                              eachRect.x,
                              eachRect.y
                            ];
                            this.forceUpdate();
                          }
                        }
                      });
                    }}
                    onDragEnd={event => {
                      //cannot compare by name because currentSelected might not be the same
                      //have to use ref, which appears to be overcomplicated
                      var shape = this.refs[eachRect.ref];
                      /*    this.state.rectangles.map(eachRect => {
                          if (eachRect.name === shape.attrs.name) {
                            shape.position({
                              x: event.target.x(),
                              y: event.target.y()
                            });
                          }
                        });*/

                      this.setState(prevState => ({
                        rectangles: prevState.rectangles.map(eachRect =>
                          eachRect.name === shape.attrs.name
                            ? {
                                ...eachRect,
                                x: event.target.x(),
                                y: event.target.y()
                              }
                            : eachRect
                        )
                      }));
                    }}
                  />
                );
              })}
              {this.state.ellipses.map(eachEllipse => (
                <Ellipse
                  ref={eachEllipse.ref}
                  name={eachEllipse.name}
                  x={eachEllipse.x}
                  y={eachEllipse.y}
                  rotation={eachEllipse.rotation}
                  radiusX={eachEllipse.radiusX}
                  radiusY={eachEllipse.radiusY}
                  fill={eachEllipse.fill}
                  stroke={eachEllipse.stroke}
                  strokeWidth={eachEllipse.strokeWidth}
                  strokeScaleEnabled={false}
                  onClick={() => {
                    var that = this;
                    if (
                      eachEllipse.link !== undefined &&
                      eachEllipse.link !== ""
                    ) {
                      this.setState(
                        {
                          errMsg: "Links will not be opened in create mode"
                        },
                        () => {
                          setTimeout(function() {
                            that.setState({
                              errMsg: ""
                            });
                          }, 1000);
                        }
                      );
                    }
                  }}
                  onTransformStart={() => {
                    this.setState({ isTransforming: true });
                    let ellipse = this.refs[eachEllipse.ref];
                    ellipse.setAttr("lastRotation", ellipse.rotation());
                  }}
                  onTransform={() => {
                    let ellipse = this.refs[eachEllipse.ref];

                    if (ellipse.attrs.lastRotation !== ellipse.rotation()) {
                      this.state.arrows.map(eachArrow => {
                        if (
                          eachArrow.to &&
                          eachArrow.to.name() === ellipse.name()
                        ) {
                          this.setState({
                            errMsg:
                              "Rotating ellipses with connectors might skew things up!"
                          });
                        }
                        if (
                          eachArrow.from &&
                          eachArrow.from.name() === ellipse.name()
                        ) {
                          this.setState({
                            errMsg:
                              "Rotating ellipses with connectors might skew things up!"
                          });
                        }
                      });
                    }

                    ellipse.setAttr("lastRotation", ellipse.rotation());
                  }}
                  onTransformEnd={() => {
                    this.setState({ isTransforming: false });
                    let ellipse = this.refs[eachEllipse.ref];
                    let scaleX = ellipse.scaleX(),
                      scaleY = ellipse.scaleY();

                    this.setState(prevState => ({
                      errMsg: "",
                      ellipses: prevState.ellipses.map(eachEllipse =>
                        eachEllipse.name === ellipse.attrs.name
                          ? {
                              ...eachEllipse,

                              radiusX: ellipse.radiusX() * ellipse.scaleX(),
                              radiusY: ellipse.radiusY() * ellipse.scaleY(),
                              rotation: ellipse.rotation(),
                              x: ellipse.x(),
                              y: ellipse.y()
                            }
                          : eachEllipse
                      )
                    }));

                    ellipse.setAttr("scaleX", 1);
                    ellipse.setAttr("scaleY", 1);
                    this.forceUpdate();
                  }}
                  draggable
                  onDragMove={() => {
                    console.log(
                      "name of ellipse moving: ",
                      eachEllipse.name,
                      "new x y",
                      eachEllipse.x,
                      eachEllipse.y
                    );
                    this.state.arrows.map(eachArrow => {
                      if (eachArrow.from !== undefined) {
                        console.log("prevArrow: ", eachArrow.points);
                        if (eachEllipse.name == eachArrow.from.attrs.name) {
                          eachArrow.points = [
                            eachEllipse.x,
                            eachEllipse.y,
                            eachArrow.points[2],
                            eachArrow.points[3]
                          ];
                          this.forceUpdate();
                          this.refs.graphicStage.draw();
                        }
                        console.log("new arrows:", eachArrow.points);
                      }

                      if (eachArrow.to !== undefined) {
                        if (eachEllipse.name === eachArrow.to.attrs.name) {
                          eachArrow.points = [
                            eachArrow.points[0],
                            eachArrow.points[1],
                            eachEllipse.x,
                            eachEllipse.y
                          ];
                          this.forceUpdate();
                          this.refs.graphicStage.draw();
                        }
                      }
                    });
                  }}
                  onDragEnd={event => {
                    //cannot compare by name because currentSelected might not be the same
                    //have to use ref, which appears to be overcomplicated
                    var shape = this.refs[eachEllipse.ref];

                    this.setState(prevState => ({
                      ellipses: prevState.ellipses.map(eachEllipse =>
                        eachEllipse.name === shape.attrs.name
                          ? {
                              ...eachEllipse,
                              x: event.target.x(),
                              y: event.target.y()
                            }
                          : eachEllipse
                      )
                    }));

                    this.refs.graphicStage.draw();
                  }}
                />
              ))}
              {this.state.stars.map(eachStar => (
                <Star
                  ref={eachStar.ref}
                  name={eachStar.name}
                  x={eachStar.x}
                  y={eachStar.y}
                  innerRadius={eachStar.innerRadius}
                  outerRadius={eachStar.outerRadius}
                  numPoints={eachStar.numPoints}
                  stroke={eachStar.stroke}
                  strokeWidth={eachStar.strokeWidth}
                  fill={eachStar.fill}
                  strokeScaleEnabled={false}
                  rotation={eachStar.rotation}
                  onClick={() => {
                    var that = this;
                    if (eachStar.link !== undefined && eachStar.link !== "") {
                      this.setState(
                        {
                          errMsg: "Links will not be opened in create mode"
                        },
                        () => {
                          setTimeout(function() {
                            that.setState({
                              errMsg: ""
                            });
                          }, 1000);
                        }
                      );
                    }
                  }}
                  onTransformStart={() => {
                    this.setState({ isTransforming: true });
                  }}
                  onTransformEnd={() => {
                    this.setState({ isTransforming: false });
                    let star = this.refs[eachStar.ref];
                    let scaleX = star.scaleX(),
                      scaleY = star.scaleY();

                    this.setState(prevState => ({
                      stars: prevState.stars.map(eachStar =>
                        eachStar.name === star.attrs.name
                          ? {
                              ...eachStar,
                              innerRadius: star.innerRadius() * star.scaleX(),
                              outerRadius: star.outerRadius() * star.scaleX(),
                              rotation: star.rotation(),
                              x: star.x(),
                              y: star.y()
                            }
                          : eachStar
                      )
                    }));
                    star.setAttr("scaleX", 1);
                    star.setAttr("scaleY", 1);
                    this.forceUpdate();
                  }}
                  draggable
                  onDragMove={() => {
                    this.state.arrows.map(eachArrow => {
                      if (eachArrow.from !== undefined) {
                        if (eachStar.name == eachArrow.from.attrs.name) {
                          eachArrow.points = [
                            eachStar.x,
                            eachStar.y,
                            eachArrow.points[2],
                            eachArrow.points[3]
                          ];
                          this.forceUpdate();
                        }
                      }

                      if (eachArrow.to !== undefined) {
                        if (eachStar.name === eachArrow.to.attrs.name) {
                          eachArrow.points = [
                            eachArrow.points[0],
                            eachArrow.points[1],
                            eachStar.x,
                            eachStar.y
                          ];
                          this.forceUpdate();
                        }
                      }
                    });
                  }}
                  onDragEnd={event => {
                    //cannot compare by name because currentSelected might not be the same
                    //have to use ref, which appears to be overcomplicated
                    var shape = this.refs[eachStar.ref];

                    this.setState(prevState => ({
                      stars: prevState.stars.map(eachStar =>
                        eachStar.name === shape.attrs.name
                          ? {
                              ...eachStar,
                              x: event.target.x(),
                              y: event.target.y()
                            }
                          : eachStar
                      )
                    }));
                  }}
                />
              ))}
              {this.state.texts.map(eachText => (
                //perhaps this.state.texts only need to contain refs?
                //so that we only need to store the refs to get more information
                <Text
                  textDecoration={eachText.link ? "underline" : ""}
                  onTransformStart={() => {
                    var currentText = this.refs[this.state.selectedShapeName];
                    currentText.setAttr("lastRotation", currentText.rotation());
                  }}
                  onTransform={() => {
                    var currentText = this.refs[this.state.selectedShapeName];

                    currentText.setAttr(
                      "width",
                      currentText.width() * currentText.scaleX()
                    );
                    currentText.setAttr("scaleX", 1);

                    currentText.draw();

                    if (
                      currentText.attrs.lastRotation !== currentText.rotation()
                    ) {
                      this.state.arrows.map(eachArrow => {
                        if (
                          eachArrow.to &&
                          eachArrow.to.name() === currentText.name()
                        ) {
                          this.setState({
                            errMsg:
                              "Rotating texts with connectors might skew things up!"
                          });
                        }
                        if (
                          eachArrow.from &&
                          eachArrow.from.name() === currentText.name()
                        ) {
                          this.setState({
                            errMsg:
                              "Rotating texts with connectors might skew things up!"
                          });
                        }
                      });
                    }

                    currentText.setAttr("lastRotation", currentText.rotation());
                  }}
                  onTransformEnd={() => {
                    var currentText = this.refs[this.state.selectedShapeName];

                    this.setState(prevState => ({
                      errMsg: "",
                      texts: prevState.texts.map(eachText =>
                        eachText.name === this.state.selectedShapeName
                          ? {
                              ...eachText,
                              width: currentText.width(),
                              rotation: currentText.rotation(),
                              textWidth: currentText.textWidth,
                              textHeight: currentText.textHeight,
                              x: currentText.x(),
                              y: currentText.y()
                            }
                          : eachText
                      )
                    }));
                    currentText.setAttr("scaleX", 1);
                    currentText.draw();
                  }}
                  link={eachText.link}
                  width={eachText.width}
                  fill={eachText.fill}
                  name={eachText.name}
                  ref={eachText.ref}
                  rotation={eachText.rotation}
                  fontFamily={eachText.fontFamily}
                  fontSize={eachText.fontSize}
                  x={eachText.x}
                  y={eachText.y}
                  text={eachText.text}
                  draggable
                  onDragMove={() => {
                    this.state.arrows.map(eachArrow => {
                      if (eachArrow.from !== undefined) {
                        if (eachText.name === eachArrow.from.attrs.name) {
                          eachArrow.points = [
                            eachText.x,
                            eachText.y,
                            eachArrow.points[2],
                            eachArrow.points[3]
                          ];
                          this.forceUpdate();
                        }
                      }

                      if (eachArrow.to !== undefined) {
                        if (eachText.name === eachArrow.to.attrs.name) {
                          eachArrow.points = [
                            eachArrow.points[0],
                            eachArrow.points[1],
                            eachText.x,
                            eachText.y
                          ];
                          this.forceUpdate();
                        }
                      }
                    });
                  }}
                  onDragEnd={event => {
                    //cannot compare by name because currentSelected might not be the same
                    //have to use ref, which appears to be overcomplicated
                    var shape = this.refs[eachText.ref];

                    this.setState(prevState => ({
                      texts: prevState.texts.map(eachtext =>
                        eachtext.name === shape.attrs.name
                          ? {
                              ...eachtext,
                              x: event.target.x(),
                              y: event.target.y()
                            }
                          : eachtext
                      )
                    }));
                  }}
                  onClick={() => {
                    var that = this;
                    if (eachText.link !== undefined && eachText.link !== "") {
                      this.setState(
                        {
                          errMsg: "Links will not be opened in create mode"
                        },
                        () => {
                          setTimeout(function() {
                            that.setState({
                              errMsg: ""
                            });
                          }, 1000);
                        }
                      );

                      //var win = window.open(eachText.link, "_blank");
                      //win.focus();
                    }
                  }}
                  onDblClick={() => {
                    // turn into textarea
                    var stage = this.refs.graphicStage;
                    var text = stage.findOne("." + eachText.name);

                    this.setState({
                      textX: text.absolutePosition().x,
                      textY: text.absolutePosition().y,
                      textEditVisible: !this.state.textEditVisible,
                      text: eachText.text,
                      textNode: eachText,
                      currentTextRef: eachText.ref,
                      textareaWidth: text.textWidth,
                      textareaHeight: text.textHeight,
                      textareaFill: text.attrs.fill,
                      textareaFontFamily: text.attrs.fontFamily,
                      textareaFontSize: text.attrs.fontSize
                    });
                    let textarea = this.refs.textarea;
                    textarea.focus();
                    text.hide();
                    var transformer = stage.findOne(".transformer");
                    transformer.hide();
                    this.refs.layer2.draw();
                  }}
                />
              ))}
              {this.state.arrows.map(eachArrow => {
                if (!eachArrow.from && !eachArrow.to) {
                  return (
                    <Arrow
                      ref={eachArrow.ref}
                      name={eachArrow.name}
                      points={[
                        eachArrow.points[0],
                        eachArrow.points[1],
                        eachArrow.points[2],
                        eachArrow.points[3]
                      ]}
                      stroke={eachArrow.stroke}
                      fill={eachArrow.fill}
                      draggable
                      onDragEnd={event => {
                        //set new points to current position

                        //usually: state => star => x & y
                        //now: state => arrow => attr => x & y

                        let oldPoints = [
                          eachArrow.points[0],
                          eachArrow.points[1],
                          eachArrow.points[2],
                          eachArrow.points[3]
                        ];

                        let shiftX = this.refs[eachArrow.ref].attrs.x;
                        let shiftY = this.refs[eachArrow.ref].attrs.y;

                        let newPoints = [
                          oldPoints[0] + shiftX,
                          oldPoints[1] + shiftY,
                          oldPoints[2] + shiftX,
                          oldPoints[3] + shiftY
                        ];

                        this.refs[eachArrow.ref].position({ x: 0, y: 0 });
                        this.refs.layer2.draw();

                        this.setState(prevState => ({
                          arrows: prevState.arrows.map(eachArr =>
                            eachArr.name === eachArrow.name
                              ? {
                                  ...eachArr,
                                  points: newPoints
                                }
                              : eachArr
                          )
                        }));
                      }}
                    />
                  );
                } else if (
                  eachArrow.name === this.state.newArrowRef &&
                  (eachArrow.from || eachArrow.to)
                ) {
                  return (
                    <Connector
                      name={eachArrow.name}
                      from={eachArrow.from}
                      to={eachArrow.to}
                      arrowEndX={this.state.arrowEndX}
                      arrowEndY={this.state.arrowEndY}
                      current={true}
                      stroke={eachArrow.stroke}
                      fill={eachArrow.fill}
                    />
                  );
                } else if (eachArrow.from || eachArrow.to) {
                  //if arrow construction is completed
                  return (
                    <Connector
                      name={eachArrow.name}
                      from={eachArrow.from}
                      to={eachArrow.to}
                      points={eachArrow.points}
                      current={false}
                      stroke={eachArrow.stroke}
                      fill={eachArrow.fill}
                    />
                  );
                }
              })}

              {this.state.selectedShapeName.includes("text") ? (
                <TransformerComponent
                  selectedShapeName={this.state.selectedShapeName}
                />
              ) : (
                <TransformerComponent
                  selectedShapeName={this.state.selectedShapeName}
                />
              )}
            </Layer>

            <Layer
              height={window.innerHeight}
              width={window.innerWidth}
              ref="layer"
            >
              <Toolbar
                layer={this.refs.layer2}
                rectName={
                  this.state.rectangles.length + 1 + this.state.rectDeleteCount
                }
                ellipseName={
                  this.state.ellipses.length + 1 + this.state.ellipseDeleteCount
                }
                starName={
                  this.state.stars.length + 1 + this.state.starDeleteCount
                }
                textName={
                  this.state.texts.length + 1 + this.state.textDeleteCount
                }
                newArrowOnDragEnd={toPush => {
                  if (toPush.from !== undefined) {
                    //  console.log("we are making a connector");

                    var transform = this.refs.layer2
                      .getAbsoluteTransform()
                      .copy();
                    transform.invert();
                    let uh = transform.point({
                      x: toPush.x,
                      y: toPush.y
                    });
                    toPush.x = uh.x;
                    toPush.y = uh.y;

                    var newArrow = {
                      points: toPush.points,
                      ref:
                        "arrow" +
                        (this.state.arrows.length +
                          1 +
                          this.state.arrowDeleteCount),
                      name:
                        "arrow" +
                        (this.state.arrows.length +
                          1 +
                          this.state.arrowDeleteCount),
                      from: toPush.from,
                      stroke: toPush.stroke,
                      strokeWidth: toPush.strokeWidth,
                      fill: toPush.fill
                    };

                    //  console.log(newArrow);
                    this.setState(prevState => ({
                      arrows: [...prevState.arrows, newArrow],
                      newArrowDropped: true,
                      newArrowRef: newArrow.name,
                      arrowEndX: toPush.x,
                      arrowEndY: toPush.y
                    }));
                  } else {
                    //  console.log("we are making just an aarrow");
                    var transform = this.refs.layer2
                      .getAbsoluteTransform()
                      .copy();
                    transform.invert();
                    let uh = transform.point({
                      x: toPush.x,
                      y: toPush.y
                    });
                    toPush.x = uh.x;
                    toPush.y = uh.y;
                    var newArrow = {
                      points: [toPush.x, toPush.y, toPush.x, toPush.y],
                      ref:
                        "arrow" +
                        (this.state.arrows.length +
                          1 +
                          this.state.arrowDeleteCount),
                      name:
                        "arrow" +
                        (this.state.arrows.length +
                          1 +
                          this.state.arrowDeleteCount),
                      from: toPush.from,
                      stroke: toPush.stroke,
                      strokeWidth: toPush.strokeWidth,
                      fill: toPush.fill
                    };

                    this.setState(prevState => ({
                      arrows: [...prevState.arrows, newArrow],
                      newArrowDropped: true,
                      newArrowRef: newArrow.name,
                      arrowEndX: toPush.x,
                      arrowEndY: toPush.y
                    }));
                  }

                  //this.refs updates after forceUpdate (because arrow gets instantiated), might be risky in the future
                  //only this.state.arrows.length because it was pushed earlier, cancelling the +1
                }}
                appendToRectangles={stuff => {
                  var layer = this.refs.layer2;
                  var toPush = stuff;
                  var stage = this.refs.graphicStage;
                  var transform = this.refs.layer2
                    .getAbsoluteTransform()
                    .copy();
                  transform.invert();

                  var pos = transform.point({
                    x: toPush.x,
                    y: toPush.y
                  });

                  if (layer.attrs.x !== null || layer.attrs.x !== undefined) {
                    toPush.x = pos.x;
                    toPush.y = pos.y;
                  }

                  this.setState(prevState => ({
                    rectangles: [...prevState.rectangles, toPush],
                    selectedShapeName: toPush.name
                  }));
                }}
                appendToEllipses={stuff => {
                  var layer = this.refs.layer2;
                  var toPush = stuff;
                  var stage = this.refs.graphicStage;
                  var transform = this.refs.layer2
                    .getAbsoluteTransform()
                    .copy();
                  transform.invert();

                  var pos = transform.point({
                    x: toPush.x,
                    y: toPush.y
                  });

                  if (layer.attrs.x !== null || layer.attrs.x !== undefined) {
                    toPush.x = pos.x;
                    toPush.y = pos.y;
                  }

                  this.setState(prevState => ({
                    ellipses: [...prevState.ellipses, toPush],
                    selectedShapeName: toPush.name
                  }));
                }}
                appendToStars={stuff => {
                  var layer = this.refs.layer2;
                  var toPush = stuff;
                  var stage = this.refs.graphicStage;
                  var transform = this.refs.layer2
                    .getAbsoluteTransform()
                    .copy();
                  transform.invert();

                  var pos = transform.point({
                    x: toPush.x,
                    y: toPush.y
                  });

                  if (layer.attrs.x !== null || layer.attrs.x !== undefined) {
                    toPush.x = pos.x;
                    toPush.y = pos.y;
                  }
                  this.setState(prevState => ({
                    stars: [...prevState.stars, toPush],
                    selectedShapeName: toPush.name
                  }));
                }}
                appendToTexts={stuff => {
                  var layer = this.refs.layer2;
                  var toPush = stuff;
                  var stage = this.refs.graphicStage;
                  var transform = this.refs.layer2
                    .getAbsoluteTransform()
                    .copy();
                  transform.invert();

                  var pos = transform.point({
                    x: toPush.x,
                    y: toPush.y
                  });

                  if (layer.attrs.x !== null || layer.attrs.x !== undefined) {
                    toPush.x = pos.x;
                    toPush.y = pos.y;
                  }

                  this.setState(prevState => ({
                    texts: [...prevState.texts, toPush]
                  }));

                  //we can also just get element by this.refs.toPush.ref

                  //  let text = stage.findOne("." + toPush.name);
                  let text = this.refs[toPush.ref];
                  //this.setState({firstTimeTextEditing: true});
                  text.fire("dblclick");
                }}
              />
            </Layer>
          </Stage>

          <textarea
            ref="textarea"
            id="textarea"
            value={this.state.text}
            onChange={e => {
              this.setState({
                text: e.target.value,
                shouldTextUpdate: false
              });
            }}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                this.setState({
                  textEditVisible: false,
                  shouldTextUpdate: true
                });

                // get the current textNode we are editing, get the name from there
                //match name with elements in this.state.texts,
                let node = this.refs[this.state.currentTextRef];
                console.log("node width before set", node.textWidth);
                let name = node.attrs.name;
                this.setState(
                  prevState => ({
                    selectedShapeName: name,
                    texts: prevState.texts.map(eachText =>
                      eachText.name === name
                        ? {
                            ...eachText,
                            text: this.state.text
                          }
                        : eachText
                    )
                  }),
                  () => {
                    this.setState(prevState => ({
                      texts: prevState.texts.map(eachText =>
                        eachText.name === name
                          ? {
                              ...eachText,
                              textWidth: node.textWidth,
                              textHeight: node.textHeight
                            }
                          : eachText
                      )
                    }));
                  }
                );

                node.show();
                this.refs.graphicStage.findOne(".transformer").show();
              }
            }}
            onBlur={() => {
              this.setState({
                textEditVisible: false,
                shouldTextUpdate: true
              });

              // get the current textNode we are editing, get the name from there
              //match name with elements in this.state.texts,

              let node = this.refs.graphicStage.findOne(
                "." + this.state.currentTextRef
              );
              let name = node.attrs.name;

              this.setState(
                prevState => ({
                  selectedShapeName: name,
                  texts: prevState.texts.map(eachText =>
                    eachText.name === name
                      ? {
                          ...eachText,
                          text: this.state.text
                        }
                      : eachText
                  )
                }),
                () => {
                  this.setState(prevState => ({
                    texts: prevState.texts.map(eachText =>
                      eachText.name === name
                        ? {
                            ...eachText,
                            textWidth: node.textWidth,
                            textHeight: node.textHeight
                          }
                        : eachText
                    )
                  }));
                }
              );
              node.show();
              this.refs.graphicStage.findOne(".transformer").show();
              this.refs.graphicStage.draw();
            }}
            style={{
              //set position, width, height, fontSize, overflow, lineHeight, color
              display: this.state.textEditVisible ? "block" : "none",
              position: "absolute",
              top: this.state.textY + 80 + "px",
              left: this.state.textX + "px",
              width: "300px",
              height: "300px",
              overflow: "hidden",
              fontSize: this.state.textareaFontSize,
              fontFamily: this.state.textareaFontFamily,
              color: this.state.textareaFill,
              border: "none",
              padding: "0px",
              margin: "0px",
              outline: "none",
              resize: "none",
              background: "none"
            }}
          />
          <div className="errMsg">{errDisplay}</div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default Graphics;
