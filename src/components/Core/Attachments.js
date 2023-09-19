import React, { Component, createRef } from "react";
import { Upload, message, Button, Row, Col, Popconfirm } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { addFiles, getAttachments , addAttachments, delAttachment} from "../../service/Attachment-Apis";

import "../Styles/attachments.css"
import { localStore } from "../../service/constant";
// const { Dragger } = Upload;

class Attachments extends Component {
    constructor() {
        super();
        this.UploadRef = createRef();
        this.state = {
            fileList: [],
            fileIds: [],
            loading: false,
            loginId: null
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
                    loginId: parseInt(localStore().id)
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
            this.setState({loading: true})
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
                                fileIds: [...this.state.fileIds, res.file.fileId],
                                loading: false
                            })
                        }
                    })
                }else{
                    console.log("Eroor: ", err);
                    this.setState({loading: false})
                    const error = new Error("Some error");
                    onError({ err });
                }
            })
    }

    onRemove = (file) => {
        const { loginId } = this.state
        const { onHold } = this.props
        console.log(file)
        if (file.userId === loginId && !onHold){
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
    }

    render() {
        const { fileList, loading } = this.state;
        const { listType, onHold } = this.props;
        return (
            <Row>
                <Col span="24">
                    <Upload 
                        multiple={true}
                        listType= {listType??"picture"}
                        fileList={fileList}
                        customRequest={this.handleUpload}
                        showUploadList={{
                            removeIcon: (file) => <Popconfirm
                            title="Are you sure you want to delete ?"
                            onConfirm={() => this.onRemove(file)}
                            okText="Yes"
                            cancelText="No"
                            placement="bottomRight"
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        }}
                        // className="upload-list-inline"
                        style={{ backgroundColor: "rosybrown" }}
                    >
                        <Button type="ghost" loading={loading} disabled={onHold}>
                            <UploadOutlined /> {onHold ? 'This Project Is Closed' :  'Upload New File'}
                        </Button>
                        
                    </Upload>
                </Col>
            </Row>
        );
    }
}

export default Attachments;
