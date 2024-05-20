# AUTO GENERATED FILE - DO NOT EDIT

export toolbox2

"""
    toolbox2(;kwargs...)

A ToolBox2 component.

Keyword arguments:
- `breakpoints` (Dict; optional)
- `items` (Array; required)
- `layouts` (Dict; optional)
- `linkedId` (String; optional)
- `title` (String; optional)
"""
function toolbox2(; kwargs...)
        available_props = Symbol[:breakpoints, :items, :layouts, :linkedId, :title]
        wild_props = Symbol[]
        return Component("toolbox2", "ToolBox2", "dash_drag_grid", available_props, wild_props; kwargs...)
end

