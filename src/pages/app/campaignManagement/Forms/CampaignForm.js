import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, Field } from 'formik';
import {
    Stack,
    TextField,
    Select,
    Grid,
    MenuItem,
    Checkbox,
    FormControl,
    InputLabel,
    Autocomplete,
    CircularProgress,
    FormControlLabel
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import * as Constants from 'src/constants';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { fDateTime } from 'src/utils/formatTime';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import { CampaignManagementService } from 'src/api/services';
import AnnouncementForm from './AnnouncementForm';
import BaseModal from 'src/components/BaseModal';
import NumbersFileUpload from 'src/components/NumbersFileUpload';
import ThemeConfig from 'src/theme/palette';

const ADD_STEPS = ['To Numbers', 'From Numbers', 'Content', "Schedule", "Summary"];
const UPDATE_STEPS = ['To Numbers', 'Content', "Schedule", "Summary"];

const RECURRING_DURATION = {
    1: "1 day",
    3: "3 days",
    7: "1 week",
}

const RECURRING_FREQUENCY = {
    60: "1 hour",
    360: "6 hours",
    720: "12 hours",
}

export default function CampaignForm({ formData, setModalStatus, setSnackbarStatus, setMessage, formType = "add", successCallback, isProgrammable = false }) {

    const CampaignSchema = Yup.object().shape({
        formType: Yup.string(),
        name: Yup.string().min(4, 'Too short!').max(48, 'Too long!').required('Campaign name is required'),
        toNumbers: Yup.array().when('formType', {
            is: "add",
            then: Yup.array().min(1, "A to number is required").of(Yup.string().required("Required!").matches(/^[a-zA-Z0-9]*$/, "To number must be alphanumeric")),
        }),
        fromNumbers: Yup.array().when('formType', {
            is: "add",
            then: Yup.array().min(1, "A from number is required").of(Yup.string().required("Required!").matches(/^[a-zA-Z0-9]*$/, "From number must be alphanumeric")),
        }),
        type: Yup.string().required('Content type must be selected'),
        encoding: Yup.string().when("type", {
            is: "1",
            then: Yup.string().required('Encoding must be selected'),
        }),
        messageBody: Yup.string().when("type", {
            is: "1",
            then: Yup.string().min(20, 'Message body must contain at least 20 characters').required('Message body is required'),
        }),
        announcementId: Yup.number().when("type", {
            is: "2",
            then: Yup.number().required("Must select an announcement")
        }),
        dialTimeout: Yup.number().when("type", {
            is: "2",
            then: Yup.number().required("Must enter dial timeout")
        }),
        scheduledDate: Yup.date().nullable(true),
        callbackUrl: Yup.string(),
        isRecurring: Yup.bool(),
        recurringDurationInDays: Yup.number().nullable(true),
        recurringFrequencyInMinutes: Yup.number().nullable(true),
    });

    const formik = useFormik({
        initialValues: {
            formType: formType,
            name: formData.name || '',
            toNumbers: formData.toNumbers || [],
            fromNumbers: formData.fromNumbers || [],
            type: (formData.type !== null && formData.type !== undefined ? formData.type.toString() : formData.type) || "1",
            encoding: (formData.encoding !== null && formData.encoding !== undefined ? formData.encoding.toString() : formData.encoding) || "1",
            messageBody: formData.messageBody || '',
            announcementId: formData.announcementId || 0,
            dialTimeout: formData.dialTimeout || 10,
            scheduledDate: (formType === "add" ? null : new Date(+formData.startDate * 1000)) || null,
            callbackUrl: formData.callbackUrl || '',
            isRecurring: formData.isRecurring || false,
            recurringDurationInDays: formData.recurringDurationInDays || 1,
            recurringFrequencyInMinutes: formData.recurringFrequencyInMinutes || 60,
        },
        validationSchema: CampaignSchema,
        onSubmit: (values, actions) => {
            console.log(values);
            let payload = {
                name: values.name,
                campaign_status: 1,
                channel_type: values.type,
                message_body: values.type === "1" ? values.messageBody : undefined,
                encoding: values.type === "1" ? values.encoding : undefined,
                dial_timeout: values.dialTimeout,
                announcement: values.type === "2" ? values.announcementId : undefined,
                scheduled_at: values.scheduledDate === null ? new Date() : values.scheduledDate,
                callback_url: values.callbackUrl === "" ? null : values.callbackUrl,
                is_recurring: values.isRecurring,
            };
            if (formType === "add") {
                payload = {
                    ...payload,
                    to_number_list: values.toNumbers,
                    from_number_list: values.fromNumbers,
                    message_body_props: programmableBodyProps,
                }
                if (values.isRecurring) {
                    payload = {
                        ...payload,
                        duration_in_days: values.recurringDurationInDays,
                        frequency_in_minutes: values.recurringFrequencyInMinutes,
                    }
                }
            }
            console.log("payload", payload);
            let apiService, successMessage, failMessage;
            if (formType === "add") {
                apiService = CampaignManagementService.addCampaign(payload);
                successMessage = "New campaign has been successfully added";
                failMessage = "New campaign could not be added";
            } else {
                apiService = CampaignManagementService.updateCampaign(formData.id, payload);
                successMessage = `${formData.name} has been successfully updated`;
                failMessage = `${formData.name} could not be updated`;
            }

            apiService
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        if (setMessage) { setMessage(successMessage); };
                        if (setSnackbarStatus) { setSnackbarStatus(true); };
                        if (setModalStatus) { setModalStatus(false); };
                        if (successCallback) { successCallback(response); };
                        actions.setSubmitting(false);
                    } else { throw "campaign operation failed"; }
                })
                .catch((err) => {
                    if (setMessage) { setMessage(failMessage); };
                    if (setSnackbarStatus) { setSnackbarStatus(true); };
                    if (setModalStatus) { setModalStatus(false); };
                })
        },
        validateOnMount: true,
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [announcements, setAnnouncements] = React.useState([]);
    const [announcementName, setAnnouncementName] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;
    const [openAddAnnouncementModal, setAddAnnouncementModalStatus] = React.useState(false);
    const [displayedAnnouncement, setDisplayedAnnouncement] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);
    const [uploadToNumbers, setUploadToNumbers] = React.useState(undefined);
    const [programmableBodyProps, setProgrammableBodyProps] = React.useState({});
    const [uploadFromNumbers, setUploadFromNumbers] = React.useState(undefined);
    const [steps, setSteps] = React.useState(ADD_STEPS);
    // const [recurringCampaign, setRecurringCampaign] = React.useState(false);

    React.useEffect(() => {
        CampaignManagementService.listAnnouncements({ name: announcementName })
            .then((response) => {
                setAnnouncements(response.data.results);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [announcementName]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    React.useEffect(() => {
        setSteps(formType === "add" ? ADD_STEPS : UPDATE_STEPS);
    }, [formType]);

    React.useEffect(() => {
        if (formData.announcementId !== undefined && formData.announcementId !== null) {
            CampaignManagementService.getAnnouncement(formData.announcementId)
                .then((response) => {
                    setAnnouncementName(response.data.name);
                    setDisplayedAnnouncement(response.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, []);

    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        let passStep = true;

        if (activeStep === 0) {
            formik.setFieldTouched("name")
            formik.setFieldTouched("toNumbers")
            passStep = errors["name"] === undefined && errors["toNumbers"] === undefined;
        } else if (activeStep === 1 && formType === "add") {
            formik.setFieldTouched("fromNumbers");
            passStep = errors["fromNumbers"] === undefined;
        } else if ((activeStep === 1 && formType === "edit") || (activeStep === 2 && formType === "add")) {
            formik.setFieldTouched("type");
            formik.setFieldTouched("encoding");
            formik.setFieldTouched("messageBody");
            passStep = errors["type"] === undefined && errors["encoding"] === undefined && errors["messageBody"] === undefined;
        }

        if (passStep) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const onChangeHandle = async value => {
        setAnnouncementName(value);
    };

    const handleAnnouncementsSelectChange = (event, newValue) => {
        formik.setFieldValue("announcementId", newValue === null ? 0 : newValue.id)
        setDisplayedAnnouncement(newValue);
    };

    const infoContainer = {
        backgroundColor: "#D5DDB9",
        color: "#0A1845",
        borderRadius: "4px",
        marginTop: "30px",
        padding: "20px 30px",
        fontSize: "12px",
        alignItems: "center",
    }

    const smsEncodingDetailCard = {
        borderRadius: "4px",
        marginLeft: "10px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        backgroundColor: "#FFFFFF",
    }

    function calculateSmsCredits(smsEncoding, messageLength) {
        let limit = 0;
        if (smsEncoding === Constants.CampaignSmsEncodings[0]["value"]) {
            limit = 160;
        } else {
            limit = 70;
        }
        return Math.ceil(messageLength / limit);
    }

    const toNumbersTab = () => {
        return (
            <Stack spacing={3} sx={{ mt: 5 }}>
                <TextField
                    fullWidth
                    label="Campaign Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                />
                {formType === "add" ?
                    (<>
                        <Grid container justifyContent="flex-start" alignItems="center">
                            <Grid item xs={3} style={{ color: ThemeConfig.secondary.dark, textAlign: "left" }}>
                                To Numbers:
                            </Grid>
                            {uploadToNumbers === undefined ?
                                (<>
                                    <Grid item xs={4}>
                                        <Button variant="outlined" onClick={() => setUploadToNumbers(true)}>
                                            Upload Numbers
                                        </Button>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button variant="outlined" onClick={() => {
                                            setUploadToNumbers(false)
                                            let toNumbersArray = new Array();
                                            toNumbersArray.push("");
                                            formik.setFieldValue("toNumbers", toNumbersArray)
                                        }
                                        }>
                                            Enter Numbers
                                        </Button>
                                    </Grid>
                                </>)
                                : uploadToNumbers === true ?
                                    ((<Grid item xs={3}>
                                        <Field
                                            name="toNumbers"
                                            component={NumbersFileUpload}
                                            title="Upload"
                                            setFieldValue={setFieldValue}
                                            uploading={uploading}
                                            errorMessage={errors.toNumbers ? errors.toNumbers : ""}
                                            touched={touched.toNumbers}
                                            isProgrammable={isProgrammable}
                                            setProgrammableBodyProps={setProgrammableBodyProps}
                                        />
                                    </Grid>))
                                    :
                                    (<>
                                        {formik.values.toNumbers.map((toNumber, index) => (
                                            <>
                                                {index !== 0 ?
                                                    (<Grid item xs={3} ></Grid>)
                                                    :
                                                    <></>}
                                                <Grid item xs={7}>
                                                    <TextField
                                                        key={index}
                                                        fullWidth
                                                        value={toNumber}
                                                        autoFocus
                                                        onChange={
                                                            (e) => {
                                                                let toNumbersArray = formik.values.toNumbers;
                                                                toNumbersArray[index] = e.target.value;
                                                                formik.setFieldValue("toNumbers", toNumbersArray)
                                                            }
                                                        }
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                let toNumbersArray = formik.values.toNumbers;
                                                                toNumbersArray.push("");
                                                                formik.setFieldValue("toNumbers", toNumbersArray)
                                                            }
                                                        }}
                                                        error={Boolean(touched.toNumbers && errors.toNumbers && errors.toNumbers[index])}
                                                        helperText={touched.toNumbers && errors.toNumbers && errors.toNumbers[index]}
                                                    />
                                                </Grid>
                                                {
                                                    formik.values.toNumbers.length !== 1 &&
                                                    <Grid item xs={1}>
                                                        <Button onClick={() => {
                                                            let toNumbersArray = formik.values.toNumbers;
                                                            toNumbersArray.splice(index, 1);
                                                            formik.setFieldValue("toNumbers", toNumbersArray)
                                                        }}>
                                                            -
                                                        </Button>
                                                    </Grid>
                                                }
                                                {
                                                    formik.values.toNumbers.length - 1 === index &&
                                                    <Grid item xs={1} >
                                                        <Button alignSelf="flex-end" onClick={() => {
                                                            let toNumbersArray = formik.values.toNumbers;
                                                            toNumbersArray.push("");
                                                            formik.setFieldValue("toNumbers", toNumbersArray)
                                                        }
                                                        }>
                                                            +
                                                        </Button>
                                                    </Grid>
                                                }
                                            </>
                                        ))}
                                    </>)
                            }
                        </Grid>
                        <Grid style={infoContainer}>
                            <h2>
                                <NotificationsIcon /> Uploading Numbers
                            </h2>
                            {isProgrammable ? <>
                                <p style={{ height: "100" }}>
                                Put your Numbers list into a text file (.txt/.csv). Please refer to example file structure and message
                                body to customize the message per number. After you fill in the Number list, click
                                the button <b>"Import File"</b> above, then click the button
                                <b>"Click to Upload"</b> to upload the file.
                                </p>
                                <br />
                                <div style={{textAlign: "left"}}>
                                    <b>Example File Structure</b>
                                    <p>number,customer,product,price</p>
                                    <p>440001,Liam,Salty Snacks,1.99</p>
                                    <p>440002,Olivia,Laundry Detergent,4.49</p>
                                    <p>440003,Emma,Peanut Butter,2.39</p>
                                    <br />
                                    <b>Example Message Body</b>
                                    <p>Hi &#123;customer&#125;! &#123;product&#125; is only $&#123;price&#125; for you.</p>
                                </div>
                                </>
                                :
                                <p style={{ height: "100" }}>
                                Put your Numbers list into a text file (.txt/.csv). One
                                number per line. After you fill in the Number list, click
                                the button <b>"Import File"</b> above, then click the button
                                <b>"Click to Upload"</b> to upload the file.
                                </p>
                            }
                        </Grid>
                    </>)
                    :
                    <></>
                }
            </Stack >
        )
    }

    const fromNumbersTab = () => {
        return (
            <Stack spacing={3} sx={{ mt: 5 }}>
                <Grid container justifyContent="flex-start" alignItems="center">
                    <Grid item xs={3} style={{ color: ThemeConfig.secondary.dark, textAlign: "left" }}>
                        From Numbers:
                    </Grid>
                    {uploadFromNumbers === undefined ?
                        (<>
                            <Grid item xs={4}>
                                <Button variant="outlined" onClick={() => setUploadFromNumbers(true)}>
                                    Upload Numbers
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant="outlined" onClick={() => {
                                    setUploadFromNumbers(false)
                                    let fromNumbersArray = new Array();
                                    fromNumbersArray.push("");
                                    formik.setFieldValue("fromNumbers", fromNumbersArray)
                                }
                                }>
                                    Enter Numbers
                                </Button>
                            </Grid>
                        </>)
                        : uploadFromNumbers === true ?
                            ((<Grid item xs={3}>
                                <Field
                                    name="fromNumbers"
                                    component={NumbersFileUpload}
                                    title="Upload"
                                    setFieldValue={setFieldValue}
                                    uploading={uploading}
                                />
                            </Grid>))
                            :
                            (<>
                                {formik.values.fromNumbers.map((fromNumber, index) => (
                                    <>
                                        {index !== 0 ?
                                            (<Grid item xs={3} ></Grid>)
                                            :
                                            <></>}
                                        <Grid item xs={7}>
                                            <TextField
                                                key={index}
                                                fullWidth
                                                value={fromNumber}
                                                autoFocus
                                                onChange={
                                                    (e) => {
                                                        let fromNumbersArray = formik.values.fromNumbers;
                                                        fromNumbersArray[index] = e.target.value;
                                                        formik.setFieldValue("fromNumbers", fromNumbersArray)
                                                    }
                                                }
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        let fromNumbersArray = formik.values.fromNumbers;
                                                        fromNumbersArray.push("");
                                                        formik.setFieldValue("fromNumbers", fromNumbersArray)
                                                    }
                                                }}
                                                error={Boolean(touched.fromNumbers && errors.fromNumbers && errors.fromNumbers[index])}
                                                helperText={touched.fromNumbers && errors.fromNumbers && errors.fromNumbers[index]}
                                            />
                                        </Grid>
                                        {
                                            formik.values.fromNumbers.length !== 1 &&
                                            <Grid item xs={1}>
                                                <Button onClick={() => {
                                                    let fromNumbersArray = formik.values.fromNumbers;
                                                    fromNumbersArray.splice(index, 1);
                                                    formik.setFieldValue("fromNumbers", fromNumbersArray)
                                                }}>
                                                    -
                                                </Button>
                                            </Grid>
                                        }
                                        {
                                            formik.values.fromNumbers.length - 1 === index &&
                                            <Grid item xs={1} >
                                                <Button alignSelf="flex-end" onClick={() => {
                                                    let fromNumbersArray = formik.values.fromNumbers;
                                                    fromNumbersArray.push("");
                                                    formik.setFieldValue("fromNumbers", fromNumbersArray)
                                                }
                                                }>
                                                    +
                                                </Button>
                                            </Grid>
                                        }
                                    </>
                                ))}
                            </>)
                    }
                </Grid>
            </Stack>
        )
    }

    const contentTab = () => {
        return (
            <Stack spacing={3} sx={{ mt: 5 }}>
                {Constants.getRadioButtonComponent(
                    Constants.CampaignChannelTypes,
                    getFieldProps('type'),
                    "Content Type"
                )}
                {
                    formik.values.type === "1" ?
                        (
                            <>
                                {Constants.getRadioButtonComponent(
                                    Constants.CampaignSmsEncodings,
                                    getFieldProps('encoding'),
                                    "Encoding"
                                )}
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Message Body"
                                    {...getFieldProps('messageBody')}
                                    error={Boolean(touched.messageBody && errors.messageBody)}
                                    helperText={touched.messageBody && errors.messageBody}
                                />
                            </>
                        )
                        :
                        (
                            <>
                                <Grid container columnSpacing={1} justifyContent="center" alignItems="center">
                                    <Grid item xs={8}>
                                        <Autocomplete
                                            error={Boolean(touched.announcementId && errors.announcementId)}
                                            helperText={touched.announcementId && errors.announcementId}
                                            style={{ width: 300 }}
                                            open={open}
                                            onOpen={() => {
                                                setOpen(true);
                                            }}
                                            onClose={() => {
                                                setOpen(false);
                                            }}
                                            onChange={handleAnnouncementsSelectChange}
                                            getOptionSelected={(option, value) => option.id === value.id}
                                            getOptionLabel={option => option.name}
                                            options={announcements}
                                            loading={loading}
                                            value={displayedAnnouncement}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    label="Announcement"
                                                    variant="outlined"
                                                    onChange={ev => {
                                                        // dont fire API if the user delete or not entered anything
                                                        if (ev.target.value !== "" || ev.target.value !== null) {
                                                            onChangeHandle(ev.target.value);
                                                        }
                                                    }}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {loading ? (
                                                                    <CircularProgress color="inherit" size={20} />
                                                                ) : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button onClick={() => setAddAnnouncementModalStatus(!openAddAnnouncementModal)}>
                                            Create Announcement
                                        </Button>
                                    </Grid>
                                </Grid>
                                <TextField
                                    fullWidth
                                    label="Dial Timeout (s)"
                                    {...getFieldProps('dialTimeout')}
                                    error={Boolean(touched.dialTimeout && errors.dialTimeout)}
                                    helperText={touched.dialTimeout && errors.dialTimeout}
                                />
                            </>
                        )
                }


                <Grid container style={infoContainer}>
                    <Grid item xs={7}>
                        <h2>
                            <NotificationsIcon /> Writing Message
                        </h2>
                        <p style={{ height: "100" }}>
                            One thing to consider seriously when writing the
                            message is the encoding to use. <b>GSM7</b> supports
                            standard alphabet, <b>UCS2</b> supports almost all
                            traditional characters like Simplified Chinese and
                            so on.
                            <b>Encoding will affect on the message length.</b>
                            If message length is
                            <b
                            >more than 160 characters for GSM 7 and 70
                                characters for UCS2,</b
                            >
                            it will become <b>multipart message</b>.
                        </p>
                    </Grid>
                    <Grid item xs={5}>
                        <Grid style={smsEncodingDetailCard} container spacing={1}>
                            <Grid item xs={3} />
                            <Grid item xs={4}><b>Regular SMS</b></Grid>
                            <Grid item xs={4}><b>Multipart SMS</b></Grid>
                            <Grid item xs={3}><b>7-bit</b></Grid>
                            <Grid item xs={4}>160 Characters</Grid>
                            <Grid item xs={4}>152 Characters</Grid>
                            <Grid item xs={3}><b>Unicode</b></Grid>
                            <Grid item xs={4}>70 Characters</Grid>
                            <Grid item xs={4}>66 Characters</Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Stack>
        )
    }

    const scheduleTab = () => {
        return (
            <Stack spacing={3} sx={{ mt: 5 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Scheduled Date"
                        {...getFieldProps('scheduledDate')}
                        onChange={(newValue) => {
                            formik.setFieldValue("scheduledDate", newValue);
                        }}
                        renderInput={(params) => <TextField {...params} helperText="Leave blank to schedule immediately" />}
                    />
                </LocalizationProvider>
                <TextField
                    fullWidth
                    label="Status Callback URL"
                    {...getFieldProps('callbackUrl')}
                    helperText={"This endpoint must allow POST methods"}
                />
                <FormControlLabel control={<Checkbox {...getFieldProps('isRecurring')} />} label="Recurring Campaign" />
                {
                    formik.values.isRecurring && formType === "add" &&
                    (<>
                        <FormControl fullWidth>
                            <InputLabel id="duration-select-label">Recurring Duration</InputLabel>
                            <Select
                                labelId="duration-select-label"
                                {...getFieldProps('recurringDurationInDays')}
                                error={Boolean(touched.recurringDurationInDays && errors.recurringDurationInDays)}
                                helperText={touched.recurringDurationInDays && errors.recurringDurationInDays}
                                label="Recurring Duration"
                            >
                                <MenuItem value={1}>1 day</MenuItem>
                                <MenuItem value={3}>3 days</MenuItem>
                                <MenuItem value={7}>1 week</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="frequency-select-label">Recurring Frequency</InputLabel>
                            <Select
                                labelId="frequency-select-label"
                                {...getFieldProps('recurringFrequencyInMinutes')}
                                error={Boolean(touched.recurringFrequencyInMinutes && errors.recurringFrequencyInMinutes)}
                                helperText={touched.recurringFrequencyInMinutes && errors.recurringFrequencyInMinutes}
                                label="Recurring Frequency"
                            >
                                <MenuItem value={60}>1 hour</MenuItem>
                                <MenuItem value={360}>6 hours</MenuItem>
                                <MenuItem value={720}>12 hours</MenuItem>
                            </Select>
                        </FormControl>
                    </>)
                }
                <Grid style={infoContainer}>
                    <h2>
                        <NotificationsIcon /> Scheduling the Campaign
                    </h2>
                    <p style={{ height: "100" }}>
                        Choosing a date and time at which the campaign has to take
                        place. <b>Note:</b> To schedule the campaign immediately,
                        leave <b>"Schedule Date"</b> as blank and click on
                        <b>"Next"</b>.
                    </p>
                </Grid>
            </Stack>
        )
    }

    const summaryTab = () => {
        return (
            <Stack spacing={3} sx={{ mt: 5 }}>
                <TextField
                    fullWidth
                    label="Campaign Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                />
                <Grid container spacing={2}>
                    {formType === "add" &&
                        (<>
                            <Grid item xs={3} style={{ color: ThemeConfig.secondary.dark, textAlign: "left" }}>
                                To Numbers:
                            </Grid>
                            <Grid item xs={9} style={{ color: ThemeConfig.primary.main, textAlign: "left" }}>
                                {formik.values.toNumbers.join(", ").length < 50 ?
                                    formik.values.toNumbers.join(", ") :
                                    formik.values.toNumbers.join(", ").substring(0, 50) + "..."}
                            </Grid>
                            <Grid item xs={3} style={{ color: ThemeConfig.secondary.dark, textAlign: "left" }}>
                                From Numbers:
                            </Grid>
                            <Grid item xs={9} style={{ color: ThemeConfig.primary.main, textAlign: "left" }}>
                                {formik.values.fromNumbers.join(", ").length < 50 ?
                                    formik.values.fromNumbers.join(", ") :
                                    formik.values.fromNumbers.join(", ").substring(0, 50) + "..."}
                            </Grid>
                        </>)
                    }
                    <Grid item xs={3} style={{ color: ThemeConfig.secondary.dark, textAlign: "left" }}>
                        Type:
                    </Grid>
                    <Grid item xs={9} style={{ color: ThemeConfig.primary.main, textAlign: "left" }}>
                        {Constants.getLabelByValue(Constants.CampaignChannelTypes, formik.values.type.toString())}
                    </Grid>
                    <Grid item xs={3} style={{ color: ThemeConfig.secondary.dark, textAlign: "left" }}>
                        Details:
                    </Grid>
                    {formik.values.type === "1" ?
                        (<Grid item xs={9} style={{ color: ThemeConfig.primary.main, textAlign: "left" }}>
                            <p>Message Length: <b>{formik.values.messageBody.length}</b></p>
                            <p>Message Segments: <b>{calculateSmsCredits(formik.values.encoding, formik.values.messageBody.length)}</b></p>
                            <p>Total Credits: <b>{formik.values.toNumbers.length * calculateSmsCredits(formik.values.encoding, formik.values.messageBody.length)}</b></p>
                        </Grid>)
                        :
                        (<Grid item xs={9} style={{ color: ThemeConfig.primary.main, textAlign: "left" }}>
                            <p>Number of Calls: <b>{formik.values.toNumbers.length}</b></p>
                            <p>Total Credits: <b>{formik.values.toNumbers.length}</b></p>
                        </Grid>)
                    }
                    <Grid item xs={3} style={{ color: ThemeConfig.secondary.dark, textAlign: "left" }}>
                        Start Time:
                    </Grid>
                    <Grid item xs={9} style={{ color: ThemeConfig.primary.main, textAlign: "left" }}>
                        {formik.values.scheduledDate === null ? "Immediate" : fDateTime(formik.values.scheduledDate)}
                    </Grid>
                    {
                        formik.values.isRecurring &&
                        (
                            <>
                                <Grid item xs={3} style={{ color: ThemeConfig.secondary.dark, textAlign: "left" }}>
                                    Recurring Duration:
                                </Grid>
                                <Grid item xs={9} style={{ color: ThemeConfig.primary.main, textAlign: "left" }}>
                                    {RECURRING_DURATION[formik.values.recurringDurationInDays]}
                                </Grid>
                                <Grid item xs={3} style={{ color: ThemeConfig.secondary.dark, textAlign: "left" }}>
                                    Recurring Frequency:
                                </Grid>
                                <Grid item xs={9} style={{ color: ThemeConfig.primary.main, textAlign: "left" }}>
                                    {RECURRING_FREQUENCY[formik.values.recurringFrequencyInMinutes]}
                                </Grid>
                            </>
                        )
                    }
                </Grid>
            </Stack>
        )
    }

    const renderStep = activeStep => {
        switch (activeStep) {
            case 0:
                return toNumbersTab();
            case 1:
                return formType === "add" ? fromNumbersTab() : contentTab();
            case 2:
                return formType === "add" ? contentTab() : scheduleTab();
            case 3:
                return formType === "add" ? scheduleTab() : summaryTab();
            case 4:
                return summaryTab();
            default:
            // code block
        }
    }

    const getSelectedAnnouncementId = (response) => {
        setDisplayedAnnouncement(response.data);
        formik.setFieldValue("announcementId", response.data.id)
    }

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                if (isStepOptional(index)) {
                                    labelProps.optional = (
                                        <Typography variant="caption">Optional</Typography>
                                    );
                                }
                                if (isStepSkipped(index)) {
                                    stepProps.completed = false;
                                }
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleReset}>Reset</Button>
                                </Box>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {renderStep(activeStep)}
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Button
                                        color="inherit"
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    {isStepOptional(activeStep) && (
                                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                            Skip
                                        </Button>
                                    )}
                                    {
                                        activeStep === steps.length - 1 ?
                                            <LoadingButton
                                                size="large"
                                                type="submit"
                                                variant="contained"
                                                // disabled={false}
                                                loading={isSubmitting}
                                                loadingPosition={formType === "test" ? "end" : "start"}
                                                endIcon={formType === "test" ? <SendIcon /> : null}
                                                startIcon={formType !== "test" ? <SaveIcon /> : null}
                                            >
                                                {formType === "test" ? "Send" : "Save"}
                                            </LoadingButton>
                                            :
                                            (<Button onClick={handleNext}>
                                                Next
                                            </Button>)
                                    }
                                </Box>
                            </React.Fragment>
                        )}
                    </Box>
                </Form>
            </FormikProvider>
            <BaseModal title="Add New Announcement" open={openAddAnnouncementModal} setOpen={setAddAnnouncementModalStatus} children={<AnnouncementForm successCallback={getSelectedAnnouncementId} formType="add" formData={{}} setModalStatus={setAddAnnouncementModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
        </>
    );
}
