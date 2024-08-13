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

import { normaliseChildren, normalizeToolboxItems } from '../utils';
import { getFromLocalStorage, saveToLocalStorage } from '../localStorage';

import useComms from '../useComms';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const calculateInitialLayout = (props, children, breakpoints) => {

    const savedLayout = (props.linkedId && getFromLocalStorage(`${props.linkedId}-layouts`)) || {};

    let layouts = {};

    // Define the layout for each specific item / breakpoint
    for (var bkp in breakpoints) {
        const layout = children.map((child) => {

            // saved item layout here means that one is in the grid so we shouldn't show it in the toolbox
            let savedItemLayout = savedLayout[bkp] && savedLayout[bkp].find(el => el.i === child.id);
            if (!savedItemLayout) {
                return {
                    i: child.id,
                    x: 0,
                    y: 0,
                    w: 1,
                    h: 2,
                    inToolbox: true
                };
            }

            return null;
        });

        layouts[bkp] = layout;
    }

    return layouts;
}

function ToolBox(props) {

    let [layouts, setLayouts] = useState({});
    let [items, setItems] = useState([]);
    let [breakpoints, setBreakpoints] = useState(props.breakpoints || BREAKPOINTS);
    let [breakpoint, setBreakpoint] = useState('lg')

    let sentMessage = useComms('toolbox', (msg) => {
        if (msg.type == 'remove') {
            removeItemFromLayout(msg.id);
        } else if (msg.type === 'add') {
            addItemToLayout(msg.id);
        }
    }, 'json');

    useEffect(() => {

        let normalizedChildren = normalizeToolboxItems(props.items);
        setItems(normalizedChildren);

        if (!props.controlled) {
            initialiseUncontrolledLayout(normalizedChildren);
        }

    }, [props.items]);

    if (props.controlled) {
        useEffect(() => {
            setLayouts(props.layouts || {})
        }, [props.layouts])
    }

    /**
     * If it's an uncontrolled layout that means that this toolbox is responsible
     * internally for how it lays things out. Controlled means the props pass in the 
     * layout information.
     * @param {*} normalizedChildren 
     */
    const initialiseUncontrolledLayout = (normalizedChildren) => {
        let lays = calculateInitialLayout(props, normalizedChildren, breakpoints);
        setLayouts(lays);
    }

    const removeItemFromLayout = (id) => {
        setLayouts(prev => {
            let newState = { ...prev };
            newState[breakpoint] = newState[breakpoint].filter(i => {
                if (i && i.i !== id) {
                    return true;
                } else {
                    return false;
                }
            });
            return newState;
        })
    }

    const addItemToLayout = (id) => {
        setLayouts(prev => {
            let newState = { ...prev };
            let newLayout = {
                i: id,
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

    const handleBreakpointChange = (breakpoint) => {
        setBreakpoint(breakpoint);
    };

    const handleDragStart = (id) => (e) => {
        e.dataTransfer.setData('text/plain', id);
    };

    const renderContent = (child) => {
        return renderDashComponent(child.element);
    }

    const renderToolboxItem = (child, index) => {
        try {
            const key = child.id || `toolbox-item-${index}`;
            const _data_grid = { x: 0, y: 0, w: 1, h: 2 };
            const content = renderContent(child);

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
        }
    };

    let lays = { ...layouts };
    // reset position and sizes
    Object.keys(lays).forEach(bp => {
        lays[bp] = lays[bp].filter(i => !!i).map(ln => {
            let b = { ...ln };
            b.i = ln.i;
            b.h = 2;
            b.w = 1;
            b.x = 0;
            b.y = 0;
            b.u = 1;
            return b;
        });
    });

    let itms = items.filter(i => {
        const layoutItem = lays[breakpoint]?.find(itm => itm.i === i.id);
        return layoutItem && layoutItem.inToolbox;
    });


    return (
        <div className="toolbox-container toolbox-bg">
            <span className="toolbox-title">{props.title}</span>
            {itms.length > 0 && (
                <ResponsiveReactGridLayout
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    breakpoints={breakpoints}
                    rowHeight={30}
                    layouts={lays}
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
    id: PropTypes.string,
    linkedId: PropTypes.string,
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
