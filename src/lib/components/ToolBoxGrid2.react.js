import React, { useState, useEffect } from 'react';

import ToolBox from './ToolBox2.react';
import GridItem from './GridItem.react'
import { categorizeContent, appendInToolboxFalse, filterLayoutForToolboxItems } from '../utils';
import { getFromLocalStorage, saveToLocalStorage } from '../localStorage';

import PropTypes from 'prop-types';
import { Responsive, WidthProvider as widthProvider } from 'react-grid-layout';


import {
    NROWS,
    ROW_HEIGHT,
    BREAKPOINTS,
    GRID_COLS_RESPONSIVE,
    NCOLS_RESPONSIVE,
} from '../constants';

const ResponsiveReactGridLayout = widthProvider(Responsive);

const defaultItemLayout = (item_layout, id, key, ncols, nrows, max_cols) => {
    const nb_items_x = Math.floor(max_cols / ncols);
    const col = key % nb_items_x;
    const row = Math.floor(key / nb_items_x);

    // Default values for layout
    const defaultChildLayout = {
        i: id.toString() || key.toString(),
        x: col * ncols,
        y: row,
        w: ncols,
        h: nrows,
    };

    // Merge with incoming item_layout, prioritizing values from item_layout
    return Object.assign({}, defaultChildLayout, item_layout);
};

const normaliseChildren = (children) => {
    children = Array.isArray(children) ? children : [children];

    let results = children.map((child, key) => {
        let childProps = {};
        let childId;
        let isDashboardItem = false;

        console.log('norm', child.props)

        if (typeof itm === 'string') {
            childId = key.toString();
        } else {
            childProps = child.props._dashprivate_layout
                ? child.props._dashprivate_layout.props
                : child.props;

            isDashboardItem =
                (child.props._dashprivate_layout
                    ? child.props._dashprivate_layout.type
                    : child.type.name) === 'DashboardItemResponsive';

            childId = childProps.id;

            if (typeof childId === 'undefined') {
                childId = key.toString();
            } else if (typeof childId === 'object') {
                childId = JSON.stringify(childId);
            }
        }

        var res = {
            id: childId,
            node: child,
            key: key,
            props: childProps,
            isDashboardItem: isDashboardItem,
            ...child.props
        }
        console.log('res', res);
        return res;
    })

    return results;
}

const calculateInitialLayout = (props, items) => {
    const {
        id,
        layouts: providedLayouts,
        // clearSavedLayout,
        ncols = NCOLS_RESPONSIVE,
        nrows = NROWS,
        breakpoints = BREAKPOINTS,
        gridCols = GRID_COLS_RESPONSIVE,
        // toolbox,
        // currentBreakpoint,
        defaultInToolbox
    } = props;

    // Build layout on inital start
    //   Priority to client local store [except if specified]
    //   Then layout
    //   And then DashboardItem [except if specified])
    const savedLayout = getFromLocalStorage(`${id}-layouts`);

    console.log('savedLayout', savedLayout)
    console.log('providedLayouts', providedLayouts)

    const layouts = {};

    for (var bkp in breakpoints) {
        const layout = items.map((item) => {
            let itemLayout;

            // Define the layout for the specific item / breakpoint
            let source = 'default';
            // First we check if we find the child in the saved layouts
            if (savedLayout && savedLayout[bkp]) {
                source = 'saved';
                itemLayout = savedLayout[bkp].find(
                    (el) => el.i === item.id
                );
            }

            // Now we check if the child is in the provided layouts
            if (!itemLayout && providedLayouts && providedLayouts[bkp]) {
                source = 'provided';
                itemLayout = providedLayouts[bkp].find(
                    (el) => el.i === item.id
                );
            }

            // If we still do not have the child, then we make it as long as its a DashboardItem
            // The layout of a stored toolbox item will be missing if we have a saved layout.
            // Therefore put it into toolbox
            let itemProvidedLayout = {};
            if (!itemLayout && item.isDashboardItem) {
                source = 'isDashboardItem';
                // The default value for inToolbox is false. This triggers if nothing is provided
                let hasSavedLayout = !!savedLayout;

                const {
                    id = {},
                    x = {},
                    y = {},
                    w = {},
                    h = {},
                    inToolbox = hasSavedLayout || defaultInToolbox
                } = item.props;

                itemProvidedLayout = {
                    i: id,
                    x: x,
                    y: y,
                    w: w,
                    h: h,
                    inToolbox: hasSavedLayout || inToolbox
                };
            }

            if (!itemLayout) {
                itemLayout = defaultItemLayout(
                    itemProvidedLayout,
                    item.id,
                    item.key,
                    ncols[bkp],
                    nrows,
                    nrows,
                    gridCols[bkp],
                    itemProvidedLayout.inToolbox || defaultInToolbox
                );
                
                console.log('init layout', bkp, item, itemLayout, items, source)
            }

            return itemLayout;
        });

        layouts[bkp] = layout;
    }

    // let { filteredLayout, toolboxLayout } =
    //     filterLayoutForToolboxItems(layouts);

    // return { layouts: filteredLayout, toolbox: toolboxLayout, currentBreakpoint };
    return layouts;
}

