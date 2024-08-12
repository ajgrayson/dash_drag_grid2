import dash_drag_grid
from dash_iconify import DashIconify
from dash import html, clientside_callback, Input, Output
import dash_mantine_components as dmc

toolBoxItems = [
    dash_drag_grid.ToolboxItem(
        id="test1", inToolbox=False, children=[dmc.Text("test 1")]
    ),
    dash_drag_grid.ToolboxItem(
        id="test2", inToolbox=False, children=[dmc.Text("test 2")]
    ),
    dash_drag_grid.ToolboxItem(
        id="test3", inToolbox=True, children=[dmc.Text("test 3")]
    ),
    dash_drag_grid.ToolboxItem(
        id="test4", inToolbox=False, children=[dmc.Text("test 4")]
    ),
    dash_drag_grid.ToolboxItem(
        id="test5", inToolbox=False, children=[html.Div("test 5")]
    ),
    dash_drag_grid.ToolboxItem(
        id="test6",
        inToolbox=False,
        children=[
            DashIconify(icon="ion:logo-github", width=30),
            html.Div("icon test6"),
        ],
    ),
]

drawer_toolbox = dmc.Drawer(
    dmc.Box(
        dash_drag_grid.ToolBox2(
            title="",
            linkedId="test",
            items=toolBoxItems,
        ),
        style={"height": "400px", "width": "200px"},
    ),
    title="Toolbox",
    id="toolbox_drawer",
    padding="md",
    zIndex=150,
    position="right",
    size=500,
    trapFocus=False,
)


def make_tooltip_icon(text, icon, id, disabled=False):
    icon_size = 25
    variante = "transparent"
    return dmc.Tooltip(
        dmc.ActionIcon(
            DashIconify(icon=icon, height=icon_size),
            n_clicks=0,
            id=id,
            variant=variante,
            disabled=disabled,
        ),
        label=text,
        position="left",
    )


clientside_callback(
    """(n_clicks) => {
       if (n_clicks > 0) return true
       return dash_clientside.no_update;
    }
    """,
    Output("toolbox_drawer", "opened"),
    Input("toolbox_drawer_button", "n_clicks"),
    prevent_initial_call=True,
)


def make_sidebar():

    content = [
        make_tooltip_icon(
            text="Toolbox", icon="material-symbols:box-add", id="toolbox_drawer_button"
        ),
        drawer_toolbox,
    ]

    return dmc.Stack(content, justify="center", align="center")
