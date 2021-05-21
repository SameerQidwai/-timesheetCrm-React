import React, { Component, createRef } from "react";
import { Upload, message, Button, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

import "../Styles/attachments.css"
// const { Dragger } = Upload;

class Attachments extends Component {
    constructor() {
        super();
        this.UploadRef = createRef();
        this.state = {
            fileList: [],
            defaultFiles: [
                {
                    lastModified: 1604306389553,
                    lastModifiedDate: moment("Nov 02 2020").format(
                        "ddd MMM DD YYYY"
                    ),
                    name: "favicon.ico",
                    size: 3150,
                    type: "image/vnd.microsoft.icon",
                    uid: "rc-upload-1605695781556-2",
                    webkitRelativePath: "",
                },
                {
                    lastModified: 1604306389553,
                    lastModifiedDate: moment("Nov 02 2020").format(
                        "ddd MMM DD YYYY"
                    ),
                    name: "index.html",
                    size: 1721,
                    type: "text/html",
                    uid: "rc-upload-1605695781556-4",
                    webkitRelativePath: "",
                },
                {
                    lastModified: 1604306389553,
                    lastModifiedDate: moment("Nov 02 2020").format(
                        "ddd MMM DD YYYY"
                    ),
                    name: "robots.txt",
                    size: 67,
                    type: "text/plain",
                    uid: "rc-upload-1605695781556-6",
                    webkitRelativePath: "",
                },
                {
                    lastModified: 1604306389553,
                    lastModifiedDate: moment("Nov 02 2020").format(
                        "ddd MMM DD YYYY"
                    ),
                    name: "logo512.png",
                    size: 9664,
                    type: "image/png",
                    uid: "rc-upload-1605695781556-8",
                    webkitRelativePath: "",
                    // thumbUrl: "",
                    url: "downlod.com",
                },
            ],
        };
    }
    render() {
        const { defaultFiles, fileList } = this.state;
        const props = {
            name: "file",
            multiple: true,
            listType: "picture",
            action: "https://www.mocky.io/v2/kia",
            onChange(info) {
                const { status } = info.file;
                if (status !== "uploading") {
                    console.log(info.file, info.fileList);
                }
                if (status === "done") {
                    message.success(
                        `${info.file.name} file uploaded successfully.`
                    );
                } else if (status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
            defaultFileList: defaultFiles,
            showUploadList: {
                showRemoveIcon: true,
            },
        };
        return (
            <Row>
                {/* <Col span="24" style={{ textAlign: "right" }}>
                    <UploadOutlined
                        style={{ fontSize: 24 }}
                        onClick={() => {
                            this.UploadRef.current.click();
                        }}
                    />
                </Col> */}
                <Col span="24">
                    <Upload {...props}>
                        <Button
                            type="ghost"
                            // ref={this.UploadRef}
                        >
                            <UploadOutlined /> Upload new File
                        </Button>
                    </Upload>
                </Col>
            </Row>
        );
    }
}

export default Attachments;
