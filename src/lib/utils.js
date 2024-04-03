export const filterLayoutForToolboxItems = (layoutDict) => {
    const toolboxDict = {};
    const filteredLayoutDict = {};

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

        filteredLayoutDict[breakpoint] = filteredItems;
        toolboxDict[breakpoint] = toolboxItems;
    }

    return {filteredLayoutDict, toolboxDict};
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
