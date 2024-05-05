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

    return {filteredLayout, toolboxLayout};
};

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
    return {layoutContent, toolboxContent};
};

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

export function defaultItemLayout(item_layout, id, key, ncols, nrows, max_cols, defaultInToolbox){
    console.log('defaultItemLayout', item_layout, id, key, ncols, nrows, max_cols, defaultInToolbox);

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
    console.log('calculated default', result);
    return result;
};

export function childWrapper (child, key) {

    let res = {
        node: child,
        key: key,
        layout: {}
    };

    // string
    if (typeof child === 'string') {
        res.id = key.toString();
        res.type = 'string';
        res.props = {};

        // dash item
    } else if (child.props._dashprivate_layout) {
        res.props = child.props._dashprivate_layout.props;
        res.type = child.props._dashprivate_layout.type;
        res.id = res.props.id;

        let { x, y, w, h } = res.props;

        res.layout = {
            i: res.id,
            x: x,
            y: y,
            h: h,
            w: w
        };

        // classic react
    } else {
        res.props = child.props;
        res.type = child.type.name;
        res.id = res.props.id;
    }

    if (typeof res.id === 'undefined') {
        res.id = key.toString();
    } else if (typeof res.id === 'object') {
        res.id = JSON.stringify(res.id);
    }

    res.isDashboardItem = res.type == "DashboardItemResponsive";

    return res;
}

export function normaliseChildren (children) {
    children = Array.isArray(children) ? children : [children];
    return children.map(childWrapper);
}

export function distributeItems (items, layouts, breakpoint) {
    const toolboxItems = [];
    const gridItems = [];
    items.forEach((item) => {
        const isInLayout = layouts[breakpoint]?.some(itm => itm.i === item.id);
        if (isInLayout) {
            gridItems.push(item);
        } else {
            toolboxItems.push(item);
        }
    });
    return { gridItems, toolboxItems };
}