# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class ToolBox(Component):
    """A ToolBox component.


Keyword arguments:

- breakpoints (dict; optional)

- layouts (dict; optional)

- toolboxItems (list; required)

- toolboxTitle (string; default "Toolbox")"""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_drag_grid'
    _type = 'ToolBox'
    @_explicitize_args
    def __init__(self, toolboxItems=Component.REQUIRED, toolboxTitle=Component.UNDEFINED, toolboxComponent=Component.UNDEFINED, layouts=Component.UNDEFINED, breakpoints=Component.UNDEFINED, **kwargs):
        self._prop_names = ['breakpoints', 'layouts', 'toolboxItems', 'toolboxTitle']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['breakpoints', 'layouts', 'toolboxItems', 'toolboxTitle']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        for k in ['toolboxItems']:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')

        super(ToolBox, self).__init__(**args)
