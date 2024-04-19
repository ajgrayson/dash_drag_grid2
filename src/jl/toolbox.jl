# AUTO GENERATED FILE - DO NOT EDIT

export toolbox

"""
    toolbox(;kwargs...)

A ToolBox component.

Keyword arguments:
- `breakpoints` (Dict; optional)
- `items` (Array; required)
- `layouts` (Dict; optional)
- `title` (String; optional)
"""
function toolbox(; kwargs...)
        available_props = Symbol[:breakpoints, :items, :layouts, :title]
        wild_props = Symbol[]
        return Component("toolbox", "ToolBox", "dash_drag_grid", available_props, wild_props; kwargs...)
end

