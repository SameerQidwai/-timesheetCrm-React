import React, { Component, createRef } from "react";
import { Upload, message, Button, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { addFiles, getAttachments , addAttachments, delAttachment} from "../../service/Attachment-Apis";

import "../Styles/attachments.css"
// const { Dragger } = Upload;

class Attachments extends Component {
    constructor() {
        super();
        this.UploadRef = createRef();
        this.state = {
            fileList: [],
            fileIds: [],
        };
    }

    componentDidMount=()=>{
        const { targetType, targetId } = this.props
        this.getRecord(targetType, targetId)
    }

    getRecord = (targetType, targetId) =>{
        getAttachments(targetType, targetId).then(res=>{
            if(res.success){
                this.setState({
                    fileList: res.fileList,
                    fileIds: res.fileIds,
                })
            }
        })
    }
    
    handleUpload = async option=>{
        const { onSuccess, onError, file, onProgress } = option;
        const formData = new FormData();
        const  config = {
            headers: {"content-type": "multipart/form-data"},
            onUploadProgress: event =>{
                const percent = Math.floor((event.loaded / event.total) * 100);
                this.setState({progress: percent});
                if (percent === 100) {
                  setTimeout(() => this.setState({progres: 0}), 1000);
                }
                onProgress({ percent: (event.loaded / event.total) * 100 });
              }
            }
            formData.append('files', file)
            addFiles(formData, config).then((res,err)=>{
                if (res.success){
                    onSuccess("Ok");
                    const { targetType, targetId } = this.props
                    const data = {
                        files: [res.file.fileId]
                    }

                    addAttachments(targetType, targetId, data).then(attach=>{
                        if (attach.success){
                            this.setState({
                                fileList: [...this.state.fileList, attach.data],
                                fileIds: [...this.state.fileIds, res.file.fileId]
                            })
                        }
                    })
                }else{
                    console.log("Eroor: ", err);
                    const error = new Error("Some error");
                    onError({ err });
                }
            })
    }

    onRemove = (file) => {
        delAttachment(file.id).then(res=>{
            if(res.success){
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    const fileIds = state.fileIds
                    newFileList.splice(index, 1);
                    fileIds.splice(index, 1);
                    return {
                        fileIds,
                        fileList: newFileList,
                    };
                });
            }
        })
    }

    render() {
        const { fileList } = this.state;
        return (
            <Row>
                <Col span="24">
                    <Upload 
                        multiple={true}
                        showUploadList= {{showRemoveIcon: true }}
                        listType= "picture"
                        fileList={fileList}
                        customRequest={this.handleUpload}
                        onRemove= {this.onRemove}
                        // className="upload-list-inline"
                        style={{ backgroundColor: "rosybrown" }}
                    >
                        <Button type="ghost" >
                            <UploadOutlined /> Upload new File
                        </Button>
                    </Upload>
                </Col>
            </Row>
        );
    }
}

export default Attachments;
