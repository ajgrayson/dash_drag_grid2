export const filterLayoutForToolboxItems = (layoutDict) => {
    const toolboxLayout = {};
    const filteredLayout = {};

    for (const breakpoint in layoutDict) {
        const items = layoutDict[breakpoint];
        const toolboxItems = [];
        const filteredItems = items.filter((item) => {
            if (item.inToolbox) {
                toolboxItems.push(item);
                return false; // Exclude toolbox items from filtered layout
            }
            return true;
        });

        filteredLayout[breakpoint] = filteredItems;
        toolboxLayout[breakpoint] = toolboxItems;
    }

    return { filteredLayout, toolboxLayout };
}

export const categorizeContent = (children, layoutDict, currentBreakpoint) => {
    const toolboxContent = [];
    const layoutContent = [];
    children.forEach((child) => {
        const childId = child.props._dashprivate_layout.props.id;
        if (
            layoutDict &&
            layoutDict[currentBreakpoint] &&
            layoutDict[currentBreakpoint].find((item) => item.i === childId)
        ) {
            layoutContent.push(child);
        } else {
            toolboxContent.push(child);
        }
    });
    return { layoutContent, toolboxContent };
}

export function appendInToolboxFalse(allLayouts) {
    // Iterate over each breakpoint in all_layouts
    for (const breakpoint in allLayouts) {
        // Get the layout for the current breakpoint
        const layout = allLayouts[breakpoint];

        // Iterate over each item in the layout
        for (const itemId in layout) {
            // Append inToolbox: false to each item
            layout[itemId].inToolbox = false;
        }
    }
    return allLayouts;
}

export function defaultItemLayout(item_layout, id, key, ncols, nrows, max_cols, defaultInToolbox) {

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
        inToolbox: defaultInToolbox
    };

    // Merge with incoming item_layout, prioritizing values from item_layout
    let result = Object.assign({}, defaultChildLayout, item_layout);
    return result;
}

export function normalizeToolboxItems(children) {
    children = Array.isArray(children) ? children : [children];
    return children.map(toolboxItemWrapper);
}

export function toolboxItemWrapper(child, key) {

    if (child.toolbox) return child;

    let res = {
        id: child.props?.id,
        key: key,
        element: child.props?.children || child,
        type: child.type || 'unknown',
        props: child.props?._dashprivate_layout?.props || {},
        toolbox: true
    };

    // string
    if (typeof child === 'string') {

        res.id = child.toString();
        res.type = 'string';

    } else if (child.type == "ToolboxItem") {

        res.element = child.props.children || child.props.id;
        res.props = child.props;

        // dash item
    } else if (child.props?._dashprivate_layout) {
        res.id = child.props._dashprivate_layout.props.id;
        res.type = child.props._dashprivate_layout.type;
        res.element = child.props._dashprivate_layout.props.toolboxContent || child?.displayName || res.id

        // classic react
    } else {
        res.type = child.type.name;
    }

    if (typeof res.id === 'undefined') {
        res.id = key.toString();
    } else if (typeof res.id === 'object') {
        res.id = JSON.stringify(res.id);
    }

    return res;
}

export function childWrapper(child, key) {

    let res = {
        id: child.props?.id,
        key: key,
        element: child,
        type: 'unknown',
        props: child.props?._dashprivate_layout?.props || child.props || {},
        wrapped: true
    };

    // string
    if (typeof child === 'string') {
        res.id = child.toString();
        res.type = 'string';

        // dash item
    } else if (child.props?._dashprivate_layout) {
        res.id = child.props?._dashprivate_layout?.props.id;
        res.type = child.props._dashprivate_layout.type;

        // classic react
    } else {
        res.type = child.type.name;
    }

    if (typeof res.id === 'undefined') {
        res.id = key.toString();
    } else if (typeof res.id === 'object') {
        res.id = JSON.stringify(res.id);
    }

    res.isDashboardItem = res.type == "DashboardItemResponsive";

    return res;
}

/**
 * Given the three different types of children supported, this function
 * normalizes them and creates a standard structure.
 * @param {*} children 
 * @returns []
 */
export function normaliseChildren(children) {
    children = Array.isArray(children) ? children : [children];
    return children.map(childWrapper);
}

export function distributeItems(items, layouts, breakpoint) {
    const toolboxItems = [];
    const gridItems = [];
    items.forEach((item) => {
        const isInLayout = layouts[breakpoint]?.some(itm => {
            return itm.i === item.id;
        });
        if (isInLayout) {
            gridItems.push(item);
        } else {
            toolboxItems.push(item);
        }
    });
    return { gridItems, toolboxItems };
}

export function generateToolboxItems(gridItems) {
    try {
        var results = gridItems.map(child => {
            let dashLayoutProps = child.node?.props?._dashprivate_layout?.props;
            if (dashLayoutProps?.toolboxContent) {
                return dashLayoutProps.toolboxContent;
            }
            if (dashLayoutProps) {
                const content = typeof dashLayoutProps?.defaultName === 'string'
                    ? dashLayoutProps.defaultName
                    : dashLayoutProps.id;
                return content;
            }
            if (child.node?.props?.toolboxContent) {
                return child.node.props.toolboxContent;
            }

            return child.props.id;
        });

        return results;
    } catch (e) {
    }
}