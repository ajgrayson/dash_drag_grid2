
module DashDragGrid
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.9.4"

include("jl/dashboarditemresponsive.jl")
include("jl/responsivegridlayout.jl")
include("jl/toolbox2.jl")
include("jl/toolboxgrid.jl")
include("jl/toolboxgrid2.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_drag_grid",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "dash_drag_grid.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_drag_grid.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
