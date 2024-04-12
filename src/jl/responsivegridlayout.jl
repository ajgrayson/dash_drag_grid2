# AUTO GENERATED FILE - DO NOT EDIT

export responsivegridlayout

"""
    responsivegridlayout(;kwargs...)
    responsivegridlayout(children::Any;kwargs...)
    responsivegridlayout(children_maker::Function;kwargs...)


A ResponsiveGridLayout component.
ResponsiveGridLayout is a component for building
dashboards with draggable and resizable items.
It takes a list of children and display them in
div elements that can be moved around the page.
The initial size of each element can either be
defined with the layout argument or by wrapping
each element with the ResponsiveGridLayout component.
By default, DraggableDashboard will saved the
position of the elements on client side, when
moved on the page. But you can also save it
on server side by defining a callback with :
`Input("<my-id>", "layout")`.
Keyword arguments:
- `children` (Array of a list of or a singular dash component, string or numbers | a list of or a singular dash component, string or number; optional): Children is a list of the items (dash Components and/or
DashboardItem) to diplay on the layout.
By default all the items can be dragged and resized.
- `id` (String; optional): (string) The ID used to identify this component in Dash callbacks.
The id is also used to automatically save the layout on client side.
- `autoSize` (Bool; optional): (bool) Other props defined by react-grid-layout
If true, the container height swells and contracts to fit contents
- `breakpoints` (Dict; optional): ({breakpoint: number}) The breakpoints for the responsive layout.
For each screen size (breakpoint) we can define a different layout.
(see also 'layouts' and 'gridCols' arguments)
Default value is {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}
- `className` (String; optional): (string) class passed to the react-grid-layout component
- `clearSavedLayout` (Bool; optional): (bool) If set to true, the position of elements saved on client side
will be cleared on the next page load.
- `compactType` (a value equal to: 'vertical', 'horizontal'; optional): Compaction type.
- `containerPadding` (Array of Reals | Dict; optional): Padding inside the container [x, y] in px
- `draggableCancel` (String; optional): (string) A CSS selector for tags that will not be draggable.
or example: draggableCancel:'.MyNonDraggableAreaClassName'
If you forget the leading . it will not work.
- `draggableHandle` (String; optional): A CSS selector for tags that will act as the draggable handle.
For example: draggableHandle:'.MyDragHandleClassName'
If you forget the leading . it will not work.
- `gridCols` (Dict; optional): ({breakpoint: number}) the number of columns in the grid layout.
Default value is {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}.
- `height` (Real; optional): (number) height of a row (in px).
Default value is 30.
- `isBounded` (Bool; optional): Are items resizable
- `isDraggable` (Bool; optional): Are items draggable
- `isDroppable` (Bool; optional): If true, droppable elements (with `draggable={true}` attribute)
can be dropped on the grid. It triggers "onDrop" callback
with position and event object as parameters.
It can be useful for dropping an element in a specific position

NOTE: In case of using Firefox you should add
`onDragStart={e => e.dataTransfer.setData('text/plain', '')}` attribute
along with `draggable={true}` otherwise this feature will work incorrect.
onDragStart attribute is required for Firefox for a dragging initialization

@see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
- `isResizable` (Bool; optional): Are items resizable
- `layouts` (Dict; optional): Layout is a list(python)/vector(R) of dictionnary(Python)/list(R) with the format:
{x: number, y: number, w: number, h: number}
The index into the layout must match the id used on each item component with DashboardItem.
If you choose to use custom keys, you can specify that key in the layout
array objects like so:
{i: string, x: number, y: number, w: number, h: number}
The ID used to identify this component in Dash callbacks.
The id is also used to automatically save the layout on client side.
- `margin` (Array of Reals | Dict; optional): Margin between items [x, y] in px.
- `ncols` (Dict; optional): ({breakpoint: number}) the default number of columns by item.
Default value is {lg: 6, md: 5, sm: 3, xs: 4, xxs: 2}.
- `nrows` (Real; optional): (number) the default number of row by item.
Default value is 8.
- `preventCollision` (Bool; optional): If true, grid items won't change position when being
dragged over.
- `resizeHandles` (Array of a value equal to: 's', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne's; optional): Defines which resize handles should be rendered
Allows for any combination of:
's' - South handle (bottom-center)
'w' - West handle (left-center)
'e' - East handle (right-center)
'n' - North handle (top-center)
'sw' - Southwest handle (bottom-left)
'nw' - Northwest handle (top-left)
'se' - Southeast handle (bottom-right)
'ne' - Northeast handle (top-right)
- `save` (Bool; optional): (bool) If True, then the layout is automatically saved on client browser.
Default value is True
- `style` (Dict; optional): (dict) css style passed to the react-grid-layout component
- `transformScale` (Real; optional): If parent DOM node of ResponsiveReactGridLayout or ReactGridLayout has "transform: scale(n)" css property,
we should set scale coefficient to avoid render artefacts while dragging.
- `useCSSTransforms` (Bool; optional): Uses CSS3 translate() instead of position top/left.
This makes about 6x faster paint performance
- `verticalCompact` (Bool; optional): If true, the layout will compact vertically
"""
function responsivegridlayout(; kwargs...)
        available_props = Symbol[:children, :id, :autoSize, :breakpoints, :className, :clearSavedLayout, :compactType, :containerPadding, :draggableCancel, :draggableHandle, :gridCols, :height, :isBounded, :isDraggable, :isDroppable, :isResizable, :layouts, :margin, :ncols, :nrows, :preventCollision, :resizeHandles, :save, :style, :transformScale, :useCSSTransforms, :verticalCompact]
        wild_props = Symbol[]
        return Component("responsivegridlayout", "ResponsiveGridLayout", "dash_drag_grid", available_props, wild_props; kwargs...)
end

responsivegridlayout(children::Any; kwargs...) = responsivegridlayout(;kwargs..., children = children)
responsivegridlayout(children_maker::Function; kwargs...) = responsivegridlayout(children_maker(); kwargs...)

