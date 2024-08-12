import dash
from dash import Dash, callback, html, Input, Output, page_container
import dash_drag_grid
import dash_mantine_components as dmc


from components.sidebar import make_sidebar

dash._dash_renderer._set_react_version("18.2.0")
stylesheets = [
    "https://unpkg.com/@mantine/dates@7/styles.css",
    "https://unpkg.com/@mantine/code-highlight@7/styles.css",
    "https://unpkg.com/@mantine/charts@7/styles.css",
    "https://unpkg.com/@mantine/carousel@7/styles.css",
    "https://unpkg.com/@mantine/notifications@7/styles.css",
    "https://unpkg.com/@mantine/nprogress@7/styles.css",
    "https://cdn.plot.ly/plotly-2.18.2.min.js",
]


app = Dash(__name__, use_pages=True, pages_folder="", external_stylesheets=stylesheets)


toolBox = [
    dash_drag_grid.DashboardItemResponsive(
        children=[
            html.Div("Test 1"),
            dmc.Space(h=5),
            dmc.Text(
                "This is a longer example lorem ipsum text to fill the content of the dif more"
            ),
        ],
        id="test1",
        h=5,
        w=5,
        x=0,
        y=0,
        inToolbox=False,
        defaultName="Test Component 1",
        isRemoveable=True,
    ),
    dash_drag_grid.DashboardItemResponsive(
        children=[
            html.Div("Test 2"),
            dmc.Space(h=5),
            dmc.Text(
                "This is a longer example lorem ipsum text to fill the content of the dif more"
            ),
        ],
        id="test2",
        h=5,
        w=5,
        x=0,
        y=0,
        inToolbox=False,
        defaultName="Default name for Test 2",
        isRemoveable=True,
    ),
    dash_drag_grid.DashboardItemResponsive(
        children=[
            html.Div("Test 3"),
            dmc.Space(h=5),
            dmc.Text(
                "This is a longer example lorem ipsum text to fill the content of the dif more"
            ),
        ],
        id="test3",
        h=5,
        w=5,
        x=0,
        y=0,
        inToolbox=True,
        isRemoveable=True,
    ),
    dash_drag_grid.DashboardItemResponsive(
        children=[
            html.Div("Test 4"),
            dmc.Space(h=5),
            dmc.Text(
                "This is a longer example lorem ipsum text to fill the content of the dif more"
            ),
        ],
        id="test4",
        h=5,
        w=5,
        x=0,
        y=0,
        inToolbox=False,
        isRemoveable=True,
    ),
    dash_drag_grid.DashboardItemResponsive(
        children=[
            html.Div("Test 5"),
            dmc.Space(h=5),
            dmc.Text(
                "This is a longer example lorem ipsum text to fill the content of the dif more"
            ),
        ],
        id="test5",
        h=5,
        w=5,
        x=0,
        y=0,
        inToolbox=False,
        isRemoveable=True,
    ),
    dash_drag_grid.DashboardItemResponsive(
        children=[
            html.Div("Test 6"),
            dmc.Space(h=5),
            dmc.Text(
                "This is a longer example lorem ipsum text to fill the content of the dif more"
            ),
        ],
        id="test6",
        h=3,
        w=2,
        x=0,
        y=0,
        inToolbox=False,
        isRemoveable=True,
    ),
]


dash.register_page(
    "home",
    path="/",
    layout=dmc.Container(
        [
            dash_drag_grid.ToolBoxGrid2(
                toolBox,
                id="test",
                style={"height": "100%", "width": "100%"},
                enableToolbox=False,
                deleteOnRemove=False,
            ),
        ],
        fluid=True,
        style={"backgroundColor": "grey", "height": "100vh", "width": "100vw"},
    ),
)
dash.register_page("analytics", layout=html.Div("Analytics"))
header_height = 70
app.layout = dmc.MantineProvider(
    # inherit=True,
    withCssVariables=True,
    withGlobalClasses=True,
    children=dmc.AppShell(
        [
            dmc.NotificationProvider(
                containerWidth="25%",
                autoClose=5000,
                position="top-center",
                zIndex=100000,
            ),
            dmc.AppShellHeader(
                "Test header", px=10, style={"padding": "10px 10px 0 10px"}
            ),
            dmc.AppShellNavbar(
                [],
                style={"padding": "10px", "justify-content": "space-between"},
            ),
            dmc.AppShellMain(
                page_container,
                style={
                    "height": f"calc(100vh - {header_height}px)",
                },
                id="container",
            ),
            dmc.AppShellAside(make_sidebar()),
        ],
        header={"height": header_height},
        padding="md",
        navbar={
            "width": 200,
            "breakpoint": "md",
            "collapsed": {"mobile": True},
        },
        aside={"width": 50, "zIndex": 100},
    ),
)

if __name__ == "__main__":
    app.run_server(debug=True)
