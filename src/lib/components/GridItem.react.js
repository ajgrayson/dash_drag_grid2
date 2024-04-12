import React, { Component } from "react"

class GridItem extends Component {

    render() {
        const props = this.props;
        
        let activeClass = "";
        if (props.active) {
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
                    <div className="item-top">...</div>
                    {props.closable && (
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
