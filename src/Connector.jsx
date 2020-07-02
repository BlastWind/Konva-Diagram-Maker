import React, { Component } from 'react'
import { Arrow } from 'react-konva'
class Connector extends Component {
    /*******uses current position of two shapes to determine the points of an arrow
     ******************************************************************************/

    getConnectorPoints = stuff => {
        var points = stuff.points
        var from = stuff.from
        var to = stuff.to
        var mouseX = stuff.mouseX
        var mouseY = stuff.mouseY
        var point = { x: mouseX, y: mouseY }

        if (stuff.type === 'FromAndTo') {
            if (
                to.attrs.name.includes('rect') &&
                from.attrs.name.includes('rect')
            ) {
                //only works for rect because the calculation for origin is different for ellipse and rect
                var dy =
                    to.attrs.y +
                    to.attrs.height / 2 -
                    (from.attrs.y + from.attrs.height / 2)
                var dx =
                    to.attrs.x +
                    to.attrs.width / 2 -
                    (from.attrs.x + from.attrs.width / 2)
                var theta = Math.atan2(dy, dx)
                let angle = (theta / Math.PI) * 180

                if (angle <= 45 && angle >= -45) {
                    points[0] += from.attrs.width
                    points[1] += from.attrs.height / 2
                    points[3] += to.attrs.height / 2
                } else if (angle > 45 && angle < 135) {
                    points[0] += from.attrs.width / 2
                    points[1] += from.attrs.height
                    points[2] += to.attrs.width / 2
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    points[1] += from.attrs.height / 2
                    points[2] += to.attrs.width
                    points[3] += to.attrs.height / 2
                } else if (angle < -45 && angle > -135) {
                    points[0] += from.attrs.width / 2
                    points[3] += to.attrs.height
                    points[2] += to.attrs.width / 2
                }
            } else if (
                to.attrs.name.includes('rect') &&
                from.attrs.name.includes('text')
            ) {
                //only works for rect because the calculation for origin is different for ellipse and rect

                let fromTextHeight = from.textHeight || from.attrs.textHeight
                let fromTextWidth = from.textWidth || from.attrs.textWidth
                dy =
                    to.attrs.y +
                    to.attrs.height / 2 -
                    (from.attrs.y + fromTextHeight / 2)
                dx =
                    to.attrs.x +
                    to.attrs.width / 2 -
                    (from.attrs.x + fromTextWidth / 2)
                theta = Math.atan2(dy, dx)
                let angle = (theta / Math.PI) * 180

                if (angle <= 45 && angle >= -45) {
                    points[0] += fromTextWidth
                    points[1] += fromTextHeight / 2
                    points[3] += to.attrs.height / 2
                } else if (angle > 45 && angle < 135) {
                    points[0] += fromTextWidth / 2
                    points[1] += fromTextHeight
                    points[2] += to.attrs.width / 2
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    points[1] += fromTextHeight / 2
                    points[2] += to.attrs.width
                    points[3] += to.attrs.height / 2
                } else if (angle < -45 && angle > -135) {
                    points[0] += fromTextWidth / 2
                    points[3] += to.attrs.height
                    points[2] += to.attrs.width / 2
                }
            } else if (
                to.attrs.name.includes('ellipse') &&
                from.attrs.name.includes('ellipse')
            ) {
                //two ellipses
                var origin = { x: from.attrs.x, y: from.attrs.y }
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                let angle = Math.atan2(-dy, dx)
                points[0] += -from.attrs.radiusX * Math.cos(angle + Math.PI)
                points[1] += from.attrs.radiusY * Math.sin(angle + Math.PI)
                points[2] += to.attrs.radiusX * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.radiusY * Math.sin(angle + Math.PI)
            } else if (
                to.attrs.name.includes('star') &&
                from.attrs.name.includes('star')
            ) {
                origin = { x: from.attrs.x, y: from.attrs.y }
                dy = points[3] - points[1]
                dx = points[2] - points[0]
                let angle = Math.atan2(-dy, dx)
                points[0] += -from.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[1] += from.attrs.outerRadius * Math.sin(angle + Math.PI)
                points[2] += to.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.outerRadius * Math.sin(angle + Math.PI)
            } else if (
                to.attrs.name.includes('text') &&
                from.attrs.name.includes('text')
            ) {
                let fromTextHeight = from.textHeight || from.attrs.textHeight
                let fromTextWidth = from.textWidth || from.attrs.textWidth
                let toTextHeight = to.textHeight || to.attrs.textHeight
                let toTextWidth = to.textWidth || to.attrs.textWidth
                dy =
                    to.attrs.y +
                    toTextHeight / 2 -
                    (from.attrs.y + fromTextHeight / 2)
                dx =
                    to.attrs.x +
                    toTextWidth / 2 -
                    (from.attrs.x + fromTextWidth / 2)
                theta = Math.atan2(dy, dx)
                let angle = (theta / Math.PI) * 180

                if (angle <= 45 && angle >= -45) {
                    points[0] += fromTextWidth
                    points[1] += fromTextHeight / 2
                    points[3] += toTextHeight / 2
                } else if (angle > 45 && angle < 135) {
                    points[0] += fromTextWidth / 2
                    points[1] += fromTextHeight
                    points[2] += toTextWidth / 2
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    points[1] += fromTextHeight / 2
                    points[2] += toTextWidth
                    points[3] += toTextHeight / 2
                } else if (angle < -45 && angle > -135) {
                    points[0] += fromTextWidth / 2
                    points[3] += toTextHeight
                    points[2] += toTextWidth / 2
                }
            } else if (
                from.attrs.name.includes('rect') &&
                to.attrs.name.includes('ellipse')
            ) {
                //rect change
                var dy1 = to.attrs.y + -(from.attrs.y + from.attrs.height / 2)
                var dx1 = to.attrs.x + -(from.attrs.x + from.attrs.width / 2)

                theta = Math.atan2(dy1, dx1)
                var angle = (theta / Math.PI) * 180
                if (angle <= -45 && angle >= -135) {
                    //top
                    points[0] += from.attrs.width / 2
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[0] += from.attrs.width / 2
                    points[1] += from.attrs.height
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[1] += from.attrs.height / 2
                } else if (angle > -45 && angle < 45) {
                    points[0] += from.attrs.width
                    points[1] += from.attrs.height / 2
                }
                //ellipse change
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[2] += to.attrs.radiusX * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.radiusY * Math.sin(angle + Math.PI)
            } else if (
                from.attrs.name.includes('rect') &&
                to.attrs.name.includes('star')
            ) {
                //rect change
                dy1 = to.attrs.y + -(from.attrs.y + from.attrs.height / 2)
                dx1 = to.attrs.x + -(from.attrs.x + from.attrs.width / 2)

                theta = Math.atan2(dy1, dx1)
                angle = (theta / Math.PI) * 180
                if (angle <= -45 && angle >= -135) {
                    //top
                    points[0] += from.attrs.width / 2
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[0] += from.attrs.width / 2
                    points[1] += from.attrs.height
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[1] += from.attrs.height / 2
                } else if (angle > -45 && angle < 45) {
                    points[0] += from.attrs.width
                    points[1] += from.attrs.height / 2
                }
                //ellipse change
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[2] += to.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.outerRadius * Math.sin(angle + Math.PI)
            } else if (
                from.attrs.name.includes('rect') &&
                to.attrs.name.includes('text')
            ) {
                //only works for rect because the calculation for origin is different for ellipse and rect
                let toTextHeight = to.textHeight || to.attrs.textHeight
                let toTextWidth = to.textWidth || to.attrs.textWidth
                console.log(to)
                dy =
                    to.attrs.y +
                    toTextHeight / 2 -
                    (from.attrs.y + from.attrs.height / 2)
                dx =
                    to.attrs.x +
                    toTextWidth / 2 -
                    (from.attrs.x + from.attrs.width / 2)
                var theta = Math.atan2(dy, dx)
                let angle = (theta / Math.PI) * 180

                /*  console.log(
                    'from rect and to text',
                    'angle: ',
                    angle,
                    'from',
                    from,
                    'to',
                    to
                )*/

                if (angle <= 45 && angle >= -45) {
                    points[0] += from.attrs.width
                    points[1] += from.attrs.height / 2
                    points[3] += toTextHeight / 2
                } else if (angle > 45 && angle < 135) {
                    points[0] += from.attrs.width / 2
                    points[1] += from.attrs.height
                    points[2] += toTextWidth / 2
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    points[1] += from.attrs.height / 2
                    points[2] += toTextWidth
                    points[3] += toTextHeight / 2
                } else if (angle < -45 && angle > -135) {
                    points[0] += from.attrs.width / 2
                    points[3] += toTextHeight
                    points[2] += toTextWidth / 2
                }
            } else if (
                from.attrs.name.includes('ellipse') &&
                to.attrs.name.includes('rect')
            ) {
                //rect change
                dy1 = to.attrs.y + to.attrs.height / 2 - from.attrs.y
                dx1 = to.attrs.x + to.attrs.width / 2 - from.attrs.x

                theta = Math.atan2(dy1, dx1)
                angle = (theta / Math.PI) * 180

                if (angle <= -45 && angle >= -135) {
                    //top
                    points[2] += to.attrs.width / 2
                    points[3] += to.attrs.height
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[2] += to.attrs.width / 2
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[2] += to.attrs.width
                    points[3] += to.attrs.height / 2
                } else if (angle > -45 && angle < 45) {
                    points[3] += to.attrs.height / 2
                }
                //ellipse change
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[0] -= from.attrs.radiusX * Math.cos(angle + Math.PI)
                points[1] += from.attrs.radiusY * Math.sin(angle + Math.PI)
            } else if (
                from.attrs.name.includes('ellipse') &&
                to.attrs.name.includes('text')
            ) {
                let toTextHeight = to.textHeight || to.attrs.textHeight
                let toTextWidth = to.textWidth || to.attrs.textWidth
                //rect change
                dy1 = to.attrs.y + toTextHeight / 2 - from.attrs.y
                dx1 = to.attrs.x + toTextWidth / 2 - from.attrs.x

                theta = Math.atan2(dy1, dx1)
                angle = (theta / Math.PI) * 180

                if (angle <= -45 && angle >= -135) {
                    //top
                    points[2] += toTextWidth / 2
                    points[3] += toTextHeight
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[2] += toTextWidth / 2
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[2] += toTextWidth
                    points[3] += toTextHeight / 2
                } else if (angle > -45 && angle < 45) {
                    points[3] += toTextHeight / 2
                }
                //ellipse change
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[0] -= from.attrs.radiusX * Math.cos(angle + Math.PI)
                points[1] += from.attrs.radiusY * Math.sin(angle + Math.PI)

                console.log(
                    'new points',
                    points,
                    'from',
                    from,
                    'from coord',
                    from.attrs
                )
            } else if (
                from.attrs.name.includes('ellipse') &&
                to.attrs.name.includes('star')
            ) {
                //two ellipses
                origin = { x: from.attrs.x, y: from.attrs.y }
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                let angle = Math.atan2(-dy, dx)
                points[0] += -from.attrs.radiusX * Math.cos(angle + Math.PI)
                points[1] += from.attrs.radiusY * Math.sin(angle + Math.PI)
                points[2] += to.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.outerRadius * Math.sin(angle + Math.PI)
            } else if (
                from.attrs.name.includes('star') &&
                to.attrs.name.includes('ellipse')
            ) {
                //two ellipses
                origin = { x: from.attrs.x, y: from.attrs.y }
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                let angle = Math.atan2(-dy, dx)
                points[0] += -from.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[1] += from.attrs.outerRadius * Math.sin(angle + Math.PI)
                points[2] += to.attrs.radiusX * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.radiusY * Math.sin(angle + Math.PI)
            } else if (
                from.attrs.name.includes('star') &&
                to.attrs.name.includes('rect')
            ) {
                //two ellipses
                dy1 = to.attrs.y + to.attrs.width / 2 - from.attrs.y
                dx1 = to.attrs.x + to.attrs.width / 2 - from.attrs.x

                theta = Math.atan2(dy1, dx1)
                angle = (theta / Math.PI) * 180

                if (angle <= -45 && angle >= -135) {
                    //top
                    points[2] += to.attrs.width / 2
                    points[3] += to.attrs.height
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[2] += to.attrs.width / 2
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[2] += to.attrs.width
                    points[3] += to.attrs.height / 2
                } else if (angle > -45 && angle < 45) {
                    points[3] += to.attrs.width / 2
                }
                //ellipse change
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[0] -= from.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[1] += from.attrs.outerRadius * Math.sin(angle + Math.PI)
            } else if (
                from.attrs.name.includes('star') &&
                to.attrs.name.includes('text')
            ) {
                let toTextHeight = to.textHeight || to.attrs.textHeight
                let toTextWidth = to.textWidth || to.attrs.textWidth
                //two ellipses
                dy1 = to.attrs.y + toTextHeight / 2 - from.attrs.y
                dx1 = to.attrs.x + toTextWidth / 2 - from.attrs.x

                theta = Math.atan2(dy1, dx1)
                angle = (theta / Math.PI) * 180

                if (angle <= -45 && angle >= -135) {
                    //top
                    points[2] += toTextWidth / 2
                    points[3] += toTextHeight
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[2] += toTextWidth / 2
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[2] += toTextWidth
                    points[3] += toTextHeight / 2
                } else if (angle > -45 && angle < 45) {
                    points[3] += toTextHeight / 2
                }
                //ellipse change
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[0] -= from.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[1] += from.attrs.outerRadius * Math.sin(angle + Math.PI)
            } else if (
                from.attrs.name.includes('text') &&
                to.attrs.name.includes('star')
            ) {
                let fromTextHeight = from.textHeight || from.attrs.textHeight
                let fromTextWidth = from.textWidth || from.attrs.textWidth
                //rect change
                dy1 = to.attrs.y + -(from.attrs.y + fromTextHeight / 2)
                dx1 = to.attrs.x + -(from.attrs.x + fromTextWidth / 2)

                theta = Math.atan2(dy1, dx1)
                angle = (theta / Math.PI) * 180
                if (angle <= -45 && angle >= -135) {
                    //top
                    points[0] += fromTextWidth / 2
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[0] += fromTextWidth / 2
                    points[1] += fromTextHeight
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[1] += fromTextHeight / 2
                } else if (angle > -45 && angle < 45) {
                    points[0] += fromTextWidth
                    points[1] += fromTextHeight / 2
                }
                //ellipse change
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[2] += to.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.outerRadius * Math.sin(angle + Math.PI)
            } else if (
                from.attrs.name.includes('text') &&
                to.attrs.name.includes('ellipse')
            ) {
                let fromTextHeight = from.textHeight || from.attrs.textHeight
                let fromTextWidth = from.textWidth || from.attrs.textWidth
                //rect change
                dy1 = to.attrs.y + -(from.attrs.y + fromTextHeight / 2)
                dx1 = to.attrs.x + -(from.attrs.x + fromTextWidth / 2)

                theta = Math.atan2(dy1, dx1)
                angle = (theta / Math.PI) * 180
                if (angle <= -45 && angle >= -135) {
                    //top
                    points[0] += fromTextWidth / 2
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[0] += fromTextWidth / 2
                    points[1] += fromTextHeight
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[1] += fromTextHeight / 2
                } else if (angle > -45 && angle < 45) {
                    points[0] += fromTextWidth
                    points[1] += fromTextHeight / 2
                }
                //ellipse change
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[2] += to.attrs.radiusX * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.radiusY * Math.sin(angle + Math.PI)
            }
        }

        if (stuff.type === 'onlyFrom') {
            if (from.attrs.name.includes('rect')) {
                origin = {
                    x: from.attrs.x + from.attrs.width / 2,
                    y: from.attrs.y + from.attrs.height / 2
                }
                dy = point.y - origin.y
                dx = point.x - origin.x
                theta = Math.atan2(dy, dx)
                angle = (theta / Math.PI) * 180
                if (angle <= -45 && angle >= -135) {
                    //top
                    points[0] += from.attrs.width / 2
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[0] += from.attrs.width / 2
                    points[1] += from.attrs.height
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[1] += from.attrs.height / 2
                } else if (angle > -45 && angle < 45) {
                    points[0] += from.attrs.width
                    points[1] += from.attrs.height / 2
                }
            } else if (from.attrs.name.includes('ellipse')) {
                origin = {
                    x: from.attrs.x,
                    y: from.attrs.y
                }

                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                let angle = Math.atan2(-dy, dx)

                //  console.log("we messing with a ellipse", points, angle, from);

                points[0] += -from.attrs.radiusX * Math.cos(angle + Math.PI)
                points[1] += from.attrs.radiusY * Math.sin(angle + Math.PI)
            } else if (from.attrs.name.includes('star')) {
                origin = { x: from.attrs.x, y: from.attrs.y }
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                let angle = Math.atan2(-dy, dx)

                //  console.log("we messing with a ellipse", points, angle, from);

                points[0] += -from.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[1] += from.attrs.outerRadius * Math.sin(angle + Math.PI)
            } else if (from.attrs.name.includes('text')) {
                let fromTextHeight = from.textHeight || from.attrs.textHeight
                let fromTextWidth = from.textWidth || from.attrs.textWidth

                origin = {
                    x: from.attrs.x + fromTextWidth / 2,
                    y: from.attrs.y + fromTextWidth / 2
                }
                dy = point.y - origin.y
                dx = point.x - origin.x
                theta = Math.atan2(dy, dx)
                angle = (theta / Math.PI) * 180

                if (angle <= -45 && angle >= -135) {
                    //top
                    points[0] += fromTextWidth / 2
                } else if (angle > 45 && angle < 135) {
                    //bottom
                    points[0] += fromTextWidth / 2
                    points[1] += fromTextHeight
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    //left
                    points[1] += fromTextHeight / 2
                } else if (angle > -45 && angle < 45) {
                    points[0] += fromTextWidth
                    points[1] += fromTextHeight / 2
                }
            }
        }
        if (stuff.type === 'onlyTo') {
            if (to.attrs.name.includes('rect')) {
                var endPoint = { x: points[0], y: points[1] }
                origin = {
                    x: to.attrs.x + to.attrs.width / 2,
                    y: to.attrs.y + to.attrs.height / 2
                }

                dy = endPoint.y - origin.y
                dx = endPoint.x - origin.x
                theta = Math.atan2(dy, dx)
                angle = (theta / Math.PI) * 180

                if (angle > 45 && angle < 135) {
                    points[2] += to.attrs.width / 2
                    points[3] += to.attrs.height
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    points[3] += to.attrs.height / 2
                } else if (angle > -135 && angle < -45) {
                    points[2] += to.attrs.width / 2
                } else {
                    points[2] += to.attrs.width
                    points[3] += to.attrs.height / 2
                }
            } else if (to.attrs.name.includes('ellipse')) {
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                let angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[2] += to.attrs.radiusX * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.radiusY * Math.sin(angle + Math.PI)
            } else if (to.attrs.name.includes('star')) {
                const dy = points[3] - points[1]
                const dx = points[2] - points[0]
                let angle = Math.atan2(-dy, dx)
                //      console.log(dy, dx);

                points[2] += to.attrs.outerRadius * Math.cos(angle + Math.PI)
                points[3] -= to.attrs.outerRadius * Math.sin(angle + Math.PI)
            } else if (to.attrs.name.includes('text')) {
                let toTextHeight = to.textHeight || to.attrs.textHeight
                let toTextWidth = to.textWidth || to.attrs.textWidth

                endPoint = { x: points[0], y: points[1] }
                origin = {
                    x: to.attrs.x + toTextWidth / 2,
                    y: to.attrs.y + toTextWidth / 2
                }

                dy = endPoint.y - origin.y
                dx = endPoint.x - origin.x
                theta = Math.atan2(dy, dx)
                angle = (theta / Math.PI) * 180

                if (angle > 45 && angle < 135) {
                    points[2] += toTextWidth / 2
                    points[3] += toTextHeight
                } else if (
                    (angle > 135 && angle < 180) ||
                    (angle > -180 && angle < -135)
                ) {
                    points[3] += toTextHeight / 2
                } else if (angle > -135 && angle < -45) {
                    points[2] += toTextWidth / 2
                } else {
                    points[2] += toTextHeight
                    points[3] += toTextHeight / 2
                }
            }
        }

        return points
    }

