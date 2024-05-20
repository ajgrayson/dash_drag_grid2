% Auto-generated: do not edit by hand
\name{toolBoxGrid}

\alias{toolBoxGrid}

\title{ToolBoxGrid component}

\description{
DraggableDashboard is a component for building dashboards with draggable and resizable items. It takes a list of children and display them in div elements that can be moved around the page. The initial size of each element can either be defined with the layout argument or by wrapping each element with the DashboardItem component. By default, DraggableDashboard will saved the position of the elements on client side, when moved on the page. But you can also save it on server side by defining a callback with : `Input("<my-id>", "layout")`.
}

\usage{
toolBoxGrid(children=NULL, id=NULL, autoSize=NULL, breakpoints=NULL,
className=NULL, clearSavedLayout=NULL, compactType=NULL,
containerPadding=NULL, currentBreakpoint=NULL,
defaultInToolbox=NULL, draggableCancel=NULL,
draggableHandle=NULL, gridCols=NULL, height=NULL,
isBounded=NULL, isDraggable=NULL, isDroppable=NULL,
isResizable=NULL, layouts=NULL, margin=NULL, ncols=NULL,
nrows=NULL, onDropHeight=NULL, onDropWidth=NULL,
preventCollision=NULL, resizeHandles=NULL, save=NULL,
style=NULL, toolbox=NULL, transformScale=NULL,
useCSSTransforms=NULL, verticalCompact=NULL)
}

\arguments{
\item{children}{List of a list of or a singular dash component, string or numbers | a list of or a singular dash component, string or number. Children is a list of the items (dash Components and/or
DashboardItem) to diplay on the layout.
By default all the items can be dragged and resized.}

\item{id}{Character. (string) The ID used to identify this component in Dash callbacks.
The id is also used to automatically save the layout on client side.}

\item{autoSize}{Logical. }

\item{breakpoints}{Named list. ({breakpoint: number}) The breakpoints for the responsive layout.
For each screen size (breakpoint) we can define a different layout.
(see also 'layouts' and 'gridCols' arguments)
Default value is {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}

\item{className}{Character. (string) class passed to the react-grid-layout component}

\item{clearSavedLayout}{Logical. (bool) If set to true, the position of elements saved on client side
will be cleared on the next page load.}

\item{compactType}{A value equal to: 'vertical', 'horizontal'. }

\item{containerPadding}{List of numerics | named list. }

\item{currentBreakpoint}{Character. current breakpoint}

\item{defaultInToolbox}{Logical. This value sets if children, which do not have inToolbox defined, should be in the Toolbox by default}

\item{draggableCancel}{Character. }

\item{draggableHandle}{Character. }

\item{gridCols}{Named list. ({breakpoint: number}) the number of columns in the grid layout.
Default value is {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}.}

\item{height}{Numeric. (number) height of a row (in px).
Default value is 30.}

\item{isBounded}{Logical. Are items resizable}

\item{isDraggable}{Logical. Are items draggable}

\item{isDroppable}{Logical. }

\item{isResizable}{Logical. Are items resizable}

\item{layouts}{Named list. Layout is a list(python)/vector(R) of dictionnary(Python)/list(R) with the format:
{x: number, y: number, w: number, h: number}
The index into the layout must match the id used on each item component with DashboardItem.
If you choose to use custom keys, you can specify that key in the layout
array objects like so:
{i: string, x: number, y: number, w: number, h: number}
The ID used to identify this component in Dash callbacks.
The id is also used to automatically save the layout on client side.}

\item{margin}{List of numerics | named list. }

\item{ncols}{Named list. ({breakpoint: number}) the default number of columns by item.
Default value is {lg: 6, md: 5, sm: 3, xs: 4, xxs: 2}.}

\item{nrows}{Numeric. (number) the default number of row by item.
Default value is 8.}

\item{onDropHeight}{Numeric. Set the default height of items that are dropped from the toolbox into the grid. default is 5}

\item{onDropWidth}{Numeric. Set the default height of items that are dropped from the toolbox into the grid. default is 4}

\item{preventCollision}{Logical. }

\item{resizeHandles}{List of a value equal to: 's', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne's. }

\item{save}{Logical. (bool) If True, then the layout is automatically saved on client browser.
Default value is True}

\item{style}{Named list. (dict) css style passed to the react-grid-layout component}

\item{toolbox}{Named list. The toolbox layout}

\item{transformScale}{Numeric. }

\item{useCSSTransforms}{Logical. }

\item{verticalCompact}{Logical. }
}

\value{named list of JSON elements corresponding to React.js properties and their values}

