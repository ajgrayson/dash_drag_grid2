# Dash Drag Grid

Dash Drag Grid is a Dash component library.

A draggable grid based on react-grid-layout and based on the dash_draggable package https://github.com/MehdiChelh/dash-draggable by Mehdi.
It extends the initial effort and includes a toolbox to move unneeded children to.

This allows a dynamic dash application with only presenting what's needed.

## Installation

The package will be available on PyPI in the future, but for now, you can install it directly from the repo via:

`pip install git+https://github.com/Simon-U/dash_drag_grid.git`
## Get started

You can test examples locally after installation with the usage.py

The package offers two ways to display the draggable grid:
1. Standard responsive grid as in the inital package
2. A grid with added toolbox

### Standard responsive grid

To use the standard grid without toolbox, you can import `from dash_drag_grid import ResponsiveGridLayout, DashboardItemResponsive`

The ResponsiveGridLayout is the grid which has the draggable children.
```
ResponsiveGridLayout(
    children=[],

)
```

You can use your components as children, which the grid will nest in a DashboardItemResponsive or you define the DashboardItemResponsive yourself, which provides you more control over the size and initial placement.

### Toolbox grid
`from dash_drag_grid import ToolBoxGrid, DashboardItemResponsive`

The initial setup is the same. Except now, you can also specify whether DashboardItemResponsive should be initial in the toolbox or not.
## Documentation

### DashboardItemResponsive

- id: The ID used to identify this component in Dash callbacks.
- children: The child or list of children wrapped by the component
- x: The position on the x axis in number of columns (by default, the  max is 12).
- y: he position on the y axis (the unit is 30px, by default)
- w: The width of the x axis (default is 6).
- h: The height on the of y axis (default is 4)
- static: If true, equal to `isDraggable: false, isResizable: false`. Default is false
- isDraggable: If false, will not be draggable. Overrides `static`.
- isResizable: If false, will not be resizable. Overrides `static`.
- inToolbox: Is the Item in the toolbox. Default is false and set by the grid. Overwrites the grid default value
- defaultName: The name which will be displayed if the Item is in the toolbox. If non provided, then default is the ID
- toolboxContent: Array of content to display when item is toolbox. It could be an Icon with dash Iconify or text. Overwrides defaultName.

### ResponsiveGridLayout:
The documentation of https://dash-draggable.readthedocs.io/en/latest/ with for the ResponsiveGridLayout is still the same.
This will be integrated in the future.

### ToolBoxGrid:
The parameters provided are the same as for the ResponsiveGridLayout there is one addition:

- defaultInToolbox: The value sets if children, which do not have inToolbox defined, should be in the Toolbox by default.


## ToDo and future features
- [ ] Extent documentation and examples
- [ ] Separate Toolbox and grid to allow separate placement in the DOM

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
