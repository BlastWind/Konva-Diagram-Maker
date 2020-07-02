import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./styles.css";
import ColoredRect from "./App.js";

class FadeInAndOut extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { show: false };

    setInterval(() => {
      this.setState({ show: !this.state.show });
    }, 2000);
  }

  render() {
    return (
      <div>
        <a
          onClick={() => {
            this.setState({ show: !this.state.show });
          }}
          style={{ cursor: "pointer", padding: "20px" }}
        >
          Woah
        </a>
        <CSSTransition in={this.state.show} timeout={1200} classNames="base">
          <div>Hello World</div>
        </CSSTransition>
      </div>
    );
  }
}

ReactDOM.render(<ColoredRect />, document.getElementById("root"));
