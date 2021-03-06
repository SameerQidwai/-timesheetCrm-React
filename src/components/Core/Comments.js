import React, { Component } from "react";

import { Row, Col, Comment, Tooltip, Avatar, Popconfirm, Form, Input, List, Upload, } from "antd";

import moment from "moment";

import { DeleteOutlined, DeleteFilled, SendOutlined, PaperClipOutlined, } from "@ant-design/icons";

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
            data: [
                // coments
                // {
                //     key: 0,
                //     author: "Han Solo",
                //     content: `I am Han Solo`,
                //     date: "2020-1-1",
                // },
                // {
                //     key: 1,
                //     author: "Musab tarq",
                //     content: `I am Musab Tariq`,
                //     date: "2020-2-10",
                // },
                // {
                //     key: 2,
                //     author: "Ovais raza",
                //     content: `I am Ovais Raza`,
                //     date: "2020-3-19",
                // },
                // {
                //     key: 3,
                //     author: "Shabaz ",
                //     content: `Shahbz here`,
                //     date: "2020-4-25",
                // },
                // {
                //     key: 4,
                //     author: "Rabi cube",
                //     content: `I am Rabi`,
                //     date: "2020-5-5",
                // },
                // {
                //     key: 5,
                //     author: "Me Me",
                //     content: `Project Looks Good so far`,
                //     date: "2020-9-20",
                // },
                // {
                //     key: 5,
                //     author: "You",
                //     content: `Prevented`,
                //     date: "2020-9-20",
                // },
            ],
            value: null,
        };
    }
    componentDidMount() {
        this.scrollToBottom(); //scroll to bottom
        console.log(this.props);
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
        const { value, data, fileList } = this.state; // textbar code and comment data

        if (!e.shiftKey && (value || fileList.length > 0)) {
            // if shift key is pressed and has value insert new Comment on press Enter
            let comment = {
                // comment
                key: data[data.length - 1].key,
                author: "Han Solo",
                content: value,
                files: fileList,
                date: moment().format(),
            };

            this.setState(
                {
                    data: [...data, comment], // add comment to comment data
                    value: null, // set TextArea empty
                    fileList: [],
                },
                () => {
                    setTimeout(() => {
                        this.scrollToBottom(); // after comment pushed scroll to bottom
                        this.setState({
                            value: null, // first setValue null can't remove send press Enter
                        });
                    }, 0);
                }
            );
        }
    };

    logScroll = (e) => {
        if (!e.target.scrollTop) {
            //check the value of scroll if it is not 0 don't run
            e.persist(e.target.scrollTop); // allow change of event and use it after
            setTimeout(() => {
                // wait one Second befroe call the function
                const { data } = this.state;
                if (!e.target.scrollTop && data.length < 500) {
                    // check if the scroll value is still Zero
                    console.log("done");
                    this.setState({
                        data: [...data, ...data], //data inserted
                    });
                } else {
                    console.log("Empty");
                }
            }, 1000);
        } else if (
            e.target.scrollHeight - e.target.scrollTop ===
            e.target.clientHeight
        ) {
            //check if Scroll is on bottom
            e.persist(e.target);
            setTimeout(() => {
                // wait One second before call the function
                if (
                    e.target.scrollHeight - e.target.scrollTop ===
                    e.target.clientHeight
                ) {
                    console.log("I will get rendered now");
                }
            }, 1000);
        }
    };

    actions = (list) => {
        const array = [];
        list.forEach((el) => {
            array.push(
                <span>
                    <PaperClipOutlined />{" "}
                    <a href={el.uid} download={el.name}>
                        {el.name}
                    </a>
                </span>
            );
        });
        return array;
    };

    commentRender = (item, index, isHovered) => {
        const actions = item.files && this.actions(item.files); //Function can not be pass to array Prop
        return (
            <Comment
                key={index}
                author={<a>{item.author}</a>}
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
                        alt={item.author}
                    >
                        {item.author[0].toUpperCase()}
                    </Avatar>
                }
                actions={actions} //action
                content={<p>{item.content}</p>}
                datetime={
                    <>
                        <Tooltip
                            title={moment(item.date).format(
                                "YYYY-MM-DD HH:mm:ss"
                            )}
                        >
                            <span>{moment(item.date).fromNow()}</span>
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

    handleUpload = () => {
        const { fileList } = this.state;
        let formData = new FormData();
        fileList.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        // reqwest({
        //   url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        //   method: 'post',
        //   processData: false,
        //   data: formData,
        //   success: () => {
        //     this.setState({
        //       fileList: [],
        //       uploading: false,
        //     });
        //     message.success('upload successfully.');
        //   },
        //   error: () => {
        //     this.setState({
        //       uploading: false,
        //     });
        //     message.error('upload failed.');
        //   },
        // });
    };

    render() {
        const { data, isHovered, value, fileList } = this.state;
        const props = {
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
            listType: "text",
            beforeUpload: (file) => {
                console.log(file);
                this.setState(
                    (state) => ({
                        fileList: [...state.fileList, file],
                    }),
                    () => {}
                );
                return false;
            },
            fileList,
            multiple: true,
        };

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
                        {/* <Row>
                <Col> */}
                        <Upload
                            {...props}
                            style={{ backgroundColor: "rosybrown" }}
                            className="upload-list-inline"
                        >
                            <PaperClipOutlined
                                ref={this.UploadRef}
                                style={{ fontSize: 0 }}
                            />
                        </Upload>
                        {/* </Col>
              </Row> */}
                    </Form.Item>
                </Col>
                {/* alignSelf: "flex-end", marginBottom:20 * fileList.length */}
                <Col
                    span="1"
                    style={{
                        alignSelf: "flex-end",
                        marginBottom: (30 * fileList.length) / 4 + 1,
                    }}
                >
                    <Form.Item>
                        <SendOutlined
                            onClick={this.addComent}
                            className="sendIcon"
                            style={
                                isHovered["sendIcon"]
                                    ? styles.sendIconHoverd
                                    : styles.sendIcon
                            }
                            onMouseOver={() => {
                                this.deleteIcon("sendIcon", true);
                            }}
                            onMouseOut={() => {
                                this.deleteIcon("sendIcon", false);
                            }}
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
