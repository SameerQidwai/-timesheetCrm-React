import React, { Component } from 'react'
import { Upload, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import '../Styles/upload.css'
import { addFiles, getAttachments } from "../../service/Attachment-Apis";

class Attach extends Component{
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
        const { targetId,  targetType} = this.props
        if (targetId){
            this.getRecord(targetId,  targetType)
        }
    }

    getRecord = (targetType, targetId) =>{
        // getAttachments(targetType, targetId).then(res=>{
        //     if(res.success){
        //         this.setState({
        //             fileList: res.fileList,
        //             fileIds: res.fileIds,
        //         })
        //     }
        // })
        const {fileIds, fileList} = this.props
        console.log(fileIds, fileList)
        this.setState({ fileIds, fileList })
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

    getFileIds = () =>{
        this.setState({loading: true})
        const { fileIds, fileList } = this.state
        const attachments =fileList.length>0 ? fileIds: []
        return attachments
    }

    render (){
        const {  fileList } = this.state;
        const {  listType, maxCount, label } = this.props;
        return(
            <Row gutter={[0, 30]}>
                <Col span={24}>
                <p style={{marginTop: 10, marginBottom: 2}}>{label}</p>
                    <Upload
                        listType={listType}
                        maxCount={maxCount}
                        // multiple={false}
                        // className="upload-list-inline"
                        fileList={fileList}
                        customRequest={this.handleUpload}
                        onRemove= {this.onRemove}
                    >
                        {fileList.length < maxCount ||  !maxCount &&
                            <div style={{marginTop: 10}} >
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        }
                    </Upload>
                </Col>
            </Row>
        )
    }
}

export default Attach