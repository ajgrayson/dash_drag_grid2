# AUTO GENERATED FILE - DO NOT EDIT

export dashboarditemresponsive

"""
    dashboarditemresponsive(;kwargs...)
    dashboarditemresponsive(children::Any;kwargs...)
    dashboarditemresponsive(children_maker::Function;kwargs...)


A DashboardItemResponsive component.
DashboardItemResponsive is a wrapper that is intended to be used with ResponsiveGridlayout and ToolBoxGrid.
DashboardItemResponsive specify the position and size of the item on the dashboard and if it is in the toolbox.
Keyword arguments:
- `children` (Array of a list of or a singular dash component, string or numbers | a list of or a singular dash component, string or number; optional): The child or list of children wrapped by the component.
- `id` (String | Dict; optional): The ID used to identify this component in Dash callbacks.
- `defaultName` (String; optional): The name which will be displayed if the Item is in the toolbox. If non provided, then default is the ID
- `h` (Real | Dict; optional): The height on the of y axis (default is 4)
- `inToolbox` (Bool; optional): Is the Item in the toolbox. Default is false and set by the grid. Overwrites the grid default value
- `isBounded` (Bool; optional): Is is bounded
- `isDashboardItem` (Bool; optional): This is an internal prop used to identify the component, this property default value is True.
Setting this value to false is equivalent to not using the DashboardItem wrapper.
- `isDraggable` (Bool; optional): If false, will not be draggable. Overrides `static`.
- `isRemoveable` (Bool; optional): If false, will not be removeable.
- `isResizable` (Bool; optional): If false, will not be resizable. Overrides `static`.
- `maxH` (Real; optional): Set the max height
- `maxW` (Real; optional): Set the max width
- `minH` (Real; optional): Set the min height
- `minW` (Real; optional): Set the min width
- `moved` (Bool; optional): Shows if it was moved
- `resizeHandles` (String; optional): Set the resizeHandles
- `static` (Bool; optional): If true, equal to `isDraggable: false, isResizable: false`.
- `toolboxContent` (Array of a list of or a singular dash component, string or numbers | a list of or a singular dash component, string or number; optional)
- `w` (Real | Dict; optional): The width of the x axis (default is 6).
- `x` (Real | Dict; optional): The position on the x axis in number of columns (by default, the  max is 12).
- `y` (Real | Dict; optional): The position on the y axis (the unit is 30px, by default)
"""
function dashboarditemresponsive(; kwargs...)
        available_props = Symbol[:children, :id, :defaultName, :h, :inToolbox, :isBounded, :isDashboardItem, :isDraggable, :isRemoveable, :isResizable, :maxH, :maxW, :minH, :minW, :moved, :resizeHandles, :static, :toolboxContent, :w, :x, :y]
        wild_props = Symbol[]
        return Component("dashboarditemresponsive", "DashboardItemResponsive", "dash_drag_grid", available_props, wild_props; kwargs...)
end

dashboarditemresponsive(children::Any; kwargs...) = dashboarditemresponsive(;kwargs..., children = children)
dashboarditemresponsive(children_maker::Function; kwargs...) = dashboarditemresponsive(children_maker(); kwargs...)

