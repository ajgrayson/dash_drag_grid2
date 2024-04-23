import React from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './style.css';

import {renderDashComponent} from 'dash-extensions-js'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function ToolBox({  items, title, component, layouts, breakpoints }) {

    const handleDragStart = (id) => (e) => {
        e.dataTransfer.setData('text/plain', id);
    };

    const renderContent = (child) => {
        try {
            if (child.node.props._dashprivate_layout && child.node.props._dashprivate_layout.props && child.node.props._dashprivate_layout.props.toolboxContent) {
                const toolboxContent = child.node.props._dashprivate_layout.props.toolboxContent
                    ? child.node.props._dashprivate_layout.props.toolboxContent
                    : null;

                return renderDashComponent(toolboxContent);
            }
            if (child.node.props._dashprivate_layout && child.node.props._dashprivate_layout.props) {
                const content = typeof child.node.props._dashprivate_layout.props.defaultName === 'string'
                    ? child.node.props._dashprivate_layout.props.defaultName
                    : child.node.props._dashprivate_layout.props.id;
                return content;
            }
            return child.props.id;
        } catch (e) {
            console.log('Ex 1', e)
        }
    }

    const renderToolboxItem = (child, index) => {
        try {

            const key = child.props.id || `toolbox-item-${index}`;
            const _data_grid = { x: 0, y: 0, w: 1, h: 2 };
            const content = renderContent(child);

            console.log('dataGrd', _data_grid, 'content', content)

            return (
                <div
                    key={key}
                    className="item toolbox"
                    data-grid={_data_grid}
                    draggable="true"
                    unselectable="on"
                    onDragStart={handleDragStart(key)}
                >
                    <div className="toolbox-item-content">
                        {component(content)}
                    </div>
                </div>
            );
        } catch (e) {
            console.log('Ex 2', e)
        }
    };

    return (
        <div className="toolbox-container">
            <span className="toolbox-title">{title}</span>
            {items.length > 0 && (
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
                    {items.map(renderToolboxItem)}
                </ResponsiveReactGridLayout>)}
            {items.length == 0 && (
                <div className="toolbox-slim"></div>
            )}
        </div>
    );
};

ToolBox.propTypes = {
    items: PropTypes.array.isRequired,
    title: PropTypes.string,
    component: PropTypes.func,
    layouts: PropTypes.object,
    breakpoints: PropTypes.object
};

ToolBox.defaultProps = {
    title: "Toolbox",
    component: (label) => <span>{label}</span>
};

export default ToolBox;