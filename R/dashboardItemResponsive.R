# AUTO GENERATED FILE - DO NOT EDIT

#' @export
dashboardItemResponsive <- function(children=NULL, id=NULL, defaultName=NULL, h=NULL, inToolbox=NULL, isBounded=NULL, isDashboardItem=NULL, isDraggable=NULL, isRemoveable=NULL, isResizable=NULL, maxH=NULL, maxW=NULL, minH=NULL, minW=NULL, moved=NULL, resizeHandles=NULL, static=NULL, toolboxContent=NULL, w=NULL, x=NULL, y=NULL) {
    
    props <- list(children=children, id=id, defaultName=defaultName, h=h, inToolbox=inToolbox, isBounded=isBounded, isDashboardItem=isDashboardItem, isDraggable=isDraggable, isRemoveable=isRemoveable, isResizable=isResizable, maxH=maxH, maxW=maxW, minH=minH, minW=minW, moved=moved, resizeHandles=resizeHandles, static=static, toolboxContent=toolboxContent, w=w, x=x, y=y)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DashboardItemResponsive',
        namespace = 'dash_drag_grid',
        propNames = c('children', 'id', 'defaultName', 'h', 'inToolbox', 'isBounded', 'isDashboardItem', 'isDraggable', 'isRemoveable', 'isResizable', 'maxH', 'maxW', 'minH', 'minW', 'moved', 'resizeHandles', 'static', 'toolboxContent', 'w', 'x', 'y'),
        package = 'dashDragGrid'
        )

    structure(component, class = c('dash_component', 'list'))
}
