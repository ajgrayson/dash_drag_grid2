# AUTO GENERATED FILE - DO NOT EDIT

#' @export
toolBoxGrid <- function(children=NULL, id=NULL, autoSize=NULL, breakpoints=NULL, className=NULL, clearSavedLayout=NULL, compactType=NULL, containerPadding=NULL, currentBreakpoint=NULL, defaultInToolbox=NULL, draggableCancel=NULL, draggableHandle=NULL, gridCols=NULL, height=NULL, isBounded=NULL, isDraggable=NULL, isDroppable=NULL, isResizable=NULL, layouts=NULL, margin=NULL, ncols=NULL, nrows=NULL, onDropHeight=NULL, onDropWidth=NULL, preventCollision=NULL, resizeHandles=NULL, save=NULL, style=NULL, toolbox=NULL, transformScale=NULL, useCSSTransforms=NULL, verticalCompact=NULL) {
    
    props <- list(children=children, id=id, autoSize=autoSize, breakpoints=breakpoints, className=className, clearSavedLayout=clearSavedLayout, compactType=compactType, containerPadding=containerPadding, currentBreakpoint=currentBreakpoint, defaultInToolbox=defaultInToolbox, draggableCancel=draggableCancel, draggableHandle=draggableHandle, gridCols=gridCols, height=height, isBounded=isBounded, isDraggable=isDraggable, isDroppable=isDroppable, isResizable=isResizable, layouts=layouts, margin=margin, ncols=ncols, nrows=nrows, onDropHeight=onDropHeight, onDropWidth=onDropWidth, preventCollision=preventCollision, resizeHandles=resizeHandles, save=save, style=style, toolbox=toolbox, transformScale=transformScale, useCSSTransforms=useCSSTransforms, verticalCompact=verticalCompact)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'ToolBoxGrid',
        namespace = 'dash_drag_grid',
        propNames = c('children', 'id', 'autoSize', 'breakpoints', 'className', 'clearSavedLayout', 'compactType', 'containerPadding', 'currentBreakpoint', 'defaultInToolbox', 'draggableCancel', 'draggableHandle', 'gridCols', 'height', 'isBounded', 'isDraggable', 'isDroppable', 'isResizable', 'layouts', 'margin', 'ncols', 'nrows', 'onDropHeight', 'onDropWidth', 'preventCollision', 'resizeHandles', 'save', 'style', 'toolbox', 'transformScale', 'useCSSTransforms', 'verticalCompact'),
        package = 'dashDragGrid'
        )

    structure(component, class = c('dash_component', 'list'))
}
