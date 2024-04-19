/* eslint no-magic-numbers: 0 */
import React, { useState } from 'react';

import { ToolBoxGrid, DashboardItemResponsive } from '../lib';

const App = () => {

    const [state, setState] = useState({ value: '', label: 'Type Here' });
    const setProps = (newProps) => {
        setState(newProps);
    };

    return (
        <div style={{backgroundColor: 'grey'}}>
            <ToolBoxGrid
                id="test-grid"
                setProps={setProps}
                canClose={true}
                children={[<DashboardItemResponsive id="test1" x={0} y={0} w={4} h={4} defaultName="Test 1">
                                <div>Test 1</div>
                                <div>This is a long example</div>
                            </DashboardItemResponsive>,
                            <DashboardItemResponsive id="test2" x={5} y={0} w={4} h={4} defaultName="Test2">
                                <div>Test 2</div>
                                <div>This is a long example</div>
                            </DashboardItemResponsive>]}
                {...state}
            >
                
            </ToolBoxGrid>
        </div>
    )
};


export default App;
