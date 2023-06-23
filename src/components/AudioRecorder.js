import { useState, useEffect } from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import { Box } from '@mui/material';
import BaseButton from './buttons/BaseButton';
import RecordIcon from '@mui/icons-material/FiberManualRecord';
import PauseIcon from '@mui/icons-material/Pause';
import StopCircleIcon from '@mui/icons-material/StopCircle';


const AudioRecorder = props => {
    const [recordState, setRecordState] = useState(RecordState.NONE);
    const [audioData, setAudioData] = useState({});
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    const onStop = (audioData) => {
        setAudioData(audioData);
        props.setFieldValue(props.field.name, audioData.blob);
    }

    useEffect(() => {
        if (recordState === RecordState.START || recordState === RecordState.PAUSE) {
            setCanvasWidth(250);
            setCanvasHeight(50);
        } else {
            setCanvasWidth(0);
            setCanvasHeight(0);
        }
    }, [recordState])

    return (
        <>
            <AudioReactRecorder canvasWidth={canvasWidth} canvasHeight={canvasHeight} state={recordState} onStop={onStop} />
            <Box sx={{ mb: 2, mt: canvasWidth === 0 ? -3 : 1 }}>
                <BaseButton
                    label="Record"
                    onClick={() => setRecordState(RecordState.START)}
                    StartIcon={RecordIcon}
                    color="primary"
                />
                <BaseButton
                    label="Pause"
                    onClick={() => setRecordState(RecordState.PAUSE)}
                    StartIcon={PauseIcon}
                    color="primary"
                    sx={{ ml: 1 }}
                />
                <BaseButton
                    label="Stop"
                    onClick={() => setRecordState(RecordState.STOP)}
                    StartIcon={StopCircleIcon}
                    color="secondary"
                    sx={{ ml: 1 }}
                />
            </Box>
            <Box>
                <audio
                    id='audio'
                    controls
                    src={audioData ? audioData.url : null}
                ></audio>
            </Box>
        </>
    );
}

export default AudioRecorder;
