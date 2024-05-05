import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './style.css';

import {
    BREAKPOINTS
} from '../constants';

import { renderDashComponent } from 'dash-extensions-js'

import { normaliseChildren } from '../utils';

import useComms from '../useComms';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const calculateInitialLayout = (props, children, breakpoints) => {

    let layouts = {};

    // Define the layout for each specific item / breakpoint
    for (var bkp in breakpoints) {
        const layout = children.map((child) => {

            const {
                id = {},
                x = {},
                y = {},
                w = {},
                h = {},
                inToolbox
            } = child.props;

            let itemLayout = {
                i: child.id,
                x: x,
                y: y,
                w: w,
                h: h,
                inToolbox
            };

            return itemLayout;
        });

        layouts[bkp] = layout;
    }

    console.log('toolbox layouts', layouts)

    return layouts;
}

function ToolBox(props) {

    let [layouts, setLayouts] = useState(props.layouts || {});
    let [items, setItems] = useState([]);
    let [breakpoints, setBreakpoints] = useState(props.breakpoints || BREAKPOINTS);
    let [breakpoint, setBreakpoint] = useState('lg')

    let sentMessage = useComms('toolbox', (msg) => {
        console.log('toolbox rec', msg)
        if (msg.type == 'remove') {
            setItems(prev => {
                let newState = [...prev];
                console.log('map', newState)
                newState.map(n => {
                    if (n.id == msg.id) {
                        n.hidden = true;
                    }
                    return n;
                })
                return newState;
            })
        }
    }, 'json');

    useEffect(() => {

        console.log('loading...');

        let normalizedChildren = normaliseChildren(props.items);
        setItems(normalizedChildren);

        let lays = calculateInitialLayout(props, normalizedChildren, breakpoints);
        console.log('lays', lays)
        // setLayouts(lays);

        let tl = {};
        Object.keys(lays).forEach(bp => {
            tl[bp] = lays[bp].filter(l => l.inToolbox);
        });
        setLayouts(tl);

        // let {gridItems, toolboxItems} = distributeItems(normalizedChildren, lays)

        console.log('initial layout', lays);

    }, [props.items]);

    Object.keys(layouts).forEach(bp => {
        layouts[bp] = layouts[bp].map(l => {
            l.h = 2;
            l.w = 1;
            l.x = 0;
            l.y = 0;
            return l;
        });
    })

    const handleDragStart = (id) => (e) => {
        e.dataTransfer.setData('text/plain', id);
    };

    const renderContent = (child) => {
        console.log('renderContent', child)
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
            if (child.node.props.toolboxContent) {
                return renderDashComponent(child.node.props.toolboxContent);
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

            console.log('renderToolboxItem', _data_grid, 'content', content)

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
                        {props.component(content)}
                    </div>
                </div>
            );
        } catch (e) {
            console.log('Ex 2', e)
        }
    };

    console.log('render toolbox')
    let itms = items.filter(i => !i.hidden);
    return (
        <div className="toolbox-container">
            <span className="toolbox-title">{props.title}</span>
            {itms.length > 0 && (
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
                    {itms.map(renderToolboxItem)}
                </ResponsiveReactGridLayout>)}
            {itms.length == 0 && (
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