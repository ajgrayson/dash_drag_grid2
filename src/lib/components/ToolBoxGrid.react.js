import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider as widthProvider } from 'react-grid-layout';

import {
    NROWS,
    ROW_HEIGHT,
    BREAKPOINTS,
    GRID_COLS_RESPONSIVE,
    NCOLS_RESPONSIVE,
} from '../constants';

import { saveToLocalStorage, getFromLocalStorage } from '../localStorage';
import {
    filterLayoutForToolboxItems,
    categorizeContent,
    appendInToolboxFalse,
} from '../utils';

import ToolBox from './ToolBox.react.js';
import GridItem from './GridItem.react.js';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './style.css';

/**
 * ToolBoxGrid is an addition to the ResponsiveGridLayout
 *
 * It offers the functionallity to move children from the Grid into the toolbox and back.
 *
 * The layout of the grid and whats inside the toolbox is stored in a local coockie and will enable to save the layout.
 * The toolbox takes children of the type DashboardItemResponsive and renders them conditionally.
 *
 */

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

/**
 * DraggableDashboard is a component for building
 * dashboards with draggable and resizable items.
 * It takes a list of children and display them in
 * div elements that can be moved around the page.
 * The initial size of each element can either be
 * defined with the layout argument or by wrapping
 * each element with the DashboardItem component.
 * By default, DraggableDashboard will saved the
 * position of the elements on client side, when
 * moved on the page. But you can also save it
 * on server side by defining a callback with :
 * `Input("<my-id>", "layout")`.
 */
class ToolBoxGrid extends Component {

    constructor(props) {

        // Take all elememts passed from the parent we need
        super(props);
        this.state = {
            currentBreakpoint: props.currentBreakpoint,
            toolbox: this.props.toolbox,
            toolboxContent: [],
            layouts: {},
            gridContent: [],
            save: this.props.save,
            id: this.props.id,
            setProps: this.props.setProps,
            onDropHeight: this.props.onDropHeight,
            onDropWidth: this.props.onDropWidth,
            activeWindows: {}
        };

        this.handleResizeItemStart = this.handleResizeItemStart.bind(this);
        this.handleResizeItemStop = this.handleResizeItemStop.bind(this);
        this.handleDragItemStart = this.handleDragItemStart.bind(this);
        this.handleDragItemStop = this.handleDragItemStop.bind(this);
        // this.handleLayoutChange = this.handleLayoutChange.bind(this);
    }

    calculateDimension = (val, def) => {
        if (val > def) return def;
        if (val <= 0) return def;
        return val;
    }

    handleDrop = (layout, layoutItem, _event) => {
        console.log('handleDrop', layoutItem)
        _event.persist();
        this.setState((prevState) => {
            // Retrieve the data set in the drag start event
            const droppedItemId = _event.dataTransfer.getData('text/plain');
            const currentBreakpoint = prevState.currentBreakpoint;

            // Calculate the max available space from x/y
            let newX = layoutItem?.x ?? 0;
            let newY = layoutItem?.y ?? 0;
            var items = prevState.layouts[currentBreakpoint];
            var limit = items.reduce((p, c) => {
                if (c.x > newX && c.x < p.x) p.x = c.x;
                if (c.y > newY && c.y < p.y) p.y = c.y;
                return p;
            }, { x: GRID_COLS_RESPONSIVE[currentBreakpoint], y: 100 })

            if (limit.y == 100) limit.y = 0;

            const newItem = {
                i: droppedItemId,
                x: newX,
                y: newY,
                w: this.calculateDimension(limit.x - newX, prevState.onDropWidth),
                h: this.calculateDimension(limit.y - newY, prevState.onDropHeight),
                inToolbox: false,
            };
            // Update the layout array for the current breakpoint
            const updatedLayouts = {
                ...prevState.layouts,
                [currentBreakpoint]: [
                    ...prevState.layouts[currentBreakpoint],
                    newItem,
                ],
            };

            // Return the updated state
            let newState = {
                ...prevState,
                layouts: updatedLayouts,
            };

            console.log('onDrop', newState);

            return newState;
        });
    };

    /**
     * We need to capture the changes in break point to find it for the right toolbox. 
     * It will enable us to store different configurations for sizes
     */
    handleBreakpointChange = (breakpoint) => {
        console.log('handleBreakpointChange', breakpoint)
        this.setState((prevState) => {
            return {
                currentBreakpoint: breakpoint,
                toolbox: {
                    ...prevState.toolbox,
                    [breakpoint]:
                        prevState.toolbox[breakpoint] ||
                        prevState.toolbox[prevState.currentBreakpoint] ||
                        [],
                },
            };
        });
    };

