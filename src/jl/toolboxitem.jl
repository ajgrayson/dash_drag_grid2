# AUTO GENERATED FILE - DO NOT EDIT

export toolboxitem

"""
    toolboxitem(;kwargs...)
    toolboxitem(children::Any;kwargs...)
    toolboxitem(children_maker::Function;kwargs...)


A ToolboxItem component.
ToolboxItem is a wrapper that is intended to be used with ToolBoxGrid.
ToolboxItem specify the position and size of the item on the dashboard and if it is in the toolbox.
Keyword arguments:
- `children` (Array of a list of or a singular dash component, string or numbers | a list of or a singular dash component, string or number; optional): The child or list of children wrapped by the component.
- `id` (String | Dict; required): The ID used to identify this component in Dash callbacks.
- `defaultName` (String; optional): The name which will be displayed if the Item is in the toolbox. If non provided, then default is the ID
- `h` (Real | Dict; optional): The height on the of y axis (default is 4)
- `w` (Real | Dict; optional): The width of the x axis (default is 6).
- `x` (Real | Dict; optional): The position on the x axis in number of columns (by default, the  max is 12).
- `y` (Real | Dict; optional): The position on the y axis (the unit is 30px, by default)
"""
function toolboxitem(; kwargs...)
        available_props = Symbol[:children, :id, :defaultName, :h, :w, :x, :y]
        wild_props = Symbol[]
        return Component("toolboxitem", "ToolboxItem", "dash_drag_grid", available_props, wild_props; kwargs...)
end

toolboxitem(children::Any; kwargs...) = toolboxitem(;kwargs..., children = children)
toolboxitem(children_maker::Function; kwargs...) = toolboxitem(children_maker(); kwargs...)

