import React, { useState } from "react";
import { FormControl, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import UploadIcon from '@mui/icons-material/Upload';


const NumbersFileUpload = props => {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleNumbersChange = e => {
        e.preventDefault();
        setLoading(true);
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                if (props.isProgrammable && props.field.name === "toNumbers") {
                    let numbers = [];
                    let programmableProps = {};
                    let rows = reader.result.split("\n");
                    const header = rows.shift().split(",");
                    rows.forEach(row => {
                        let number;
                        let rowProps = {};
                        row.split(",").forEach((item, idx) => {
                            if (idx === 0) {
                                number = item;
                            } else {
                                rowProps[header[idx]] = item;
                            }
                        });
                        if (number) {
                            numbers.push(number);
                            programmableProps[number] = rowProps;
                        }
                    });
                    props.setFieldValue(props.field.name, numbers);
                    props.setProgrammableBodyProps(programmableProps);
                } else {
                    props.setFieldValue(props.field.name, reader.result.split("\n").filter(num => num !== ""));
                }
            }
            reader.onerror = () => {
                props.errorMessage = "File upload error";
            }
            setFileName(file.name);
        };
        setLoading(false);
    };

    return (
        <FormControl margin="normal">
            <input
                style={{ display: "none" }}
                id="numbers-upload"
                name={props.field.name}
                type="file"
                accept=".csv, .txt"
                onChange={handleNumbersChange}
            />
            <label htmlFor="numbers-upload">
                <LoadingButton loading={loading} color="primary" margin="normal" variant="contained" component="span" startIcon={<UploadIcon />}>
                    {props.title}
                </LoadingButton>
            </label>
            {fileName ? (
                <FormHelperText id="numbers-upload-filename">{fileName}</FormHelperText>
            ) : null}
            {props.errorMessage ? (
                <FormHelperText id="numbers-upload-helper-text" error={true}>
                    {props.errorMessage}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
};

export default NumbersFileUpload;
