# AUTO GENERATED FILE - DO NOT EDIT

export toolboxgrid2

"""
    toolboxgrid2(;kwargs...)
    toolboxgrid2(children::Any;kwargs...)
    toolboxgrid2(children_maker::Function;kwargs...)


A ToolBoxGrid2 component.

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
- `currentBreakpoint` (String; optional): current breakpoint
- `defaultInToolbox` (Bool; optional): This value sets if children, which do not have inToolbox defined, should be in the Toolbox by default
- `draggableCancel` (String; optional): (string) A CSS selector for tags that will not be draggable.
or example: draggableCancel:'.MyNonDraggableAreaClassName'
If you forget the leading . it will not work.
- `draggableHandle` (String; optional): A CSS selector for tags that will act as the draggable handle.
For example: draggableHandle:'.MyDragHandleClassName'
If you forget the leading . it will not work.
- `enableToolbox` (Bool; optional): When set to false no toolbox will be rendered
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
- `onDropHeight` (Real; optional): Set the default height of items that are dropped from the toolbox into the grid. default is 5
- `onDropWidth` (Real; optional): Set the default height of items that are dropped from the toolbox into the grid. default is 4
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
- `toolbox` (Dict; optional): The toolbox layout
- `toolboxTitle` (String; optional): (string) The title above the toolbox.
- `transformScale` (Real; optional): If parent DOM node of ResponsiveReactGridLayout or ReactGridLayout has "transform: scale(n)" css property,
we should set scale coefficient to avoid render artefacts while dragging.
- `useCSSTransforms` (Bool; optional): Uses CSS3 translate() instead of position top/left.
This makes about 6x faster paint performance
- `verticalCompact` (Bool; optional): If true, the layout will compact vertically
"""
function toolboxgrid2(; kwargs...)
        available_props = Symbol[:children, :id, :autoSize, :breakpoints, :className, :clearSavedLayout, :compactType, :containerPadding, :currentBreakpoint, :defaultInToolbox, :draggableCancel, :draggableHandle, :enableToolbox, :gridCols, :height, :isBounded, :isDraggable, :isDroppable, :isResizable, :layouts, :margin, :ncols, :nrows, :onDropHeight, :onDropWidth, :preventCollision, :resizeHandles, :save, :style, :toolbox, :toolboxTitle, :transformScale, :useCSSTransforms, :verticalCompact]
        wild_props = Symbol[]
        return Component("toolboxgrid2", "ToolBoxGrid2", "dash_drag_grid", available_props, wild_props; kwargs...)
end

toolboxgrid2(children::Any; kwargs...) = toolboxgrid2(;kwargs..., children = children)
toolboxgrid2(children_maker::Function; kwargs...) = toolboxgrid2(children_maker(); kwargs...)

