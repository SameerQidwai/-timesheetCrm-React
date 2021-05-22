import React, { Component } from 'react'
import { Modal, Upload, message, Button, Row, Col } from "antd";
import { UploadOutlined, LoadingOutlined,InboxOutlined } from "@ant-design/icons";
import '../../styles/upload.css'
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
import { Api } from "../../../service/constant";
import { addFiles } from "../../../service/constant-Apis";
class AttachModal extends Component{
    constructor(){
        super()
        this.state ={
            fileList: [],
            progress: 0,
            fileIds: [],
        }
    }
    componentDidMount=()=>{
        // console.log(`object`, object)
    }
    
    handleUpload = (file) => {
        const { fileList } = this.state;
        let formData = new FormData();
        // formData.append('files', file)
        // console.log(formData);
        console.log(file);
        // fileList.forEach((file, index) => {
        // });
        addFiles(formData).then(res=>{
            if (res.success){
                console.log('after service',res.data);
            }
        })

        this.setState({
            uploading: true,
        });
    };

    render (){
        const { visible, editTime, loading, close } = this.props
        const { defaultFileList, fileList } = this.state;
        const props = {
            name: "file",
            multiple: true,
            listType: "picture",
            customRequest: (option)=>{
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
                            console.log(res);
                            onSuccess("Ok");
                            this.setState({
                                fileList: [...this.state.fileList, file],
                                fileIds: [...this.state.fileIds, ...res.data]
                            },()=>{
                                console.log(this.state.fileIds);
                            })
                        }else{
                            console.log("Eroor: ", err);
                            const error = new Error("Some error");
                            onError({ err });
                        }
                    })
            },
            fileList,
        };
        return(
            <Modal
                title={editTime ? "Edit Attachments & Notes" : "Add Attachments & Notes"}
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={540}
                // footer={}
            >
                <Row gutter={[0, 30]}>
                    <Col span={24}>
                        <div>
                            <Dragger {...props}
                                className="upload-list-inline"
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
                            // allowClear
                            // onChange={this.comChange}
                            // onKeyDown={this.handelEmpty}
                            // value={value}
                        />
                    </Col>
                </Row>
            </Modal>    
        )
    }
}

export default AttachModal