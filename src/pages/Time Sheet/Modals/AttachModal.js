import React, { Component } from 'react'
import { Modal, Upload, message, Button, Row, Col } from "antd";
import { UploadOutlined, LoadingOutlined,InboxOutlined } from "@ant-design/icons";
import '../../styles/upload.css'
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
import { Api, localStore } from "../../../service/constant";
import { addFiles, getAttachments } from "../../../service/Attachment-Apis";
import { addProjectNote } from "../../../service/timesheet";
class AttachModal extends Component{
    constructor(){
        super()
        this.state ={
            fileList: [],
            progress: 0,
            fileIds: [],
            notes: undefined
        }
    }
    
    componentDidMount=()=>{
        console.log(`object`, this.props)
        const { projectEntryId } = this.props.timeObj
        this.getRecord('PEN', projectEntryId)
    }

    getRecord = (targetType, targetId) =>{
        const { notes } = this.props.timeObj
        getAttachments(targetType, targetId).then(res=>{
            if(res.success){
                this.setState({
                    fileList: res.fileList,
                    fileIds: res.fileIds,
                    notes: notes
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
                    this.setState({
                        fileList: [...this.state.fileList, res.file],
                        fileIds: [...this.state.fileIds, res.file.fileId]
                    })
                }else{
                    console.log("Eroor: ", err);
                    const error = new Error("Some error");
                    onError({ err });
                }
            })
    }

    onRemove = (file) => {
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

    addNotes = () =>{
        const { timeObj, close } = this.props
        const { notes, fileIds } = this.state
        const obj = {
            note: notes,
            attachments: fileIds
        }
        addProjectNote(timeObj.projectEntryId, obj).then(res=>{
            if(res.success){
                close()
            }
        })
    }

    render (){
        const { visible, editTime, loading, close, timeObj } = this.props
        const {  fileList, notes } = this.state;
        const disabled = (timeObj.status === 'SB' || timeObj.status === 'AP') 
        return(
            <Modal
                title={editTime ? "Edit Attachments & Notes" : "Add Attachments & Notes"}
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => { this.addNotes() }}
                okButtonProps={{ disabled: loading, disabled: disabled  }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={540}
                // footer={}
            >
                <Row gutter={[0, 30]}>
                    <Col span={24}>
                        <div>
                            <Dragger 
                                name= "file"
                                multiple={false}
                                maxCount={1}
                                listType= "picture"
                                className="upload-list-inline"
                                disabled={disabled}
                                customRequest={this.handleUpload}
                                onRemove= {this.onRemove}
                                fileList={fileList}
                            >
                                {fileList.length < 1 &&<>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                </>}
                            </Dragger>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TextArea
                            placeholder="Enter Your Notes...."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            allowClear
                            onChange={(e)=>{
                                this.setState({
                                    notes: e.target.value
                                })
                            }}
                            value={notes}
                        />
                    </Col>
                </Row>
            </Modal>    
        )
    }
}

export default AttachModal