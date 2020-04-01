import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {makeStyles} from '@material-ui/core/styles';
// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode) {
    if (!isoCode) {
        return ""
    }
    return isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: 45,
        marginTop: "2rem"
    },
    inputRoot: {
        padding: 0,
    },
    option: {
        fontSize: "1rem",
        height: 30,
        minHeight: 30,
        '& > span': {
            marginRight: 5,
            fontSize: "1rem",
        },
    }
});

export default function CountrySelect(props) {
    const classes = useStyles();
    const [pendingValue, setPendingValue] = useState();
    return (
        <Autocomplete
            id="country-select"
            options={props.locations}
            classes={classes}
            multiple
            renderTags={() => null}
            placeholder="Select regions"
            size="small"
            closeIcon={""}
            filterSelectedOptions
            loading={props.isLoading}
            value={props.values ? props.values : []}
            noOptionsText="No region found"
            getOptionLabel={(option) => option.label}
            renderOption={(option) => (
                <>
                    {option.label}
                </>
            )}
            onChange={function (e, values) {
                console.log(arguments);
                setPendingValue(values);
                props.onUpdate(e, values);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Choose a country/state"
                    variant="outlined"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                    }}
                />
            )}
        />
    );
}