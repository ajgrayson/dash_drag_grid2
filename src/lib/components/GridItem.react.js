import React, { Component, useEffect } from "react"

class GridItem extends Component {

    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            active: false
        }

        this.activate = this.activate.bind(this);
        this.deactivate = this.deactivate.bind(this);
    }

    activate() {
        this.setState(prev => {
            let newState = { ...prev };
            newState.active = true;
            return newState;
        })
    }

    deactivate() {
        this.setState(prev => {
            let newState = { ...prev };
            newState.active = false;
            return newState;
        })
    }

    render() {
        const props = this.props;
        console.log(props);
        let activeClass = "";
        if (this.state.active || this.props.active) {
            activeClass = "active";
        }

        return (
            <div
                key={props.key}
                data-grid={props.data_grid}
                style={{ ...props.style }}
                className={[props.className, activeClass].join(" ")}
                ref={props.innerRef}
                onMouseDown={props.onMouseDown}
                onMouseUp={props.onMouseUp}
                onTouchEnd={props.onTouchEnd}
            >
                <div className="item-top-container">
                    <div className="item-top"
                        onMouseDown={() => this.activate()}
                        onMouseUp={() => this.deactivate()}
                    >...</div>
                    {props.isRemoveable && (
                        <button
                            className="close-button"
                            onClick={() => props.onCloseClicked && props.onCloseClicked()}
                        >
                            &times;
                        </button>
                    )}
                </div>

                <div
                    className="item-content"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {props.children}
                </div>
            </div>
        );
    }
}

export default React.forwardRef((props, ref) => {
    return (
        <GridItem
            innerRef={ref} {...props}
        >
            {props.children}
        </GridItem>
    );
})
