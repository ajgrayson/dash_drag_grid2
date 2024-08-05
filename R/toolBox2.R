# AUTO GENERATED FILE - DO NOT EDIT

#' @export
toolBox2 <- function(breakpoints=NULL, component=NULL, items=NULL, layouts=NULL, linkedId=NULL, title=NULL) {
    
    props <- list(breakpoints=breakpoints, component=component, items=items, layouts=layouts, linkedId=linkedId, title=title)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'ToolBox2',
        namespace = 'dash_drag_grid',
        propNames = c('breakpoints', 'component', 'items', 'layouts', 'linkedId', 'title'),
        package = 'dashDragGrid'
        )

    structure(component, class = c('dash_component', 'list'))
}
