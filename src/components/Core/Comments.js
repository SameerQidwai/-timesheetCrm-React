import React, { Component } from 'react'

import { Row, Col, Comment, Tooltip, Avatar, Popconfirm, Form, Input } from 'antd'

import moment from 'moment';

import { DeleteOutlined, DeleteFilled, SendOutlined } from '@ant-design/icons';

import './comment.css'

const { TextArea } = Input
// const { Panel } = Collapse;
class Comments extends Component{
  constructor (){
    super ()
    this.com_field = React.createRef();
    this.state= {
      isHovered:{},
      data:[
        {
          author: 'Han Solo',
          content: `I am Han Solo`,
          date: '2020-1-1',
          reply:[
            {
              author: 'Musab tarq',
              content: `Musab Said Bad things about Han`,
              date: '2020-1-10'
            },
            {
              author: 'Ovais raza',
              content: `Ovais support Musab`,
              date: '2020-1-19',
            },
            {
              author: 'Rabi cube',
              content: `Rabi is solving Colorfull Cube`,
              date: '2020-1-5',
            },
          ],
        },
        {
          author: 'Musab tarq',
          content: `I am Musab`,
          date: '2020-2-10',
          reply:[
            {
              author: 'Ovais raza',
              content: `Ovais said bad things about Musab`,
              date: '2020-2-19',
            },
            {
              author: 'Han Solo',
              content: `Han Solo Laughed`,
              date: '2020-3-1',
            },
            {
              author: 'Rabi cube',
              content: `Rabi is solving Colorfull Cube`,
              date: '2020-3-25',
            },
          ]
        },
        {
          author: 'Ovais raza',
          content: `I Had a great date today`,
          date: '2020-3-19',
        },
        {
          author: 'Shabaz ',
          content: `Hain??`,
          date: '2020-4-25',
        },
        {
          author: 'Rabi cube',
          content: `Solving Rubik's Cube`,
          date: '2020-5-5',
        },
        {
          author: 'Me Me',
          content: `Doing Work`,
          date: '2020-9-20',
          reply: [
            {
              author: 'Rabi cube',
              content: `Rabi is solving Colorfull Cube`,
              date: '2020-9-25',
            },
          ]
        }
      ],
      value: null
    }
  }
  deleteIcon = (index,filled) =>{
    this.setState(prevState => {
      return { isHovered: { ...prevState.isHovered, [index]: filled } };
    });
  }
  deleteComment = ()=>{
    console.log('deleted')
  }

  comChange = (e) =>{
    this.setState({
      value: e.target.value
    })
  }

  addComent = (e) =>{
    const { value, data } = this.state
    if (!e.shiftKey && value){
      let comment = {
          author: 'You',
          content: value,
          date: moment().format(),
      }
      this.setState({
        data: [...data, comment],
      },()=>{
        this.setState({
          value:null
        })
      })
    }
  }

  render () { 
    const { data, isHovered, value } = this.state
    return (
      <Row justify="space-around">
        <Col style={styles.cSec} span={24}>
        {
          data.map((item,index) => (
            <Comment
              key={index}
            author={<a>{item.author}</a>}
              avatar={
                <Avatar
                  alt={item.author}
                >
                  {item.author[0].toUpperCase()}
                </Avatar>
              }
              content={
                <p>{item.content}</p>
              }
              datetime={
                <>
                  <Tooltip title={moment(item.date).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>
                      {moment(item.date).fromNow()}
                    </span>
                  </Tooltip>
                  <Tooltip key="comment-basic-delete" title="Delete">
                    <span
                      style={styles.delIcon}
                      onMouseOver={()=>{this.deleteIcon(index,true)}}
                      onMouseLeave={()=>{this.deleteIcon(index,false)}}
                    >
                      <Popconfirm  title="You Want to delete comment?" onConfirm={this.deleteComment} okText="Yes" cancelText="No">
                        {isHovered[index]? <DeleteFilled style={{fontSize:'18px'}} /> : <DeleteOutlined/>}
                      </Popconfirm>
                    </span>
                  </Tooltip>
                </>
              }
            >
            </Comment>
            ))
          }
          </Col>
        <Col span={23} style={styles.cBox}>
            <Form.Item 
              colon={false}
              label={ <Avatar alt='A' > A </Avatar>}
            >
              <TextArea 
                placeholder="Enter Your Comment...." 
                autoSize={ {minRows: 1, maxRows: 5} }
                // allowClear
                onPressEnter={this.addComent}
                onChange={this.comChange}
                value={value}
              />
            </Form.Item>
          </Col>
          <Col span="1" style={styles.sendBox}>
            <Form.Item>
              <SendOutlined onClick={this.addComent} className="sendIcon" style={styles.sendIcon} /> 
            </Form.Item>
          </Col>
        {/* <Col span={1}> <SendOutlined/> </Col> */}
      </Row>
    );
  }
}
export default Comments

const styles = {
  cSec:{
    maxHeight:500,
    overflowY:'auto'
  },
  delIcon:{
    paddingLeft: "10px",
    cursor: "pointer",
  },
  cBox: {
    paddingLeft: "40px"
  },
  sendBox: {
    alignSelf: "flex-end"
  },
  sendIcon: {
    fontSize: "24px",
    paddingLeft: "10px",
  }
}