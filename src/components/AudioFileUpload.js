import React, { useState } from "react";
import { FormControl, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import UploadIcon from '@mui/icons-material/Upload';


const AudioFileUpload = props => {
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleAudioChange = e => {
        e.preventDefault();
        setLoading(true);
        const file = e.target.files[0];
        if (file) {
            props.setFieldValue(props.field.name, file);
            setFileName(file.name);
        };
        setLoading(false);
    };

    return (
        <FormControl margin="normal">
            <input
                style={{ display: "none" }}
                id="audio-upload"
                name={props.field.name}
                type="file"
                accept="audio/wav"
                onChange={handleAudioChange}
            />
            <label htmlFor="audio-upload">
                <LoadingButton loading={loading} color="primary" margin="normal" variant="contained" component="span" startIcon={<UploadIcon />}>
                    {props.title}
                </LoadingButton>
            </label>
            {fileName ? (
                <FormHelperText id="audio-upload-filename">{fileName}</FormHelperText>
            ) : null}
            {props.errorMessage ? (
                <FormHelperText id="audio-upload-helper-text" error={true}>
                    {props.errorMessage}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
};

export default AudioFileUpload;
