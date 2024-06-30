import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import ToolBox from './ToolBox2.react';
import GridItem from './GridItem.react'
import { getFromLocalStorage, saveToLocalStorage } from '../localStorage';
import { Responsive, WidthProvider as widthProvider } from 'react-grid-layout';
import { normaliseChildren, normalizeToolboxItems, defaultItemLayout, distributeItems, generateToolboxItems } from '../utils';

import {
    NROWS,
    ROW_HEIGHT,
    BREAKPOINTS,
    GRID_COLS_RESPONSIVE,
    NCOLS_RESPONSIVE,
} from '../constants';

import useComms from '../useComms';

const ResponsiveReactGridLayout = widthProvider(Responsive);

const calculateInitialLayout = (props, children) => {
    let {
        id,
        layouts: providedLayouts,
        clearSavedLayout = false,
        ncols = NCOLS_RESPONSIVE,
        nrows = NROWS,
        breakpoints = BREAKPOINTS,
        gridCols = GRID_COLS_RESPONSIVE,
        defaultInToolbox
    } = props;

    // Build layout on inital start
    //   Priority to client local store [except if specified]
    //   Then layout
    //   And then DashboardItem [except if specified])

    if (clearSavedLayout) {
        saveToLocalStorage(`${id}-layouts`, null);
    }
    const savedLayout = getFromLocalStorage(`${props.id}-layouts`);

    let layouts = {};

    // Define the layout for each specific item / breakpoint
    for (var bkp in breakpoints) {
        const layout = children.map((child) => {
            let itemLayout;

            // First we check if we find the child in the saved layouts
            if (savedLayout && savedLayout[bkp]) {
                itemLayout = savedLayout[bkp].find(el => el.i === child.id);
            }
            
            // Now we check if the child is in the provided layouts
            if (!itemLayout && providedLayouts && providedLayouts[bkp]) {
                itemLayout = providedLayouts[bkp].find(el => el.i === child.id);
            }

            // If we still do not have the childs layout, then we make it as long as it's a DashboardItem.

            let childProvidedLayout = {};
            if (!itemLayout && child.isDashboardItem) {
                // The layout of a stored toolbox item will be missing if we have a saved layout.
                // Therefore put it into toolbox.
                if (savedLayout) {
                    defaultInToolbox = true;
                }

                const {
                    id = {},
                    x = {},
                    y = {},
                    w = {},
                    h = {},
                    inToolbox
                } = child.props;

                // Layout as provided on the child
                childProvidedLayout = {
                    i: id,
                    x: x,
                    y: y,
                    w: w,
                    h: h,
                    inToolbox: inToolbox || defaultInToolbox
                };

                            }

            // todo: what is the scenario where we dont have a layout
            // and it's not a dashboard item?
            if (!itemLayout) {
                itemLayout = defaultItemLayout(
                    childProvidedLayout,
                    child.id,
                    child.key,
                    ncols[bkp],
                    nrows,
                    gridCols[bkp],
                    childProvidedLayout.inToolbox || defaultInToolbox
                );

                            }

            return itemLayout;
        });

        layouts[bkp] = layout;
    }
    return layouts;
}

