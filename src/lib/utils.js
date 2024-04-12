/**
 * Called off the back of the first launch, this is used to initialise
 * the two arrays of what is in the toolbox vs layout based on the  
 * inToolbox flag
 * @param {Object} the current layout grid
 */
export const filterLayoutForToolboxItems = (layoutDict) => {
    const toolbox = {};
    const filteredLayout = {};

    Object.entries(layoutDict).forEach(([breakpoint, items]) => {
        const toolboxItems = items.filter(item => item.inToolbox);
        const filteredItems = items.filter(item => !item.inToolbox);

        filteredLayout[breakpoint] = filteredItems;
        toolbox[breakpoint] = toolboxItems;
    });

    return { filteredLayout, toolbox };
};

/**
 * Called in the render cycle, this allocates the grid elements to either the toolbox
 * or the layout grid as indicated by the current breakpoint layout map.
 * @param {Array} children 
 * @param {Object} layoutDict 
 * @param {String} currentBreakpoint 
 * @returns {Object} an array of elements to render for the layout and for the toolbox
 */
export const categorizeContent = (children, layoutDict, currentBreakpoint) => {
    const toolboxContent = [];
    const layoutContent = children.reduce((acc, child) => {
        const childId = child.props._dashprivate_layout.props.id;
        const isInLayout = layoutDict[currentBreakpoint]?.some(item => item.i === childId);

        isInLayout ? acc.layout.push(child) : toolboxContent.push(child);
        return acc;
    }, { layout: [] });

    return { layoutContent: layoutContent.layout, toolboxContent };
};

/**
 * Reset the inToolbox flag to effectively remove everything from the toolbox
 * @param {Object} allLayouts 
 * @returns {Object} all items have been marked as removed from the toolbox
 */
export function appendInToolboxFalse(allLayouts) {
    Object.values(allLayouts).forEach(layout => {
        layout.forEach(item => {
            item.inToolbox = false;
        });
    });
    return allLayouts;
}