    render() {
        var points = null

        if (this.props.current) {
            if (this.props.from) {
                points = [
                    this.props.from.attrs.x,
                    this.props.from.attrs.y,
                    this.props.arrowEndX,
                    this.props.arrowEndY
                ]
                let stuff = {
                    points: points,
                    from: this.props.from,
                    mouseX: this.props.arrowEndX,
                    mouseY: this.props.arrowEndY,
                    type: 'onlyFrom'
                }
                points = this.getConnectorPoints(stuff)
            }
        }
        if (this.props.current === false) {
            if (this.props.from && this.props.to) {
                points = [
                    this.props.from.attrs.x,
                    this.props.from.attrs.y,
                    this.props.to.attrs.x,
                    this.props.to.attrs.y
                ]

                let toSend = {
                    points: points,
                    from: this.props.from,
                    to: this.props.to,
                    type: 'FromAndTo'
                }

                points = this.getConnectorPoints(toSend)

                //get connector points
            } else if (this.props.from) {
                points = [
                    this.props.from.attrs.x,
                    this.props.from.attrs.y,
                    this.props.points[2],
                    this.props.points[3]
                ]

                let stuff = {
                    points: points,
                    from: this.props.from,
                    mouseX: this.props.points[2],
                    mouseY: this.props.points[3],
                    type: 'onlyFrom'
                }
                points = this.getConnectorPoints(stuff)
            } else if (this.props.to) {
                points = [
                    this.props.points[0],
                    this.props.points[1],
                    this.props.to.attrs.x,
                    this.props.to.attrs.y
                ]

                let stuff = {
                    points: points,
                    to: this.props.to,
                    type: 'onlyTo',
                    mouseX: this.props.to.attrs.x,
                    mouseY: this.props.to.attrs.y
                }
                points = this.getConnectorPoints(stuff)
            }
        }
        return (
            <Arrow
                name={this.props.name}
                points={points}
                strokeWidth={1.5}
                stroke={this.props.stroke}
                fill={this.props.fill}
            />
        )
    }
}

export default Connector
