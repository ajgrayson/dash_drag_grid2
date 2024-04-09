import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Responsive, WidthProvider as widthProvider} from 'react-grid-layout';

import {
    NROWS,
    ROW_HEIGHT,
    BREAKPOINTS,
    GRID_COLS_RESPONSIVE,
    NCOLS_RESPONSIVE,
} from '../constants';

import {saveToLs, getFromLs} from '../localStorage';
import {
    filterLayoutForToolboxItems,
    categorizeContent,
    appendInToolboxFalse,
} from '../utils';
import {Toolbox} from './Toolbox.react.js';
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
    const defaultChildLayout = {
        i: id.toString() || key.toString(),
        x: col * ncols,
        y: row,
        w: ncols,
        h: nrows,
    };
    return {
        ...defaultChildLayout,
        ...item_layout,
        i: id.toString() || key.toString(),
        x: item_layout.x ? item_layout.x : defaultChildLayout.x,
        y: item_layout.y ? item_layout.y : defaultChildLayout.y,
        w: item_layout.w ? item_layout.w : defaultChildLayout.w,
        h: item_layout.h ? item_layout.h : defaultChildLayout.h,
    };
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
export default class ToolBoxGrid extends Component {

    constructor(props) {

        // Takee all elememts passed from the parent we need
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
        };
    }

    onDrop = (layout, layoutItem, _event) => {
        _event.persist();

        this.setState((prevState) => {
            // Retrieve the data set in the drag start event
            const droppedItemId = _event.dataTransfer.getData('text/plain');
            const currentBreakpoint = prevState.currentBreakpoint;
    
            // Calculate the max available space from x/y
            let newX = layoutItem?.x ?? 0;
            let newY = layoutItem?.y ?? 0;
            var items = prevState.layouts[currentBreakpoint];
            var pos = items.reduce((p, c) => {
                if (c.x > newX && c.x < p.x) p.x = c.x;
                if (c.y > newY && c.y < p.y) p.y = c.y;
                return p;
            }, {x: GRID_COLS_RESPONSIVE[currentBreakpoint], y: 100})

            if (pos.y == 100) pos.y = 0;

            const valOrMax = (t, max) => {
                if (t > max) return max;
                if (t <= 0) return max;
                return t;
            }

            let newW = valOrMax(pos.x - newX, prevState.onDropWidth);
            let newH = valOrMax(pos.y - newY, prevState.onDropHeight);

            const newItem = {
                i: droppedItemId,
                x: newX,
                y: newY,
                w: newW, 
                h: newH, 
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
            return {
                layouts: updatedLayouts,
            };
        });
    };

    /* We need to caputre the changes in break point to find it for the right toolbox. it will enable us to store different 
    configurations for sizes */
    onBreakpointChange = (breakpoint) => {
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

    onLayoutChange = (current_layout, all_layouts) => {
        // First we save the layout to the local storage
        if (this.state.save) {
            all_layouts = appendInToolboxFalse(all_layouts);
            saveToLs(`${this.state.id}-layouts`, all_layouts);
        }
        // Set the state of the layout for render
        // this.setState({all_layouts});
    };

    onPutItem = (item) => {
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
        () => {});
    };

    componentDidMount() {
        let {children = []} = this.props;
        const {
            id,
            layouts: providedLayouts,
            clearSavedLayout,
            ncols = NCOLS_RESPONSIVE,
            nrows = NROWS,
            breakpoints = BREAKPOINTS,
            gridCols = GRID_COLS_RESPONSIVE,
            toolbox = toolbox,
            currentBreakpoint = currentBreakpoint,
            defaultInToolbox = inToolbox,
        } = this.props;
        const layouts = {};
        let child_props, child_id, isDashboardItem;

        children = Array.isArray(children) ? children : [children];

        // Build layout on inital start
        //   Priority to client local store [except if specified]
        //   Then layout
        //   And then DashboardItem [except if sepcified])
        if (clearSavedLayout) {
            saveToLs(`${id}-layouts`, null);
        }
        const savedLayout = getFromLs(`${id}-layouts`);

        for (var bkp in breakpoints) {
            // eslint-disable-next-line no-loop-func
            const layout = children.map((child, key) => {
                let item_layout;

                // Get the child id and props
                // Depending on wether it is a string, a classic React component, or a DashboardItem
                if (typeof child === 'string') {
                    child_id = key.toString();
                } else {
                    child_props = child.props._dashprivate_layout
                        ? child.props._dashprivate_layout.props
                        : child.props;

                    isDashboardItem =
                        (child.props._dashprivate_layout
                            ? child.props._dashprivate_layout.type
                            : child.type.name) === 'DashboardItemResponsive';

                    child_id = child_props.id;

                    if (typeof child_id === 'undefined') {
                        child_id = key.toString();
                    } else if (typeof child_id === 'object') {
                        child_id = JSON.stringify(child_id);
                    }
                }

                // Define the layout for the specific item x breakpoint
                if (savedLayout && savedLayout[bkp]) {
                    // First we check if we find the child in the saved layouts
                    item_layout = savedLayout[bkp].find(
                        (el) => el.i === child_id || el.i === key.toString()
                    );
                }
                if (!item_layout && providedLayouts && providedLayouts[bkp]) {
                    // Now we check if the child is in the provided layouts
                    item_layout = providedLayouts[bkp].find(
                        (el) => el.i === child_id
                    );
                }
                if (!item_layout && isDashboardItem) {
                    // If we still not have the child, then we make it as long as its a DashboardItem
                    // The layout of a stored toolbox item will be missing if we have a saved layout.
                    // Therfore put it into toolbox

                    // The default value for inToolbox is false. This triggers if nothing is provided
                    let defaultToolbox = false;
                    if (savedLayout) {
                        defaultToolbox = true;
                    }
                    const {
                        id = {},
                        x = {},
                        y = {},
                        w = {},
                        h = {},
                        inToolbox = inToolbox,
                    } = child_props;

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
                        child_id,
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
                        child_id,
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

        let {filteredLayoutDict, toolboxDict} =
            filterLayoutForToolboxItems(layouts);

        this.setState((prevState) => ({
            layouts: filteredLayoutDict,
            toolbox: toolboxDict,
            currentBreakpoint: currentBreakpoint,
        }));
    }

    render() {
        let {children = []} = this.props;
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
                <Toolbox
                    toolboxContent={toolboxContent}
                    breakpoint={breakpoints}
                    layouts={this.state.toolbox}
                />

                <ResponsiveReactGridLayout
                    className={className}
                    style={style}
                    layouts={this.state.layouts}
                    cols={gridCols}
                    onBreakpointChange={this.onBreakpointChange}
                    breakpoints={breakpoints}
                    rowHeight={height}
                    onDrop={this.onDrop}
                    onLayoutChange={this.onLayoutChange}
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

                                _data_grid = {x: x, y: y, w: w, h: h};
                            }

                            if (typeof _key === 'object') {
                                _key = JSON.stringify(_key);
                            }
                        } else {
                            _key = key.toString();
                        }
                        return (
                            <div
                                key={_key}
                                className="item"
                                data-grid={_data_grid}
                            >
                                {
                                    <div className="item-top-container">
                                        <span className="item-top">...</span>
                                        <button
                                            className="close-button"
                                            onClick={this.onPutItem.bind(
                                                this,
                                                _key
                                            )}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                }
                                <div
                                    className="item-content"
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    {child}
                                </div>
                            </div>
                        );
                    })}
                </ResponsiveReactGridLayout>
            </React.Fragment>
        );
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
    toolbox: {lg: [], md: [], sm: []},
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

    // margin: PropTypes.oneOfType([
    //     PropTypes.object,
    //     PropTypes.arrayOf(PropTypes.object),
    // ]),
    // containerPadding: PropTypes.oneOfType([
    //     PropTypes.object,
    //     PropTypes.arrayOf(PropTypes.object),
    // ]),

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

    // Other props defined by react-grid-layout
    // If true, the container height swells and contracts to fit contents
    autoSize: PropTypes.bool,

    // A CSS selector for tags that will not be draggable.
    // For example: draggableCancel:'.MyNonDraggableAreaClassName'
    // If you forget the leading . it will not work.
    draggableCancel: PropTypes.string,

    // A CSS selector for tags that will act as the draggable handle.
    // For example: draggableHandle:'.MyDragHandleClassName'
    // If you forget the leading . it will not work.
    draggableHandle: PropTypes.string,

    // If true, the layout will compact vertically
    verticalCompact: PropTypes.bool,

    // Compaction type.
    compactType: PropTypes.oneOf(['vertical', 'horizontal']),

    // Margin between items [x, y] in px.
    margin: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.object,
    ]),

    // Padding inside the container [x, y] in px
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
    // Uses CSS3 translate() instead of position top/left.
    // This makes about 6x faster paint performance
    useCSSTransforms: PropTypes.bool,
    // If parent DOM node of ResponsiveReactGridLayout or ReactGridLayout has "transform: scale(n)" css property,
    // we should set scale coefficient to avoid render artefacts while dragging.
    transformScale: PropTypes.number,

    // If true, grid items won't change position when being
    // dragged over.
    preventCollision: PropTypes.bool,

    // If true, droppable elements (with `draggable={true}` attribute)
    // can be dropped on the grid. It triggers "onDrop" callback
    // with position and event object as parameters.
    // It can be useful for dropping an element in a specific position
    //
    // NOTE: In case of using Firefox you should add
    // `onDragStart={e => e.dataTransfer.setData('text/plain', '')}` attribute
    // along with `draggable={true}` otherwise this feature will work incorrect.
    // onDragStart attribute is required for Firefox for a dragging initialization
    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
    isDroppable: PropTypes.bool,
    // Defines which resize handles should be rendered
    // Allows for any combination of:
    // 's' - South handle (bottom-center)
    // 'w' - West handle (left-center)
    // 'e' - East handle (right-center)
    // 'n' - North handle (top-center)
    // 'sw' - Southwest handle (bottom-left)
    // 'nw' - Northwest handle (top-left)
    // 'se' - Southeast handle (bottom-right)
    // 'ne' - Northeast handle (top-right)
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
