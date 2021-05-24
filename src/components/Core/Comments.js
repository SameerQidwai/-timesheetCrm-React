import React, { Component } from "react";

import { Row, Col, Comment, Tooltip, Avatar, Popconfirm, Form, Input, List, Upload, } from "antd";

import moment from "moment";

import { DeleteOutlined, DeleteFilled, SendOutlined, PaperClipOutlined, } from "@ant-design/icons";

import { getComments, addComment, addFiles } from "../../service/constant-Apis";

import "../Styles/comment.css";

const { TextArea } = Input;
// const { Panel } = Collapse;
class Comments extends Component {
    constructor() {
        super();
        this.messagesEnd = React.createRef();
        this.UploadRef = React.createRef();
        this.state = {
            isHovered: {},
            fileList: [],
            fileIds: [],
            data: [ ],
            value: null,
        };
    }
    componentDidMount() {
        this.scrollToBottom(); //scroll to bottom
        const { target, targetId } = this.props
        this.getComments(target, targetId)
    }

    getComments = (target, targetId) =>{
        getComments(target, targetId).then(res=>{
            if(res.success){
                console.log(res);
                this.setState({
                    data: res.data?? []
                })
            }
        })
    }

    scrollToBottom = () => {
        this.messagesEnd.current.scrollIntoView({ behavior: "smooth" }); // where to scroll
    };

    deleteIcon = (index, filled) => {
        // don hover change Icons style or change Icon
        this.setState((prevState) => {
            return { isHovered: { ...prevState.isHovered, [index]: filled } };
        });
    };
    
    handleDelete = (key) => {
        console.log(key);
        this.setState({
            data: this.state.data.filter((item) => item.key !== key),
        });
    };

    handelEmpty = (e) => {
        //will not allow to press enter if value is empty
        const { value } = this.state;
        if (e.keyCode === 13 && !value) {
            e.preventDefault();
        }
    };

    comChange = (e) => {
        // set value of a text field
        this.setState({
            value: e.target.value, // give value to the text field
        });
    };

    addComent = (e) => {
        // add new Comment
        const { value, data, fileList, fileIds } = this.state; // textbar code and comment data
        if (!e.shiftKey && (value || fileList.length > 0)) {
            // if shift key is pressed and has value insert new Comment on press Enter
            let comment = {
                // comment
                key: 1,
                author: "Han Solo",
                content: value,
                files: fileList,
                attachments: fileIds
                // date: moment().format(),
            };
            const { target, targetId } = this.props
            addComment(target, targetId, comment).then(res=>{
                console.log(res);
                if (res.success){
                    this.setState({
                        data: [...data, comment], // add comment to comment data
                        value: null, // set TextArea empty
                        fileList: [],
                        fileIds: [],
                    },() => {
                        setTimeout(() => {
                            this.scrollToBottom(); // after comment pushed scroll to bottom
                            this.setState({
                                value: null, // first setValue null can't remove send press Enter
                            });
                        }, 0);
                    });
                }
            })
        }
    };

    logScroll = (e) => {
        const { scrollHeight, scrollTop, clientHeight } = e.target
        if (!scrollTop) {
            //check the value of scroll if it is not 0 don't run
            e.persist(scrollTop); // allow change of event and use it after
            setTimeout(() => {
                // wait one Second befroe call the function
                const { data } = this.state;
                if (!scrollTop && data.length < 500) {
                    // check if the scroll value is still Zero
                    console.log("done");
                    this.setState({
                        data: [...data, ...data], //data inserted
                    });
                } else {
                    console.log("Empty");
                }
            }, 1000);
        } else if ( scrollHeight - scrollTop === clientHeight ) {
            //check if Scroll is on bottom
            e.persist(e.target);
            setTimeout(() => {
                // wait One second before call the function
                if ( scrollHeight - scrollTop === clientHeight ) {
                    console.log("I will get rendered now");
                }
            }, 1000);
        }
    };

    actions = (list) => {
        const array = [];
        return list.map((el) => 
            <span>
                <PaperClipOutlined />{" "}
                <a href={el.uid} download={el.name}>
                    {el.name}
                </a>
            </span>
        );
    };

