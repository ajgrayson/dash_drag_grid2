# AUTO GENERATED FILE - DO NOT EDIT

#' @export
toolboxItem <- function(children=NULL, id=NULL, defaultName=NULL, h=NULL, inToolbox=NULL, w=NULL, x=NULL, y=NULL) {
    
    props <- list(children=children, id=id, defaultName=defaultName, h=h, inToolbox=inToolbox, w=w, x=x, y=y)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'ToolboxItem',
        namespace = 'dash_drag_grid',
        propNames = c('children', 'id', 'defaultName', 'h', 'inToolbox', 'w', 'x', 'y'),
        package = 'dashDragGrid'
        )

    structure(component, class = c('dash_component', 'list'))
}
