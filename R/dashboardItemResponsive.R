# AUTO GENERATED FILE - DO NOT EDIT

#' @export
dashboardItemResponsive <- function(children=NULL, id=NULL, defaultName=NULL, h=NULL, iconComponent=NULL, inToolbox=NULL, isBounded=NULL, isDashboardItem=NULL, isDraggable=NULL, isResizable=NULL, maxH=NULL, maxW=NULL, minH=NULL, minW=NULL, moved=NULL, resizeHandles=NULL, static=NULL, w=NULL, x=NULL, y=NULL) {
    
    props <- list(children=children, id=id, defaultName=defaultName, h=h, iconComponent=iconComponent, inToolbox=inToolbox, isBounded=isBounded, isDashboardItem=isDashboardItem, isDraggable=isDraggable, isResizable=isResizable, maxH=maxH, maxW=maxW, minH=minH, minW=minW, moved=moved, resizeHandles=resizeHandles, static=static, w=w, x=x, y=y)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DashboardItemResponsive',
        namespace = 'dash_drag_grid',
        propNames = c('children', 'id', 'defaultName', 'h', 'iconComponent', 'inToolbox', 'isBounded', 'isDashboardItem', 'isDraggable', 'isResizable', 'maxH', 'maxW', 'minH', 'minW', 'moved', 'resizeHandles', 'static', 'w', 'x', 'y'),
        package = 'dashDragGrid'
        )

    structure(component, class = c('dash_component', 'list'))
}
