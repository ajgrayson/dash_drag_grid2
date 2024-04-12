import React from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './style.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function Toolbox ({  toolboxItems, toolboxTitle, toolboxComponent, layouts, breakpoints }) {

    const handleDragStart = (id) => (e) => {
        e.dataTransfer.setData('text/plain', id);
    };

    const renderToolboxItem = (child, index) => {
        const key = child.props.id || `toolbox-item-${index}`;
        const _data_grid = { x: 0, y: 0, w: 1, h: 2 };
        const content = typeof child.props._dashprivate_layout.props.defaultName === 'string'
            ? child.props._dashprivate_layout.props.defaultName
            : child.props._dashprivate_layout.props.id;

        return (
            <div
                key={key}
                className="item toolbox"
                data-grid={_data_grid}
                draggable="true"
                unselectable="on"
                onDragStart={handleDragStart(child.props._dashprivate_layout.props.id)}
            >
                <div className="toolbox-item-content">
                    {toolboxComponent(content)}
                </div>
            </div>
        );
    };

    return (
        <div className="toolbox-container">
            <span className="toolbox-title">{toolboxTitle}</span>
            {toolboxItems.length > 0 && (
            <ResponsiveReactGridLayout
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                breakpoints={breakpoints}
                rowHeight={30}
                layouts={layouts}
                isResizable={false}
                isDraggable={false}
                containerPadding={[0, 0]}
                compactType={'horizontal'}
            >
                {toolboxItems.map(renderToolboxItem)}
            </ResponsiveReactGridLayout>)}
            {toolboxItems.length == 0 && (
                <div className="toolbox-slim"></div>
            )}
        </div>
    );
};

Toolbox.propTypes = {
    toolboxItems: PropTypes.array.isRequired,
    toolboxTitle: PropTypes.string,
    toolboxComponent: PropTypes.func,
    layouts: PropTypes.object,
    breakpoints: PropTypes.object
};

Toolbox.defaultProps = {
    toolboxTitle: "Toolbox",
    toolboxComponent: (label) => <span>{label}</span>
};

export default Toolbox;