# AUTO GENERATED FILE - DO NOT EDIT

#' @export
toolbox <- function(breakpoints=NULL, layouts=NULL, toolboxComponent=NULL, toolboxItems=NULL, toolboxTitle=NULL) {
    
    props <- list(breakpoints=breakpoints, layouts=layouts, toolboxComponent=toolboxComponent, toolboxItems=toolboxItems, toolboxTitle=toolboxTitle)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'Toolbox',
        namespace = 'dash_drag_grid',
        propNames = c('breakpoints', 'layouts', 'toolboxComponent', 'toolboxItems', 'toolboxTitle'),
        package = 'dashDragGrid'
        )

    structure(component, class = c('dash_component', 'list'))
}
