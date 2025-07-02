import React, { FC, useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Spinner, Row, Col, Image, Alert } from "react-bootstrap";
import { apiCall } from "../utils/api";

interface MediaUploaderProps {
    label: string;
    name: string;
    required?: boolean;
    size?: "sm" | "lg";
    errorMsg?: string;
    onUploadComplete: (name:string, mediaIds: string | string[] | null) => void;
    value?: any; // optional initial value
    multiple?: boolean; // controls file input (UI-level)
    allowMultiple?: boolean; // controls logic (business rule)
}

interface UploadedMedia {
    id: string;
    url: string;
    contentType: string;
}

const MediaUploader: FC<MediaUploaderProps> = ({
    label,
    name,
    required = false,
    size,
    multiple = false,
    errorMsg,
    value,
    allowMultiple=false,
    onUploadComplete
}) => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
    const API_URL =  import.meta.env.VITE_STOCK_URL

    const isImage = (type?: string) => {
        return !!type && type.startsWith("image/");
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
        setUploadError(null);
    };
    

    const handleDelete = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>, idToRemove: string) => {
        e.preventDefault()
        const updated: UploadedMedia[] = []
        uploadedMedia.map((m) =>{ 
            if (m.id !== idToRemove)  {
                console.log(m);
                
                updated.push({
                    id: m.id,
                    url: m.url,
                    contentType: m.contentType
                })
            }
        });
        setUploadedMedia(updated);
        onUploadComplete(name,  allowMultiple ? updated.map((m) => m.id) : null); // notify parent
    };

    const handleUpload = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        e.preventDefault()
        if (!selectedFiles || selectedFiles.length === 0) return;

        setUploading(true);
        setUploadError(null);

        const uploaded: UploadedMedia[] = [];

        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const formData = new FormData();
                formData.append("file", file);

                const data = await apiCall<any>("/media_uploader/upload", 'POST', formData,{}, false, true);
                

                if (!data) throw new Error(`Failed upload: ${file.name}`);


                uploaded.push({
                id: data.id,
                url: data.file,
                contentType: data.file_type,
                });
            }
            const mediaFiles = uploadedMedia.concat(uploaded);
            // ❗️Enforce single file if allowMultiple is false
            const finalFiles = allowMultiple ? mediaFiles : [mediaFiles[mediaFiles.length - 1]];

            setUploadedMedia(finalFiles);
            onUploadComplete(name, allowMultiple ? finalFiles.map((m) => m.id) : finalFiles[0].id);
        } catch (err: any) {
        setUploadError(err.message || "Upload failed.");
        } finally {
        setUploading(false);
        }
    };
     
    useEffect(()=>{
        if (value && uploadedMedia.length == 0){
            console.log("value", value);
            let corrected_value : UploadedMedia[]
            if (allowMultiple){
                corrected_value = value.map((value:any) => ({
                    id: value.id,
                    url: value.file,
                    contentType: value.file_type || "image/jpeg", // fallback just in case
                }));
            } else {
                value.id ?
                    corrected_value = [{
                        id: value.id,
                        url: value.file,
                        contentType: value.file_type || "image/jpeg", // fallback just in case
                    }]
                :
                    corrected_value = []
            }
            console.log("corrected_value", corrected_value);
                        
            setUploadedMedia(corrected_value)
        }
        
    }, [value])

    return (
        <Form.Group key={name} controlId={name} className={`mb-${size || 3} api-form-element`}>
            {uploadedMedia.length > 0 && (
                <Row className="g-2 mt-2" key={1}>
                {uploadedMedia.map((media) => (
                    <Col xs={6} md={4} lg={3} key={media.id}>
                        <div className="position-relative">
                        {isImage(media.contentType) ? (
                            <Image
                                src={`${API_URL}${media.url}`}
                                thumbnail
                                key={media.id}
                                alt="uploaded preview"
                                style={{ maxHeight: 150, objectFit: "cover", width: "100%" }}
                            />
                        ) : (
                            <Alert variant="info">Uploaded file ID: {media.id}</Alert>
                        )}

                        {/* ❌ Delete icon */}
                        <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1 rounded-circle"
                            onClick={(e) => handleDelete(e, media.id)}
                            title="Remove image"
                            style={{ lineHeight: "1", padding: "0.3rem 0.6rem" }}
                        >
                            &times;
                        </Button>
                        </div>
                    </Col>
                ))}
                </Row>
            )}
            <FloatingLabel controlId={name} label={label} className="mb-3">
                <Form.Control
                type="file"
                name={name}
                multiple={multiple}
                size={size}
                onChange={handleFileChange}
                required={required}
                accept="image/*"
                disabled={(!allowMultiple && uploadedMedia.length > 0)}
                />
                <Form.Control.Feedback type="invalid">{errorMsg}</Form.Control.Feedback>
            </FloatingLabel>
            <Button
                variant="primary"
                onClick={(e)=>handleUpload(e)}
                disabled={!selectedFiles || uploading || (!allowMultiple && uploadedMedia.length > 0)}
                className="mb-3"
            >
                {uploading ? (
                <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Uploading...
                </>
                ) : (
                "Upload"
                )}
            </Button>
            {uploadError && <Alert variant="danger">{uploadError}</Alert>}
        </Form.Group>
    );
};

export default MediaUploader;
