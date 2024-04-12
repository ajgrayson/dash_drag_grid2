# AUTO GENERATED FILE - DO NOT EDIT

export toolbox

"""
    toolbox(;kwargs...)

A ToolBox component.

Keyword arguments:
- `breakpoints` (Dict; optional)
- `layouts` (Dict; optional)
- `toolboxItems` (Array; required)
- `toolboxTitle` (String; optional)
"""
function toolbox(; kwargs...)
        available_props = Symbol[:breakpoints, :layouts, :toolboxItems, :toolboxTitle]
        wild_props = Symbol[]
        return Component("toolbox", "ToolBox", "dash_drag_grid", available_props, wild_props; kwargs...)
end

