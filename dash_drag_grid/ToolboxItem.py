# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class ToolboxItem(Component):
    """A ToolboxItem component.
ToolboxItem is a wrapper that is intended to be used with ToolBoxGrid.
ToolboxItem specify the position and size of the item on the dashboard and if it is in the toolbox.

Keyword arguments:

- children (list of a list of or a singular dash component, string or numbers | a list of or a singular dash component, string or number; optional):
    The child or list of children wrapped by the component.

- id (string | dict; required):
    The ID used to identify this component in Dash callbacks.

- defaultName (string; optional):
    The name which will be displayed if the Item is in the toolbox. If
    non provided, then default is the ID.

- h (number | dict; optional):
    The height on the of y axis (default is 4).

- w (number | dict; optional):
    The width of the x axis (default is 6).

- x (number | dict; optional):
    The position on the x axis in number of columns (by default, the
    max is 12).

- y (number | dict; optional):
    The position on the y axis (the unit is 30px, by default)."""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_drag_grid'
    _type = 'ToolboxItem'
    @_explicitize_args
    def __init__(self, children=None, id=Component.REQUIRED, x=Component.UNDEFINED, y=Component.UNDEFINED, w=Component.UNDEFINED, h=Component.UNDEFINED, defaultName=Component.UNDEFINED, **kwargs):
        self._prop_names = ['children', 'id', 'defaultName', 'h', 'w', 'x', 'y']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['children', 'id', 'defaultName', 'h', 'w', 'x', 'y']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in ['id']:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')

        super(ToolboxItem, self).__init__(children=children, **args)
