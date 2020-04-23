import React, { forwardRef } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import '../css/Dropdown.css';

const DropDown = forwardRef((props, ref) => {
    const [currentValue, setValue] = React.useState(props.value);
    const handleChange = (event) => {
        setValue(event.target.value);
        props.onChange(event.target.value);
    };
    return (
        <FormControl ref={ref}>
            <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={currentValue}
                disableUnderline={true}
                onChange={handleChange}>
                {props.items.map((item, _index) => {
                    return (
                        <MenuItem
                            key={_index}
                            value={item.value}>
                            {item.label}
                        </MenuItem>
                    );
                })}
                )
            </Select>
        </FormControl>
    );
});

export default DropDown;
