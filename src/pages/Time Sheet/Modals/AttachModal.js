import React, { Component } from 'react'
import { Modal, Upload, message, Button, Row, Col } from "antd";
import { UploadOutlined, LoadingOutlined,InboxOutlined } from "@ant-design/icons";
import '../../styles/upload.css'
import TextArea from 'antd/lib/input/TextArea';
import Dragger from 'antd/lib/upload/Dragger';
class AttachModal extends Component{
    constructor(){
        super()
        this.state ={
            fileList: []
        }
    }
    componentDidMount=()=>{
        // console.log(`object`, object)
    }
    
    handleUpload = () => {
        const { fileList } = this.state;
        let formData = new FormData();
        fileList.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

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
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                console.log(file);
                this.setState(
                    (state) => ({
                        fileList: [...state.fileList, file],
                    }),
                    () => {
                        console.log(`fileList 41`, this.state.fileList)
                    }
                );
                return false;
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