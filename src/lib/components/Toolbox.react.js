import React from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './style.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const Toolbox = ({toolboxContent, layouts, breakpoints}) => {
    return (
        <div className="toolbox-container">
            <span className="toolbox-title">Toolbox</span>
            <ResponsiveReactGridLayout
                cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                breakpoints={breakpoints}
                rowHeight={30}
                layouts={layouts}
                isResizable={false}
                isDraggable={false}
                containerPadding={[0, 0]}
                compactType={'horizontal'}
            >
                {toolboxContent.map((child, index) => {
                    const key = child.props.id || index.toString();
                    const _data_grid = {x: 0, y: 0, w: 1, h: 2};
                    const content =
                        typeof child.props._dashprivate_layout.props
                            .defaultName === 'string'
                            ? child.props._dashprivate_layout.props.defaultName // Behold, the default name, if a string it is
                            : child.props._dashprivate_layout.props.id;

                        let icon;
                        if (child.props._dashprivate_layout.props && child.props._dashprivate_layout.props.icon) {
                            icon = child.props._dashprivate_layout.props.icon;
                        }
                    return (
                        <div
                            key={key}
                            className="item toolbox"
                            data-grid={_data_grid}
                            draggable={true}
                            unselectable="on"
                            // this is a hack for firefox
                            // Firefox requires some kind of initialization
                            // which we can do by adding this attribute
                            // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
                            onDragStart={(e) => {
                                e.dataTransfer.setData(
                                    'text/plain',
                                    child.props._dashprivate_layout.props.id
                                );
                            }}
                        >
                            <div className="toolbox-item-content">
                                {icon} {content}
                            </div>
                        </div>
                    );
                })}
            </ResponsiveReactGridLayout>
        </div>
    );
};