    // handleLayoutChange = (current_layout, all_layouts) => {
    //     console.log('handleLayoutChange', current_layout, all_layouts)
    //     // First we save the layout to the local storage
    //     if (this.state.save) {
    //         all_layouts = appendInToolboxFalse(all_layouts);
    //         saveToLocalStorage(`${this.state.id}-layouts`, all_layouts);
    //     }
    //     // Set the state of the layout for render
    //     this.setState({ all_layouts });
    // };

    /**
     * Handle the close button on a grid layout item being clicked - this should
     * result in the item being moved to the toolbox
     * @param {Object} item 
     */
    handleCloseItemClicked = (item) => {
        console.log('handleCloseItemClicked', item)
        this.setState((prevState) => {
            const currentBreakpoint = prevState.currentBreakpoint;
            const currentToolbox = prevState.toolbox;
            const currentLayout = prevState.layouts;

            // Find the item in the currentLayout at currentBreakpoint
            const layoutIndex = currentLayout[currentBreakpoint].findIndex(
                (layoutItem) => layoutItem.i === item
            );

            // If the item is found, remove it from currentLayout and store it
            let toToolbox = null;
            if (layoutIndex !== -1) {
                toToolbox = currentLayout[currentBreakpoint][layoutIndex];
                currentLayout[currentBreakpoint].splice(layoutIndex, 1);
            }

            // Append the toToolbox item to the currentToolbox at the right breakpoint
            const updatedToolbox = [
                ...currentToolbox[currentBreakpoint],
                toToolbox,
            ];

            // Update the state of layout and toolbox to render the content
            return {
                layouts: currentLayout,
                toolbox: {
                    ...currentToolbox,
                    [currentBreakpoint]: updatedToolbox,
                },
            };
        },
            () => { });
    }

    handleResizeItemStart(layout, oldItem, newItem, placeholder, e, element) {
        this.setState(prev => {
            let newState = { ...prev };
            newState.activeWindows[oldItem.i] = true;
            return newState;
        })
    }

    handleResizeItemStop(layout, oldItem, newItem, placeholder, e, element) {
        this.setState(prev => {
            let newState = { ...prev };
            newState.activeWindows[oldItem.i] = false;
            return newState;
        })
    }

    handleDragItemStart(layout, oldItem, newItem, placeholder, e, element) {
        this.setState(prev => {
            let newState = { ...prev };
            newState.activeWindows[oldItem.i] = true;
            return newState;
        })
    }

    handleDragItemStop(layout, oldItem, newItem, placeholder, e, element) {
        this.setState(prev => {
            let newState = { ...prev };
            newState.activeWindows[oldItem.i] = false;
            return newState;
        })
    }

