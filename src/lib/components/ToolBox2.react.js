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
import { getFromLocalStorage, saveToLocalStorage } from '../localStorage';

import useComms from '../useComms';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const calculateInitialLayout = (props, children, breakpoints) => {

    const savedLayout = (props.linkedId && getFromLocalStorage(`${props.linkedId}-layouts`)) || {};

    console.log(props.title, 'toolbox saved layout', savedLayout)

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
                // inToolbox = true
            } = child.props;

            let itemLayout = {
                i: child.id,
                x: x,
                y: y,
                w: w,
                h: h,
                inToolbox: true
            };

            // saved item layout here means that one is in the grid
            let savedItemLayout = savedLayout[bkp] && savedLayout[bkp].find(el => el.i === child.id);
            if (!savedItemLayout) {
                return itemLayout;
            }
            
            return null;
        });

        layouts[bkp] = layout.filter(i => i);
    }

    console.log(props.title, 'toolbox layouts', layouts)

    return layouts;
}

function ToolBox(props) {

    let [layouts, setLayouts] = useState({});
    let [items, setItems] = useState([]);
    let [breakpoints, setBreakpoints] = useState(props.breakpoints || BREAKPOINTS);
    let [breakpoint, setBreakpoint] = useState('lg')

    let sentMessage = useComms('toolbox', (msg) => {
        console.log('toolbox rec', msg)
        if (msg.type == 'remove') {
            setLayouts(prev => {
                let newState = { ...prev };
                newState[breakpoint] = newState[breakpoint].filter(i => {
                    console.log(i, msg.id)
                    if (i.i !== msg.id) {
                        return true;
                    } else {
                        console.log('removed', msg.id, 'from toolbox');
                        return false;
                    }
                });
                return newState;
            })
        } else if (msg.type === 'add') {
            setLayouts(prev => {
                let newState = { ...prev };
                let newLayout = {
                    i: msg.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 1,
                    inToolbox: true
                };
                newState[breakpoint] = [...newState[breakpoint], newLayout] 
                return newState;
            });
        }
    }, 'json');

    useEffect(() => {

        console.log('loading...');

        let normalizedChildren = normaliseChildren(props.items);
        setItems(normalizedChildren);

        if (!props.controlled) {
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
        }

    }, [props.items]);
    

    if (props.controlled) {
        useEffect(() => {
            setLayouts(props.layouts || {})
        }, [props.layouts])
    }

    // reset position and sizes
    Object.keys(layouts).forEach(bp => {
        layouts[bp] = layouts[bp].map(l => {
            l.h = 2;
            l.w = 1;
            l.x = 0;
            l.y = 0;
            return l;
        });
    })

    const handleBreakpointChange = (breakpoint) => {
        setBreakpoint(breakpoint);
    };

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
    let itms = items.filter(i => {
        const layoutItem = layouts[breakpoint]?.find(itm => itm.i === i.id);
        console.log(props.title, 'layoutItem', layoutItem)
        return layoutItem && layoutItem.inToolbox;
    });
    
    console.log('breakpoint', breakpoint)
    console.log(props.title, 'layouts', layouts)
    console.log(props.title, 'items', items)
    console.log(props.title, 'itms', itms)

    return (
        <div className="toolbox-container toolbox-bg">
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
                    onBreakpointChange={handleBreakpointChange}
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
    linkedId: PropTypes.string.isRequired,
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