const distributeItems = (items, gridLayouts, breakpoint) => {
    const toolboxItems = [];
    const gridItems = [];
    items.forEach((item) => {
        const isInLayout = gridLayouts[breakpoint]?.some(itm => itm.i === item.id);
        if (isInLayout) {
            gridItems.push(item);
        } else {
            toolboxItems.push(item);
        }
    });
    return { gridItems, toolboxItems };
}

const ToolBoxGrid2 = (props) => {

    // process the children and then layout/toolbox etc. and normalise

    let [breakpoint, setBreakpoint] = useState(props.currentBreakpoint || 'lg');
    let [toolboxLayouts, setToolboxLayouts] = useState({});
    // let [gridLayouts, setGridLayouts] = useState({});
    let [gridLayouts, setGridLayouts] = useState({});


    let [items, setItems] = useState(normaliseChildren(props.children));
    // let [toolboxItems, setToolboxItems] = useState([]);
    let [allLayouts, setAllLayouts] = useState();
    let [activeWindows, setActiveWindows] = useState({});

    useEffect(() => {

        let lays = calculateInitialLayout(props, items);
        console.log(lays);

        let { filteredLayout, toolboxLayout } =
            filterLayoutForToolboxItems(lays);

        console.log('lays', filteredLayout, toolboxLayout)

        setGridLayouts(filteredLayout);
        setToolboxLayouts(toolboxLayout);

    }, []);

    const handleResizeItemStart = (layout, oldItem, newItem, placeholder, e, element) => {
        setActiveWindows(prev => {
            let newState = {...prev};
            newState[oldItem.i] = true;
            return newState;
        });
    }

    const handleResizeItemStop = (layout, oldItem, newItem, placeholder, e, element) => {
        setActiveWindows(prev => {
            let newState = {...prev};
            newState[oldItem.i] = false;
            return newState;
        });
    }

    const handleDragItemStart = (layout, oldItem, newItem, placeholder, e, element) => {
        setActiveWindows(prev => {
            let newState = {...prev};
            newState[oldItem.i] = true;
            return newState;
        });
    }

    const handleDragItemStop = (layout, oldItem, newItem, placeholder, e, element) => {
        setActiveWindows(prev => {
            let newState = {...prev};
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
        console.log('handleLayoutChange', all_layouts)
        // First we save the layout to the local storage
        if (props.save) {
            all_layouts = appendInToolboxFalse(all_layouts);
            saveToLocalStorage(`${props.id}-layouts`, all_layouts);
        }
        // Set the state of the layout for render
        setAllLayouts({ all_layouts });
    };

    /**
     * Handle the close button on a grid layout item being clicked - this should
     * result in the item being moved to the toolbox
     */
    const handleCloseItemClicked = (id) => () => {

        // remove from the grid layout for this breakpoint
        setGridLayouts(prev => {
            let newState = {...prev};
            console.log(id, 'newState', newState, 'val', newState[breakpoint])
            newState[breakpoint] = newState[breakpoint].filter(i => i.i !== id);
            return newState;
        });

        // add to the toolbox layout for this breakpoint
        // setToolboxLayouts(prev => {
        //     let newState = {...prev};
        //     console.log(id, 'newState', newState, 'val', newState[breakpoint])
        //     newState[breakpoint] = newState[breakpoint].filter(i => i.i === id);
        //     return newState;
        // });
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
            let newState = {...prev};
            newState[breakpoint].push(newItem);
            return newState;
        })
    };

    let { toolboxItems, gridItems } = distributeItems(items, gridLayouts, breakpoint);

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
        <ToolBox
            breakpoints={breakpoints}
            // layouts={toolboxLayouts}
            title={toolboxTitle}
            component={toolboxComponent}
            items={toolboxItems}
        />

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
            {gridItems.map((item) => {
                const {
                    x = {},
                    y = {},
                    w = {},
                    h = {},
                } = item.props;

                return (
                    <GridItem
                        key={item.key}
                        className={"item"}
                        data-grid={{ x: x, y: y, w: w, h: h }}
                        canClose={true}
                        onCloseClicked={handleCloseItemClicked(item.id)}
                        active={activeWindows[item.key] || false}
                    >{item.node}</GridItem>
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
};

export default ToolBoxGrid2;