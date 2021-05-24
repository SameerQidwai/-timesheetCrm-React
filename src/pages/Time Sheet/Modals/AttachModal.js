import React, { Component } from 'react'
import { Modal, Upload, message, Button, Row, Col } from "antd";
import { UploadOutlined, LoadingOutlined,InboxOutlined } from "@ant-design/icons";
import '../../styles/upload.css'
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
import { Api } from "../../../service/constant";
import { addFiles } from "../../../service/constant-Apis";
import { addProjectNote } from "../../../service/timesheet";
class AttachModal extends Component{
    constructor(){
        super()
        this.state ={
            fileList: [],
            progress: 0,
            fileIds: [],
            note: undefined
        }
    }
    componentDidMount=()=>{
        console.log(`object`, this.props)
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
                        fileList: [...this.state.fileList, file],
                        fileIds: [...this.state.fileIds, ...res.data]
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
        const { note, fileIds } = this.state
        const obj = {
            note,
            attachment: fileIds
        }
        addProjectNote(timeObj.projectEntryId, obj).then(res=>{
            if(res.success){
                close()
            }
        })
    }

    render (){
        const { visible, editTime, loading, close } = this.props
        const {  fileList, note } = this.state;
        return(
            <Modal
                title={editTime ? "Edit Attachments & Notes" : "Add Attachments & Notes"}
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => { this.addNotes() }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={540}
                // footer={}
            >
                <Row gutter={[0, 30]}>
                    <Col span={24}>
                        <div>
                            <Dragger 
                                className="upload-list-inline"
                                name= "file"
                                multiple={true}
                                listType= "picture"
                                customRequest={this.handleUpload}
                                onRemove= {this.onRemove}
                                fileList={fileList}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
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
                                    note: e.target.value
                                })
                            }}
                            value={note}
                        />
                    </Col>
                </Row>
            </Modal>    
        )
    }
}

export default AttachModal