    commentRender = (item, index, isHovered) => {
        const actions = item.files && this.actions(item.files); //Function can not be pass to array Prop
        return (
            <Comment
                key={index}
                author={<a>{item.author?? '??????'}</a>}
                avatar={
                    <Avatar
                        style={{
                            backgroundColor:
                                colors[
                                    index.toString()[
                                        index.toString().length - 1
                                    ]
                                ],
                        }}
                        alt={item.author ?? '??????'}
                    >
                        {item.author? item.author[0].toUpperCase() : '?'}
                    </Avatar>
                }
                actions={actions} //action
                content={<p>{item.content}</p>}
                datetime={
                    <>
                        <Tooltip
                            title={moment(item.createdAt).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )}
                        >
                            <span>{moment(item.createdAt).fromNow()}</span>
                        </Tooltip>
                        <Tooltip key="comment-basic-delete" title="Delete">
                            <span
                                style={styles.delCol}
                                onMouseOver={() => {
                                    this.deleteIcon(index, true);
                                }}
                                onMouseLeave={() => {
                                    this.deleteIcon(index, false);
                                }}
                            >
                                <Popconfirm
                                    title="You Want to delete comment?"
                                    onConfirm={() => {
                                        this.handleDelete(item.key);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    {isHovered[index] ? (
                                        <DeleteFilled style={styles.delIcon} />
                                    ) : (
                                        <DeleteOutlined />
                                    )}
                                </Popconfirm>
                            </span>
                        </Tooltip>
                    </>
                }
            ></Comment>
        );
    };

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
            // addFiles(formData, config).then((res,err)=>{
            //     if (res.success){
            //         onSuccess("Ok");
                    this.setState({
                        fileList: [...this.state.fileList, file],
                        // fileIds: [...this.state.fileIds, ...res.data]
                    })
                // }else{
                //     console.log("Eroor: ", err);
                //     const error = new Error("Some error");
                //     onError({ err });
                // }
            // })
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

    render() {
        const { data, isHovered, value, fileList } = this.state;
        return (
            <Row justify="space-around">
                <Col style={styles.cSec} span={24} onScroll={this.logScroll}>
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item, index) => (
                            <li>
                                {this.commentRender(item, index, isHovered)}
                            </li>
                        )}
                    />
                    {/* to scroll till down when new text is done */}
                    <div ref={this.messagesEnd} />
                </Col>
                <Col span={23} style={styles.cBox}>
                    <Form.Item
                        colon={false}
                        // label={ <Avatar alt='A' style={styles.sendAvatar}> A </Avatar>}
                        label={
                            <PaperClipOutlined
                                style={
                                    isHovered["attachIcon"]
                                        ? styles.attachIconHoverd
                                        : styles.sendIcon
                                }
                                onMouseOver={() => {
                                    this.deleteIcon("attachIcon", true);
                                }}
                                onMouseOut={() => {
                                    this.deleteIcon("attachIcon", false);
                                }}
                                onClick={() => {
                                    this.UploadRef.current.click();
                                }}
                            />
                        }
                    >
                        <TextArea
                            placeholder="Enter Your Comment...."
                            autoSize={{ minRows: 1, maxRows: 5 }}
                            // allowClear
                            onPressEnter={this.addComent}
                            onChange={this.comChange}
                            onKeyDown={this.handelEmpty}
                            value={value}
                        />
                        <Upload
                            listType= "text"
                            multiple={true}
                            customRequest={this.handleUpload}
                            onRemove= {this.onRemove}
                            fileList={fileList}
                            style={{ backgroundColor: "rosybrown" }}
                            className="upload-list-inline"
                        >
                            <PaperClipOutlined
                                ref={this.UploadRef}
                                style={{ fontSize: 0 }}
                            />
                        </Upload>
                    </Form.Item>
                </Col>
                {/* alignSelf: "flex-end", marginBottom:20 * fileList.length */}
                <Col
                    span={1}
                    style={{
                        alignSelf: "flex-end",
                        marginBottom: (30 * fileList.length) / 4 + 1,
                    }}
                >
                    <Form.Item>
                        <SendOutlined
                            onClick={this.addComent}
                            className="sendIcon"
                            style={ isHovered["sendIcon"] ? styles.sendIconHoverd : styles.sendIcon }
                            onMouseOver={() => { this.deleteIcon("sendIcon", true); }}
                            onMouseOut={() => { this.deleteIcon("sendIcon", false); }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        );
    }
}
export default Comments;
const colors = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#0000ff",
    "#b8860b",
    "#907849",
    "#80afe2",
    "#FAAB14",
    "#b17401",
    "#42a3f3",
    "#ce8785",
];

const styles = {
    cSec: {
        maxHeight: 500,
        overflowY: "auto",
        minHeight: 500
    },
    delCol: {
        paddingLeft: "10px",
        cursor: "pointer",
        textAlignLast: "right",
    },
    cBox: {
        paddingLeft: "40px",
    },
    sendBox: {
        alignSelf: "flex-end",
        maxHeight: "100px",
        backgroundColor: "yellow",
    },

    sendIcon: {
        fontSize: "24px",
        paddingLeft: "10px",
    },

    sendIconHoverd: {
        fontSize: "24px",
        paddingLeft: "10px",
        color: "blue",
    },

    attachIconHoverd: {
        fontSize: "24px",
        paddingLeft: "10px",
        color: "#40a9ff",
    },

    delIcon: {
        fontSize: "18px",
    },
    sendAvatar: {
        backgroundColor:
            "#" + Math.floor(Math.random() * 0x1000000).toString(16),
    },
};
