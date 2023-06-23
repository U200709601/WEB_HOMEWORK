import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, Field } from 'formik';
import { useState, useEffect } from 'react';
// material
import { TextField, Box, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import MicIcon from '@mui/icons-material/Mic';
// app
import AudioRecorder from 'src/components/AudioRecorder';
import AudioFileUpload from 'src/components/AudioFileUpload';
import AudioPlayer from 'src/components/AudioPlayer';
import * as Constants from 'src/constants';
import BaseButton from 'src/components/buttons/BaseButton';
import { CampaignManagementService, CommonService } from 'src/api/services';
import { fDateTime } from 'src/utils/formatTime';
// ----------------------------------------------------------------------

export default function AnnouncementForm({ formType, formData, setModalStatus, setSnackbarStatus, setMessage, successCallback }) {
    const [languages, setLanguages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [openAudioRecorder, setOpenAudioRecorder] = useState(false);
    const [uploadedFile, setUploadedFile] = useState();

    const audioUploadHandler = (event) => {
        setUploading(true);
        setUploadedFile(event.target.files[0]);
        setUploading(false);
    };

    useEffect(() => {
        CommonService.getTTSLanguages({})
            .then((response) => {
                setLanguages(response.data.results);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    const AnnouncementSchema = Yup.object().shape({
        name: Yup.string().min(4, 'Too short!').max(48, 'Too long!').required('Announcement name is required'),
        description: Yup.string(),
        type: Yup.string().required('Type must be selected'),
        announcementFile: Yup.string().when('type', {
            is: '1',
            then: Yup.string().required('Audio is required'),
            otherwise: Yup.string(),
        }),
        ttsLanguageId: Yup.string().when('type', {
            is: "2",
            then: Yup.string().required('Language must be selected'),
            otherwise: Yup.string(),
        }),
        ttsText: Yup.string().when('type', {
            is: "2",
            then: Yup.string().required('Text is required when text to speech is selected'),
            otherwise: Yup.string()
        }),
        createdDate: Yup.string(),
        updatedDate: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            name: formData.name || '',
            description: formData.description || '',
            type: formData.type ? formData.type.toString() : "1",
            announcementFile: formData.announcementFile ? formData.announcementFile.toString() : "",
            ttsLanguageId: formData.ttsLanguageId || "",
            ttsText: formData.ttsText || "",
            createdDate: formData.createdDate ? fDateTime(+formData.createdDate * 1000) : "",
            updatedDate: formData.updatedDate ? fDateTime(+formData.updatedDate * 1000) : "",
        },
        validationSchema: AnnouncementSchema,
        onSubmit: (values, actions) => {
            let payload;
            if (values.type === "2") {
                payload = {
                    name: values.name,
                    description: values.description,
                    announcement_type: values.type,
                    tts_content: values.ttsText,
                    tts_language: values.ttsLanguageId,
                };
            } else {
                payload = new FormData();
                payload.append("name", values.name);
                payload.append("description", values.description);
                payload.append("announcement_type", values.type);
                if (formType !== "edit") {
                    payload.append(
                        "file",
                        values.announcementFile,
                        values.announcementFile.name || "announcement.wav"
                    );
                }
            }
            let apiService, successMessage, failMessage;
            if (formType === "add") {
                apiService = CampaignManagementService.addAnnouncement(payload);
                successMessage = "New announcement has been successfully added";
                failMessage = "Announcement could not be added";
            } else {
                apiService = CampaignManagementService.updateAnnouncement(formData.id, payload);
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
                    } else { throw "announcement operation failed"; }
                })
                .catch((err) => {
                    if (setMessage) { setMessage(failMessage); };
                    if (setSnackbarStatus) { setSnackbarStatus(true); };
                    if (setModalStatus) { setModalStatus(false); };
                })
        }
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

    const getFieldByName = (fieldName) => {
        if (fieldName === "name") {
            return <TextField
                fullWidth
                label="Announcement Name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
                disabled={formType === "view" ? true : false}
            />
        }
        if (fieldName === "description") {
            return <TextField
                fullWidth
                label="Description"
                {...getFieldProps('description')}
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
                disabled={formType === "view" ? true : false}
            />
        }
        if (fieldName === "announcementFile") {
            if (values.type === "1" && formType === "add") {
                return (
                    <>
                        <Box sx={{ alignItems: "center" }}>
                            {!openAudioRecorder ? <Field
                                name="announcementFile"
                                component={AudioFileUpload}
                                title="Upload"
                                setFieldValue={setFieldValue}
                                uploading={uploading}
                                errorMessage={errors.announcementFile ? errors.announcementFile : ""}
                                touched={touched.announcementFile}
                            /> : null}
                            {openAudioRecorder ? <Field
                                name="announcementFile"
                                component={AudioRecorder}
                                title="Record"
                                setFieldValue={setFieldValue}
                                errorMessage={errors.announcementFile ? errors.announcementFile : ""}
                                touched={touched.announcementFile}
                            /> :
                                <BaseButton
                                    label="Record"
                                    onClick={() => setOpenAudioRecorder(!openAudioRecorder)}
                                    sx={{ mt: 2, ml: 2 }}
                                    StartIcon={MicIcon}
                                />}
                        </Box>
                    </>
                )
            } else if (values.type === "2") {
                return (
                    <>
                        <FormControl fullWidth>
                            <InputLabel id="tts-language-label">Language</InputLabel>
                            <Select
                                label="Language"
                                labelId="tts-language-label"
                                color="secondary"
                                {...getFieldProps('ttsLanguageId')}
                                error={Boolean(touched.ttsLanguageId && errors.ttsLanguageId)}
                                helperText={touched.ttsLanguageId && errors.ttsLanguageId}
                                disabled={formType === "view" ? true : false}
                            >
                                {languages.map((lang, idx) => {
                                    return <MenuItem key={lang.id} value={lang.id}>{lang.name}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                fullWidth
                                label="Text"
                                {...getFieldProps('ttsText')}
                                error={Boolean(touched.ttsText && errors.ttsText)}
                                helperText={touched.ttsText && errors.ttsText}
                                disabled={formType === "view" ? true : false}
                            />
                        </FormControl>
                    </>
                )
            }
        }
        if (fieldName === "type") {
            if (formType === "edit") {
                return;
            }
            return Constants.getRadioButtonComponent(
                Constants.CampaignAnnouncementTypes,
                { ...getFieldProps('type'), disabled: formType === "view" ? true : false },
                "Announcement Type"
            )
        }
        if (fieldName === "submitButton") {
            return (formType !== "view" ?
                <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    startIcon={<SaveIcon />}
                >
                    Save
                </LoadingButton> : null
            )
        }
        if (fieldName === "createdDate" && formType === "view") {
            return <TextField
                fullWidth
                disabled
                label="Created Date"
                {...getFieldProps('createdDate')}
                error={Boolean(touched.createdDate && errors.createdDate)}
                helperText={touched.createdDate && errors.createdDate}
            />
        }
        if (fieldName === "updatedDate" && formType === "view") {
            return <TextField
                fullWidth
                disabled
                label="Updated Date"
                {...getFieldProps('updatedDate')}
                error={Boolean(touched.updatedDate && errors.updatedDate)}
                helperText={touched.updatedDate && errors.updatedDate}
            />
        }
        if (fieldName === "audioPlayer" && formType === "view" && values.type === "1") {
            return <AudioPlayer fileUUID={formData.fileUUID} />
        }
    }

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {getFieldByName("name")}
                        {getFieldByName("description")}
                        {getFieldByName("type")}
                        {getFieldByName("announcementFile")}
                        {getFieldByName("audioPlayer")}
                        {getFieldByName("ttsLanguageId")}
                        {getFieldByName("ttsText")}
                        {getFieldByName("createdDate")}
                        {getFieldByName("updatedDate")}
                    </Stack>
                    <br />
                    {getFieldByName("submitButton")}
                </Form>
            </FormikProvider >
        </>
    );
}
