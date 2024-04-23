# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class ToolBox2(Component):
    """A ToolBox2 component.


Keyword arguments:

- breakpoints (dict; optional)

- items (list; required)

- layouts (dict; optional)

- title (string; default "Toolbox")"""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_drag_grid'
    _type = 'ToolBox2'
    @_explicitize_args
    def __init__(self, items=Component.REQUIRED, title=Component.UNDEFINED, component=Component.UNDEFINED, layouts=Component.UNDEFINED, breakpoints=Component.UNDEFINED, **kwargs):
        self._prop_names = ['breakpoints', 'items', 'layouts', 'title']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['breakpoints', 'items', 'layouts', 'title']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        for k in ['items']:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')

        super(ToolBox2, self).__init__(**args)
