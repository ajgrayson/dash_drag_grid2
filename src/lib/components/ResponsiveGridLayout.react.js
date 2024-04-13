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

import GridItem from './GridItem.react';

import {saveToLocalStorage, getFromLocalStorage} from '../localStorage';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './style.css';

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
 * ResponsiveGridLayout is a component for building
 * dashboards with draggable and resizable items.
 * It takes a list of children and display them in
 * div elements that can be moved around the page.
 * The initial size of each element can either be
 * defined with the layout argument or by wrapping
 * each element with the ResponsiveGridLayout component.
 * By default, DraggableDashboard will saved the
 * position of the elements on client side, when
 * moved on the page. But you can also save it
 * on server side by defining a callback with :
 * `Input("<my-id>", "layout")`.
 */
export default class ResponsiveGridLayout extends Component {

    constructor(props) {

        // Take all elememts passed from the parent we need
        super(props);

        this.state = {
            currentBreakpoint: this.props.currentBreakpoint,
            layouts: {},
            save: this.props.save,
            id: this.props.id,
            setProps: this.props.setProps,
            activeWindows: {}
        };
    }

    handleLayoutChange = (current_layout, all_layouts) => {
        // First we save the layout to the local storage
        if (this.state.save) {
            saveToLocalStorage(`${this.props.id}-layouts`, all_layouts);
        }
        // Set the state of the layout for render
        this.setState({all_layouts});
    };

    /**
     * We need to capture the changes in break point to find it for the right toolbox. 
     * It will enable us to store different configurations for sizes
     */
    handleBreakpointChange = (breakpoint) => {
        this.setState({
            currentBreakpoint: breakpoint
        });
    };

    calculateInitialLayout() {
        let {children = []} = this.props;
        const {
            id,
            layouts: providedLayouts,
            clearSavedLayout,
            ncols = NCOLS_RESPONSIVE,
            nrows = NROWS,
            breakpoints = BREAKPOINTS,
            gridCols = GRID_COLS_RESPONSIVE,
            currentBreakpoint = currentBreakpoint
        } = this.props;
        
        const layouts = {};
        let child_props, child_id, isDashboardItem;

        children = Array.isArray(children) ? children : [children];

        if (clearSavedLayout) {
            saveToLocalStorage(`${id}-layouts`, null);
        }

        // Build layout on inital start
        //   Priority to client local store [except if specified]
        //   Then layout
        //   And then DashboardItem [except if specified])
        const savedLayout = getFromLocalStorage(`${id}-layouts`);
 
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

                    const {
                        id = {},
                        x = {},
                        y = {},
                        w = {},
                        h = {}
                    } = child_props;

                    const item_provided_layout = {
                        i: typeof id === 'string' ? id : id[bkp],
                        x: typeof x === 'number' ? x : x[bkp],
                        y: typeof y === 'number' ? y : y[bkp],
                        w: typeof w === 'number' ? w : w[bkp],
                        h: typeof h === 'number' ? h : h[bkp]
                    };

                    item_layout = defaultItemLayout(
                        item_provided_layout,
                        child_id,
                        key,
                        ncols[bkp],
                        nrows,
                        nrows,
                        gridCols[bkp]
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
                        gridCols[bkp]
                    );
                }
                return item_layout;
            });

            layouts[bkp] = layout;
        }

        return {layouts, currentBreakpoint};
    }

    componentDidMount() {
        let {layouts, currentBreakpoint} = this.calculateInitialLayout();

        this.setState((prevState) => ({
            layouts: layouts,
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

        return (
            <React.Fragment>
                <ResponsiveReactGridLayout
                    className={className}
                    style={style}
                    layouts={this.state.layouts}
                    cols={gridCols}
                    breakpoints={breakpoints}
                    rowHeight={height}
                    onBreakpointChange={this.handleBreakpointChange}
                    onLayoutChange={this.handleLayoutChange}
                    {...this.props}
                >
                    {children.map((child, key) => {
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
                            <GridItem
                                key={_key}
                                className={"item"}
                                data-grid={_data_grid}
                                canClose={false}
                                active={this.state.activeWindows[_key] || false}
                            >{child}</GridItem>
                        );
                    })}
                </ResponsiveReactGridLayout>
            </React.Fragment>
        );
    }
}

ResponsiveGridLayout.defaultProps = {
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
    isDroppable: false,
    resizeHandles: ['se'],
};

ResponsiveGridLayout.propTypes = {
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
};