    calculateInitialLayout() {
        try {
            let { children = [] } = this.props;
            const {
                id,
                layouts: providedLayouts,
                clearSavedLayout,
                ncols = NCOLS_RESPONSIVE,
                nrows = NROWS,
                breakpoints = BREAKPOINTS,
                gridCols = GRID_COLS_RESPONSIVE,
                toolbox,
                currentBreakpoint,
                defaultInToolbox: inToolbox
            } = this.props;

            children = Array.isArray(children) ? children : [children];

            if (clearSavedLayout) {
                saveToLocalStorage(`${id}-layouts`, null);
            }

            // Build layout on inital start
            //   Priority to client local store [except if specified]
            //   Then layout
            //   And then DashboardItem [except if specified])
            const savedLayout = getFromLocalStorage(`${id}-layouts`);

            const layouts = {};
            let childProps, childId, isDashboardItem;

            for (var bkp in breakpoints) {
                // eslint-disable-next-line no-loop-func
                const layout = children.map((child, key) => {
                    let item_layout;

                    // Get the child id and props
                    // Depending on wether it is a string, a classic React component, or a DashboardItem
                    if (typeof child === 'string') {
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

                    // Define the layout for the specific item / breakpoint

                    // First we check if we find the child in the saved layouts
                    if (savedLayout && savedLayout[bkp]) {
                        item_layout = savedLayout[bkp].find(
                            (el) => el.i === childId || el.i === key.toString()
                        );
                    }

                    // Now we check if the child is in the provided layouts
                    if (!item_layout && providedLayouts && providedLayouts[bkp]) {
                        item_layout = providedLayouts[bkp].find(
                            (el) => el.i === childId
                        );
                    }

                    // If we still do not have the child, then we make it as long as its a DashboardItem
                    // The layout of a stored toolbox item will be missing if we have a saved layout.
                    // Therefore put it into toolbox
                    if (!item_layout && isDashboardItem) {
                        // The default value for inToolbox is false. This triggers if nothing is provided
                        let defaultToolbox = !!savedLayout;

                        const {
                            id = {},
                            x = {},
                            y = {},
                            w = {},
                            h = {},
                            inToolbox = inToolbox,
                        } = childProps;

                        const item_provided_layout = {
                            i: typeof id === 'string' ? id : id[bkp],
                            x: typeof x === 'number' ? x : x[bkp],
                            y: typeof y === 'number' ? y : y[bkp],
                            w: typeof w === 'number' ? w : w[bkp],
                            h: typeof h === 'number' ? h : h[bkp],
                            inToolbox: savedLayout ? defaultToolbox : inToolbox,
                        };

                        item_layout = defaultItemLayout(
                            item_provided_layout,
                            childId,
                            key,
                            ncols[bkp],
                            nrows,
                            nrows,
                            gridCols[bkp],
                            inToolbox
                        );
                    }

                    if (!item_layout) {
                        item_layout = defaultItemLayout(
                            {},
                            childId,
                            key,
                            ncols[bkp],
                            nrows,
                            nrows,
                            gridCols[bkp],
                            inToolbox
                        );
                    }
                    return item_layout;
                });

                layouts[bkp] = layout;
            }

            let { filteredLayout, toolboxLayout } =
                filterLayoutForToolboxItems(layouts);

            return { layouts: filteredLayout, toolbox: toolboxLayout, currentBreakpoint };
        } catch (e) {
            console.log('Ex 3', e)
        }
    }

    componentDidMount() {
        
        let { layouts, toolbox, currentBreakpoint } = this.calculateInitialLayout();

        this.setState((prevState) => {
            let newState = {
                ...prevState,
                layouts: layouts,
                toolbox: toolbox,
                currentBreakpoint: currentBreakpoint,
            };

            console.log('componentDidMount', newState)

            return newState;
        });

        console.log('componentDidMount', this.state)
    }

    render() {

        try {
            let { children = [], toolboxTitle, toolboxComponent } = this.props;
            console.log('render', this.state, 'children', children)

            const {
                breakpoints = BREAKPOINTS,
                gridCols = GRID_COLS_RESPONSIVE,
                height = ROW_HEIGHT,
                className,
                style,
            } = this.props;

            children = Array.isArray(children) ? children : [children];

            let {layoutContent: gridContent, toolboxContent} = categorizeContent(
                children,
                this.state.layouts,
                this.state.currentBreakpoint
            );

            gridContent = Array.isArray(gridContent) ? gridContent : [gridContent];

            toolboxContent = Array.isArray(toolboxContent)
                ? toolboxContent
                : [toolboxContent];
            return (
                <React.Fragment>
                    <ToolBox
                        breakpoint={breakpoints}
                        layouts={this.state.toolbox}
                        toolboxTitle={toolboxTitle}
                        toolboxComponent={toolboxComponent}
                        toolboxItems={toolboxContent}
                    />

                    <ResponsiveReactGridLayout
                        className={className}
                        style={style}
                        layouts={this.state.layouts}
                        cols={gridCols}
                        onBreakpointChange={this.handleBreakpointChange}
                        breakpoints={breakpoints}
                        rowHeight={height}
                        onDrop={this.handleDrop}
                        onLayoutChange={this.handleLayoutChange}
                        onResizeStart={this.handleResizeItemStart}
                        onResizeStop={this.handleResizeItemStop}
                        onDragStart={this.handleDragItemStart}
                        onDragStop={this.handleDragItemStop}
                        {...this.props}
                    >
                        {gridContent.map((child, key) => {
                            let _key;
                            let _data_grid;
                            if (child.props) {
                                const child_props = child.props._dashprivate_layout
                                    ? child.props._dashprivate_layout.props
                                    : child.props;

                                const isDashboardItem =
                                    (child.props._dashprivate_layout
                                        ? child.props._dashprivate_layout.type
                                        : child.type.name) ===
                                    'DashboardItemResponsive';

                                _key = child_props.id || key.toString();

                                if (isDashboardItem) {
                                    const {
                                        x = {},
                                        y = {},
                                        w = {},
                                        h = {},
                                    } = child_props;

                                    _data_grid = { x: x, y: y, w: w, h: h };
                                }

                                if (typeof _key === 'object') {
                                    _key = JSON.stringify(_key);
                                }
                            } else {
                                _key = key.toString();
                            }

                            return (
                                <GridItem
                                    key={_key}
                                    className={"item"}
                                    data-grid={_data_grid}
                                    canClose={true}
                                    onCloseClicked={() => this.handleCloseItemClicked(_key)}
                                    active={this.state.activeWindows[_key] || false}
                                >{child}</GridItem>
                            );
                        })}
                    </ResponsiveReactGridLayout>
                </React.Fragment>
            );
        } catch (e) {
            console.log('Ex 5', e)
        }
    }
}

ToolBoxGrid.defaultProps = {
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

ToolBoxGrid.propTypes = {
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

export default ToolBoxGrid;