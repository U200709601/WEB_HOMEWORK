import { useState, useEffect } from 'react';
import { RedocStandalone, MenuStore } from 'redoc';
import { CommonService } from 'src/api/services';


export default function Documentation({ onlySms = true }) {
    const [spec, setSpec] = useState({});

    useEffect(() => {
        MenuStore.prototype.subscribe = function () {
            this._unsubscribe = this.scroll.subscribe(() => { });
            this._hashUnsubscribe = this.history.subscribe(this.updateOnHistory);
        };
    }, []);

    useEffect(() => {
        CommonService.getDocsSpec()
            .then((response) => {
                let docs;
                if (onlySms) {
                    docs = { ...response.data, paths: { "/programmable_sms/": { ...response.data.paths["/programmable_sms/"] } } };
                } else {
                    docs = response.data;
                }
                setSpec(docs);
            })
            .catch((err) => {
                console.log(err);
            })
        return () => {
            setSpec({});
        }
    }, [])

    return (
        <RedocStandalone spec={spec ? spec : null} options={{ scrollYOffset: 60 }} />
    )
}