const ToolBoxGrid2 = (props) => {

    let [breakpoint, setBreakpoint] = useState(props.currentBreakpoint || 'lg');

    let [activeWindows, setActiveWindows] = useState({});
    let [items, setItems] = useState([]);
    let [gridLayouts, setGridLayouts] = useState({});
    let [toolboxLayouts, setToolboxLayouts] = useState({});

    let [toolboxItems, setToolboxItems] = useState([]);

    useEffect(() => {

        let normalizedChildren = normaliseChildren(props.children);
        setItems(normalizedChildren);

        let lays = calculateInitialLayout(props, normalizedChildren);
                // setLayouts(lays);

        let gl = {};
        Object.keys(lays).forEach(bp => {
            gl[bp] = lays[bp].filter(l => !l.inToolbox);
        });
        setGridLayouts(gl);
        let tl = {};
        Object.keys(lays).forEach(bp => {
            tl[bp] = lays[bp].filter(l => l.inToolbox);
        });
        setToolboxLayouts(tl);

                // let {gridItems, toolboxItems} = distributeItems(normalizedChildren, lays);
        let tbxItms = normalizeToolboxItems(props.children);
                setToolboxItems(tbxItms);

    }, []);

    useEffect(() => {

        saveToLocalStorage(`${props.id}-layouts`, gridLayouts);

    }, [gridLayouts]);

    let sendMessage = useComms('toolbox', (msg) => {
        // if (msg.type == 'remove') {
        //     setLayouts(prev => {
        //         let newState = { ...prev };
        //         newState[breakpoint] = newState[breakpoint].filter(i => {
        //                     //             if (i.i !== droppedItemId) {
        //                 return true;
        //             } else {
        //                         //                 return false;
        //             }
        //         })
        //         return newState;
        //     })
        // }
    }, 'json');

    const handleResizeItemStart = (layout, oldItem, newItem, placeholder, e, element) => {
        setActiveWindows(prev => {
            let newState = { ...prev };
            newState[oldItem.i] = true;
            return newState;
        });
    }

    const handleResizeItemStop = (layout, oldItem, newItem, placeholder, e, element) => {
        setActiveWindows(prev => {
            let newState = { ...prev };
            newState[oldItem.i] = false;
            return newState;
        });
    }

    const handleDragItemStart = (layout, oldItem, newItem, placeholder, e, element) => {
        setActiveWindows(prev => {
            let newState = { ...prev };
            newState[oldItem.i] = true;
            return newState;
        });
    }

    const handleDragItemStop = (layout, oldItem, newItem, placeholder, e, element) => {
        setActiveWindows(prev => {
            let newState = { ...prev };
            newState[oldItem.i] = false;
            return newState;
        });
    }

    /**
     * We need to capture the changes in break point to find it for the right toolbox. 
     * It will enable us to store different configurations for sizes
     */
    const handleBreakpointChange = (breakpoint) => {
        setBreakpoint(breakpoint);
    };

    const handleLayoutChange = (current_layout, all_layouts) => {
        
        setGridLayouts(prev => {
            let nextState = { ...prev };

            current_layout.forEach(lay => {
                let el = nextState[breakpoint].find(e => e.i == lay.i);
                if (el) {
                    el.x = lay.x;
                    el.y = lay.y;
                    el.h = lay.h;
                    el.w = lay.w;
                    nextState[breakpoint] = nextState[breakpoint].filter(e => e.i !== lay.i);
                    nextState[breakpoint].push(el);
                }
            })

            return nextState;
        })
    };

    /**
     * Handle the close button on a grid layout item being clicked - this should
     * result in the item being moved to the toolbox
     */
    const handleCloseItemClicked = (id) => () => {
        
        // remove from the grid layout for this breakpoint
        let layout = {};
        setGridLayouts(prev => {
            let newState = { ...prev };
            newState[breakpoint] = newState[breakpoint].filter(i => {
                if (i.i !== id) {
                    return true;
                } else {
                    layout = {...i};
                                        return false;
                }
            })
            return newState;
        });
        setToolboxLayouts(prev => {
            let newState = { ...prev };
            layout.inToolbox = true;
            newState[breakpoint].push(layout);
            return newState;
        });
        
        sendMessage({type: 'add', 'id': id})
    }

    const calculateDimension = (val, def) => {
        if (val > def) return def;
        if (val <= 0) return def;
        return val;
    };

    const handleDrop = (layout, layoutItem, _event) => {

        _event.persist();

        const droppedItemId = _event.dataTransfer.getData('text/plain');

        // Calculate the max available space from x/y
        let newX = layoutItem?.x ?? 0;
        let newY = layoutItem?.y ?? 0;

        var layoutItems = gridLayouts[breakpoint];

        var limit = layoutItems.reduce((p, c) => {
            if (c.x > newX && c.x < p.x) p.x = c.x;
            if (c.y > newY && c.y < p.y) p.y = c.y;
            return p;
        }, { x: GRID_COLS_RESPONSIVE[breakpoint], y: 100 })

        if (limit.y == 100) limit.y = 0;

        const newItem = {
            i: droppedItemId,
            x: newX,
            y: newY,
            w: calculateDimension(limit.x - newX, props.onDropWidth),
            h: calculateDimension(limit.y - newY, props.onDropHeight),
            inToolbox: false,
        };

        setGridLayouts(prev => {
            let newState = { ...prev };
            newState[breakpoint].push(newItem);
            return newState;
        })
        setToolboxLayouts(prev => {
            let newState = { ...prev };
            newState[breakpoint] = newState[breakpoint].filter(i => {
                                if (i.i !== droppedItemId) {
                    return true;
                } else {
                                        return false;
                }
            })
            return newState;
        })

        sendMessage({type: 'remove', 'id': droppedItemId})
    };

    let { toolboxItems: toolboxItems2, gridItems } = distributeItems(items, gridLayouts, breakpoint);

    const {
        breakpoints = BREAKPOINTS,
        gridCols = GRID_COLS_RESPONSIVE,
        height: rowHeight = ROW_HEIGHT,
        className,
        style,
        toolboxTitle,
        toolboxComponent
    } = props;
    
    
    return (<>
        {props.enableToolbox && (
        <ToolBox
            breakpoints={breakpoints}
            layouts={toolboxLayouts}
            title={toolboxTitle}
            component={toolboxComponent}
            items={toolboxItems}
            controlled={true}
        />
        )}

        <ResponsiveReactGridLayout
            className={className}
            style={style}
            layouts={gridLayouts}
            cols={gridCols}
            breakpoints={breakpoints}
            rowHeight={rowHeight}
            onBreakpointChange={handleBreakpointChange}
            onDrop={handleDrop}
            onLayoutChange={handleLayoutChange}
            onResizeStart={handleResizeItemStart}
            onResizeStop={handleResizeItemStop}
            onDragStart={handleDragItemStart}
            onDragStop={handleDragItemStop}
            {...props}
        >
            {gridLayouts && gridItems.map((item) => {

                const layout = gridLayouts[breakpoint]?.find(i => i.i == item.id) || {};

                const {
                    x = 0,
                    y = 0,
                    w = 4,
                    h = 4,
                    i = ""
                } = layout;

                const pos = { x: x, y: y, w: w, h: h, i: i };
                
                return (
                    <GridItem
                        key={item.id}
                        className={"item"}
                        data-grid={pos}
                        canClose={true}
                        onCloseClicked={handleCloseItemClicked(item.id)}
                        active={activeWindows[item.key] || false}
                    >{item.element}</GridItem>
                );
            })}
        </ResponsiveReactGridLayout>
    </>);
}

