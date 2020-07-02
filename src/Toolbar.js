import React, { Component } from 'react'

import { Rect, Ellipse, Star, Text, Arrow } from 'react-konva'
//at start, two same rectangles at one place
//at the end of drag, note the x and y of the dragged rectangle, append it to GraphicsMain
//return the dragged rectangle to original

const ToolBar = () => (
    <Rect
        y={80}
        width={77.5}
        height={355}
        fill="white"
        shadowBlur={5}
        shadowColor="black"
    />
)

export default class Toolbar extends Component {
    state = {
        arrowDraggable: false,
        previousShape: undefined,
        count: 0,
        isDragging: false
    }
    render() {
        return (
            <React.Fragment>
                {this.props.layer ? (
                    <React.Fragment>
                        <ToolBar />
                        <Ellipse
                            radiusX={20}
                            radiusY={20}
                            stroke="black"
                            strokeWidth={1.5}
                            x={37.5}
                            y={125}
                        />
                        <Ellipse
                            radiusX={20}
                            radiusY={20}
                            stroke="black"
                            strokeWidth={1.5}
                            x={37.5}
                            y={125}
                            draggable
                            ref="draggableEllipse"
                            onDragEnd={e => {
                                //add the rectangle to parent
                                let name = 'ellipse' + this.props.ellipseName
                                let toSend = {
                                    x: e.target.x(),
                                    y: e.target.y(),
                                    radiusX: 20,
                                    radiusY: 20,
                                    stroke: 'black',
                                    strokeWidth: 1.5,
                                    name: name,
                                    fill: 'white',
                                    ref: name,
                                    rotation: 0
                                }
                                this.props.appendToEllipses(toSend)

                                var ellipse = this.refs.draggableEllipse

                                ellipse.position({
                                    x: 37.5,
                                    y: 125
                                })
                            }}
                        />
                        <Rect
                            width={35}
                            height={35}
                            stroke="black"
                            strokeWidth={1.5}
                            x={20}
                            y={180}
                            fill="white"
                        />
                        <Rect
                            width={35}
                            height={35}
                            stroke="black"
                            strokeWidth={1.5}
                            x={20}
                            y={180}
                            draggable
                            fill="white"
                            ref="draggableRect"
                            onDragEnd={e => {
                                //add the rectangle to parent
                                let name = 'rectangle' + this.props.rectName
                                let toSend = {
                                    x: e.target.x(),
                                    y: e.target.y(),
                                    width: 35,
                                    height: 35,
                                    stroke: 'black',
                                    strokeWidth: 1.5,
                                    rotation: 0,
                                    name: name,
                                    ref: name,
                                    fill: 'white',
                                    useImage: false
                                }
                                this.props.appendToRectangles(toSend)

                                var rect = this.refs.draggableRect

                                rect.position({
                                    x: 20,
                                    y: 180
                                })
                            }}
                        />
                        <Star
                            innerRadius={8}
                            outerRadius={20}
                            numPoints={5}
                            stroke="black"
                            strokeWidth={1.5}
                            x={37.5}
                            y={270}
                            fill="white"
                        />
                        <Star
                            innerRadius={8}
                            outerRadius={20}
                            numPoints={5}
                            stroke="black"
                            strokeWidth={1.5}
                            x={37.5}
                            y={270}
                            draggable
                            ref="draggableStar"
                            onDragEnd={e => {
                                //add the rectangle to parent
                                let name = 'star' + this.props.starName
                                let toSend = {
                                    x: e.target.x(),
                                    y: e.target.y(),
                                    innerRadius: 8,
                                    outerRadius: 20,
                                    numPoints: 5,
                                    stroke: 'black',
                                    strokeWidth: 1.5,
                                    name: name,
                                    fill: 'white',
                                    ref: name,
                                    rotation: 0
                                }
                                this.props.appendToStars(toSend)

                                var star = this.refs.draggableStar

                                star.position({
                                    x: 37.5,
                                    y: 270
                                })
                            }}
                        />
                        <Text
                            fontSize={40}
                            text="T"
                            fontFamily="Belgrano"
                            x={24}
                            y={320}
                        />
                        <Text
                            fontSize={40}
                            text="T"
                            fontFamily="Belgrano"
                            x={24}
                            y={320}
                            draggable
                            ref="draggableText"
                            onDragEnd={e => {
                                //add the rectangle to parent
                                let name = 'text' + this.props.textName
                                let ref = 'text' + this.props.textName
                                let toSend = {
                                    x: e.target.x(),
                                    y: e.target.y(),
                                    fontSize: 25,
                                    fontFamily: 'Belgrano',
                                    ref: ref,
                                    name: name,
                                    text: '',
                                    fill: 'black',
                                    width: 300,
                                    height: 25,
                                    rotation: 0,
                                    textWidth: this.refs.draggableText
                                        .textWidth,
                                    textHeight: this.refs.draggableText
                                        .textHeight
                                }
                                console.log('tosend', toSend)
                                this.props.appendToTexts(toSend)

                                var text = this.refs.draggableText

                                text.position({
                                    x: 24,
                                    y: 320
                                })
                            }}
                        />
                        <Arrow
                            points={[20, 400, 50, 400]}
                            fill="black"
                            stroke="black"
                        />
                        <Arrow
                            points={[20, 400, 50, 400]}
                            fill="black"
                            stroke="black"
                            ref="draggableArrow"
                            name="draggableArrow"
                            draggable
                            onDragStart={() => {
                                this.refs.draggableArrow.setAttr('fill', 'grey')
                                this.refs.draggableArrow.setAttr(
                                    'stroke',
                                    'grey'
                                )
                            }}
                            onDragMove={() => {
                                var pos = this.props.layer
                                    .getStage()
                                    .getPointerPosition()
                                var shape = this.props.layer.getIntersection(
                                    pos
                                )

                                //after first frame
                                if (
                                    this.state.previousShape !== undefined &&
                                    this.state.previousShape !== null
                                )
                                    if (this.state.previousShape !== shape) {
                                        //arrow entered a new shape

                                        //the shape we left gets its original color back
                                        if (
                                            this.state.previousShape.attrs
                                                .id !== 'ContainerRect' &&
                                            !this.state.previousShape.attrs.name.includes(
                                                'arrow'
                                            )
                                        ) {
                                            this.refs.draggableArrow.setAttr(
                                                'fill',
                                                'black'
                                            )
                                            this.refs.draggableArrow.setAttr(
                                                'stroke',
                                                'black'
                                            )
                                        }
                                    }
                                    //if arrow is moving in a single shape
                                    else if (
                                        this.state.previousShape.attrs.id !==
                                            'ContainerRect' &&
                                        !shape.attrs.name.includes('arrow')
                                    ) {
                                        //if it the first time the shapes are same, set shape to blue, store the original color
                                        this.refs.draggableArrow.setAttr(
                                            'fill',
                                            '#ccf5ff'
                                        )
                                        this.refs.draggableArrow.setAttr(
                                            'stroke',
                                            '#ccf5ff'
                                        )
                                    }

                                this.props.layer.draw()

                                this.setState({ previousShape: shape })
                            }}
                            onDragEnd={event => {
                                var pos = this.props.layer
                                    .getStage()
                                    .getPointerPosition()
                                var shape = this.props.layer.getIntersection(
                                    pos
                                )

                                //shape is not containerRect, which means we are on a shape
                                if (
                                    shape &&
                                    shape.attrs.id === undefined &&
                                    !shape.attrs.name.includes('arrow')
                                ) {
                                    let toSend = {
                                        x: pos.x,
                                        y: pos.y,
                                        points: [20, 475, 60, 475],
                                        from: shape,
                                        stroke: 'black',
                                        strokeWidth: '1.5',
                                        fill: 'black'
                                    }
                                    console.log('from shape', shape)
                                    this.props.newArrowOnDragEnd(toSend)
                                } else {
                                    let toSend = {
                                        x: pos.x,
                                        y: pos.y,
                                        points: [20, 475, 60, 475],
                                        stroke: 'black',
                                        strokeWidth: '1.5',
                                        fill: 'black'
                                    }

                                    this.props.newArrowOnDragEnd(toSend)
                                }

                                //if shape is not arrow nor the containerRect then we make a connector instead

                                //onDragEnd = dropping arrow down, create a new arrow with 2 same points at the dropped location
                                //create new arrow in Graphics.js
                                //from there, fire onMouseMove over the entire stage
                                //the arrow's points should be the first point onDragEnd and the second should be the current
                                //mouse position determined by onMouseMove event in stage
                                var arrow = this.refs.draggableArrow
                                arrow.position({ x: 0, y: 0 })
                                arrow.setAttr('fill', 'black')
                                arrow.setAttr('stroke', 'black')

                                arrow.draw()
                            }}
                        />
                    </React.Fragment>
                ) : null}
            </React.Fragment>
        )
    }
}
