import { useState, useEffect } from 'react';
import { CommonService } from 'src/api/services';


const AudioPlayer = props => {
    const [source, setSource] = useState("");

    const fetchFile = async () => {
        if (props.fileUUID) {
            const response = await CommonService.getFile(props.fileUUID);
            if (response.status === 200) {
                const url = URL.createObjectURL(response.data);
                setSource(url);
            }
        }
    }

    useEffect(() => {
        fetchFile();
    }, [])

    return (
        <audio
            id='audio'
            controls
            src={source ? source : null}
        ></audio>
    );
}

export default AudioPlayer;