ToolBoxGrid2.defaultProps = {
    save: true,
    clearSavedLayout: false,
    children: [],
    style: {},
    className: '',
    // Other props defined by react-grid-layout
    autoSize: true,
    // A CSS selector for tags that will not be draggable.
    draggableCancel: '',
    // A CSS selector for tags that will act as the draggable handle.
    draggableHandle: '',
    // If true, the layout will compact vertically
    verticalCompact: true,
    // Compaction type.
    compactType: 'vertical',
    // Margin between items [x, y] in px.
    margin: [10, 10],
    // Padding inside the container [x, y] in px
    containerPadding: [10, 10],
    // Flags
    isDraggable: true,
    isResizable: true,
    isBounded: false,
    useCSSTransforms: true,
    transformScale: 1,
    preventCollision: false,
    isDroppable: true,
    resizeHandles: ['se'],
    toolbox: { lg: [], md: [], sm: [] },
    currentBreakpoint: 'lg',
    onDropHeight: 5,
    onDropWidth: 4,
    defaultInToolbox: false,
    enableToolbox: true
};

ToolBoxGrid2.propTypes = {
    /**
     * (string) The ID used to identify this component in Dash callbacks.
     * The id is also used to automatically save the layout on client side.
     */
    id: PropTypes.string,

    /**
     * Layout is a list(python)/vector(R) of dictionnary(Python)/list(R) with the format:
     * {x: number, y: number, w: number, h: number}
     * The index into the layout must match the id used on each item component with DashboardItem.
     * If you choose to use custom keys, you can specify that key in the layout
     * array objects like so:
     * {i: string, x: number, y: number, w: number, h: number}
     * The ID used to identify this component in Dash callbacks.
     * The id is also used to automatically save the layout on client side.
     */
    layouts: PropTypes.object,

    /**
     * ({breakpoint: number}) The breakpoints for the responsive layout.
     * For each screen size (breakpoint) we can define a different layout.
     * (see also 'layouts' and 'gridCols' arguments)
     * Default value is {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}
     */
    breakpoints: PropTypes.object,

    /**
     * ({breakpoint: number}) the number of columns in the grid layout.
     * Default value is {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}.
     */
    gridCols: PropTypes.object,

    /**
     * (string) The title above the toolbox.
     */
    toolboxTitle: PropTypes.string,

    /**
     * (React.Component) The custom component to render the toolbox item
     */
    toolboxComponent: PropTypes.func,

    /**
     * Children is a list of the items (dash Components and/or
     * DashboardItem) to diplay on the layout.
     * By default all the items can be dragged and resized.
     */
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),

    /**
     * (bool) If True, then the layout is automatically saved on client browser.
     * Default value is True
     */
    save: PropTypes.bool,

    /**
     * (bool) If set to true, the position of elements saved on client side
     * will be cleared on the next page load.
     */
    clearSavedLayout: PropTypes.bool,

    /**
     * ({breakpoint: number}) the default number of columns by item.
     * Default value is {lg: 6, md: 5, sm: 3, xs: 4, xxs: 2}.
     */
    ncols: PropTypes.object,

    /**
     * (number) the default number of row by item.
     * Default value is 8.
     */
    nrows: PropTypes.number,

    /**
     * (number) height of a row (in px).
     * Default value is 30.
     */
    height: PropTypes.number,

    /**
     * (string) class passed to the react-grid-layout component
     */
    className: PropTypes.string,

    /**
     * (dict) css style passed to the react-grid-layout component
     */
    style: PropTypes.object,

    /**
     * (bool) Other props defined by react-grid-layout
     * If true, the container height swells and contracts to fit contents
     */
    autoSize: PropTypes.bool,

    /**
     * (string) A CSS selector for tags that will not be draggable.
     * or example: draggableCancel:'.MyNonDraggableAreaClassName'
     * If you forget the leading . it will not work.
     */
    draggableCancel: PropTypes.string,

    /** 
     * A CSS selector for tags that will act as the draggable handle.
     * For example: draggableHandle:'.MyDragHandleClassName'
     * If you forget the leading . it will not work.
     */
    draggableHandle: PropTypes.string,

    /**
     * If true, the layout will compact vertically
     */
    verticalCompact: PropTypes.bool,

    /** 
     * Compaction type.
     */
    compactType: PropTypes.oneOf(['vertical', 'horizontal']),

    /**
     * Margin between items [x, y] in px.
     */
    margin: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.object,
    ]),

    /**
     * Padding inside the container [x, y] in px
     */
    containerPadding: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.object,
    ]),

    /**
     * Are items draggable
     */
    isDraggable: PropTypes.bool,

    /**
     * Are items resizable
     */
    isResizable: PropTypes.bool,

    /**
     * Are items resizable
     */
    isBounded: PropTypes.bool,

    /**
     * Uses CSS3 translate() instead of position top/left.
     * This makes about 6x faster paint performance
     */
    useCSSTransforms: PropTypes.bool,

    /**
     * If parent DOM node of ResponsiveReactGridLayout or ReactGridLayout has "transform: scale(n)" css property,
     * we should set scale coefficient to avoid render artefacts while dragging.
     */
    transformScale: PropTypes.number,

    /**
     * If true, grid items won't change position when being
     * dragged over.
     */
    preventCollision: PropTypes.bool,

    /**
     * If true, droppable elements (with `draggable={true}` attribute)
     * can be dropped on the grid. It triggers "onDrop" callback
     * with position and event object as parameters.
     * It can be useful for dropping an element in a specific position
     * 
     * NOTE: In case of using Firefox you should add
     * `onDragStart={e => e.dataTransfer.setData('text/plain', '')}` attribute
     * along with `draggable={true}` otherwise this feature will work incorrect.
     * onDragStart attribute is required for Firefox for a dragging initialization
     *
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
     */
    isDroppable: PropTypes.bool,

    /** 
     * Defines which resize handles should be rendered
     * Allows for any combination of:
     * 's' - South handle (bottom-center)
     * 'w' - West handle (left-center)
     * 'e' - East handle (right-center)
     * 'n' - North handle (top-center)
     * 'sw' - Southwest handle (bottom-left)
     * 'nw' - Northwest handle (top-left)
     * 'se' - Southeast handle (bottom-right)
     * 'ne' - Northeast handle (top-right)
     */
    resizeHandles: PropTypes.arrayOf(
        PropTypes.oneOf(['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'])
    ),

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    /**
     * The toolbox layout
     */
    toolbox: PropTypes.object,

    /**
     * current breakpoint
     */
    currentBreakpoint: PropTypes.string,

    /**
     * Set the default height of items that are dropped from the toolbox into the grid. default is 5
     */
    onDropHeight: PropTypes.number,

    /**
     * Set the default height of items that are dropped from the toolbox into the grid. default is 4
     */
    onDropWidth: PropTypes.number,

    /**
     * This value sets if children, which do not have inToolbox defined, should be in the Toolbox by default
     */
    defaultInToolbox: PropTypes.bool,

    /**
     * When set to false no toolbox will be rendered
     */
    enableToolbox: PropTypes.bool,

    /**
     * When an item is removed from the grid, delete it's underlying element rather than just hiding it
     */
    deleteOnRemove: PropTypes.bool
};

export default ToolBoxGrid2;