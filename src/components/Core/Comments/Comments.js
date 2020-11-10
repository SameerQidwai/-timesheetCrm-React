import React, { Component } from 'react'

import { Row, Col, Comment, Tooltip, Avatar, Popconfirm, Form, Input, List } from 'antd'

import moment from 'moment';

import { DeleteOutlined, DeleteFilled, SendOutlined } from '@ant-design/icons';

import './comment.css'

const { TextArea } = Input
// const { Panel } = Collapse;
class Comments extends Component{
  constructor (){
    super ()
    this.messagesEnd = React.createRef();

    this.state= {
      isHovered:{},
      data:[ // coments
        {
          key:0,
          author: 'Han Solo', 
          content: `I am Han Solo`,
          date: '2020-1-1',
        },
        {
          key:1,
          author: 'Musab tarq',
          content: `Musab said he will steal Erick's chicken`,
          date: '2020-2-10',
        },
        {
          key:2,
          author: 'Ovais raza',
          content: `I had a great date today with a hot chick`,
          date: '2020-3-19',
        },
        {
          key:3,
          author: 'Shabaz ',
          content: `Hain??`,
          date: '2020-4-25',
        },
        {
          key:4,
          author: 'Rabi cube',
          content: `Solving Rubik's Cube`,
          date: '2020-5-5',
        },
        {
          key:5,
          author: 'Me Me',
          content: `Doing Work`,
          date: '2020-9-20',
        }
      ],
      value: null
    }
  }
  componentDidMount () {
    this.scrollToBottom()  //scroll to bottom
  }

  scrollToBottom = () => {
    this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' }) // where to scroll
  }

  deleteIcon = (index,filled) =>{ // don hover change Icons style or change Icon
    this.setState(prevState => {
      return { isHovered: { ...prevState.isHovered, [index]: filled } };
    });
  }
  handleDelete =  (key)=>{
    this.setState({ data: this.state.data.filter(item => item.key !== key) });
}

  comChange = (e) =>{ // set value of a text field
    this.setState({
      value: e.target.value // give value to the text field
    })
  }

  addComent = (e) =>{ // add new Comment
    const { value, data } = this.state // textbar code and comment data
    if (!e.shiftKey && value){ // if shift key is pressed and has value insert new Comment on press Enter
      let comment = { // comment 
          author: 'You', 
          content: value,
          date: moment().format(),
      }

      this.setState({
        data: [...data, comment], // add comment to comment data
        value: null // set TextArea empty
      },()=>{
        setTimeout(() => { 
          this.scrollToBottom() // after comment pushed scroll to bottom
          this.setState({ 
            value:null  // first setValue null can't remove send press Enter
          })       
        }, 0);
      })
    }
  }

  logScroll = (e) =>{
    if (!e.target.scrollTop){ //check the value of scroll if it is not 0 don't run
      e.persist(e.target.scrollTop) // allow change of event and use it after
      setTimeout(() => { // when to add
        const { data } = this.state 
        if(!e.target.scrollTop && data.length<500){ // check if the scroll value is still Zero
          console.log('done')
          this.setState({
            data:[...data,...data] //data inserted
          })
        }else{
          console.log('Empty')
        }
      }, 1000);
    }
  }

  commentRender = (item,index,isHovered) =>{
    return (
      <Comment
        key={index}
        author={<a>{item.author}</a>}
        avatar={
          <Avatar
          style={{backgroundColor:colors[index.toString()[index.toString().length-1]]}}
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
                style={styles.delCol}
                onMouseOver={()=>{this.deleteIcon(index,true)}}
                onMouseLeave={()=>{this.deleteIcon(index,false)}}
              >
                <Popconfirm  title="You Want to delete comment?" onConfirm={this.handleDelete} okText="Yes" cancelText="No">
                  {isHovered[index]? <DeleteFilled style={styles.delIcon}/> : <DeleteOutlined/>}
                </Popconfirm>
              </span>
            </Tooltip>
          </>
        }
      >
      </Comment>
    )
  }

  render () { 
    const { data, isHovered, value } = this.state
    return (
      <Row justify="space-around">
        <Col 
          style={styles.cSec}
          span={24} 
          order={1}
          onScroll={this.logScroll}
        >
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item,index) => (
            <li>
              {this.commentRender(item,index, isHovered)}
            </li>
            )}
          />
          {/* to scroll till down when new text is done */}
          <div ref={this.messagesEnd} /> 
          </Col>
        <Col span={23} style={styles.cBox} order={3}>
            <Form.Item 
              colon={false}
              label={ <Avatar alt='A' style={styles.sendAvatar}> A </Avatar>}
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
          <Col span="1" style={styles.sendBox} order={4}>
            <Form.Item>
              <SendOutlined 
                onClick={this.addComent} 
                className="sendIcon" 
                style={ isHovered['sendIcon'] ? styles.sendIconHoverd : styles.sendIcon } 
                onMouseOver={()=>{this.deleteIcon('sendIcon',true)}}
                onMouseLeave={()=>{this.deleteIcon('sendIcon',false)}}
                /> 
            </Form.Item>
          </Col>
        {/* <Col span={1}> <SendOutlined/> </Col> */}
      </Row>
    );
  }
}
export default Comments
const colors=[ 
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#0000ff',
  '#b8860b', 
  '#907849',
  '#80afe2',
  '#FAAB14', 
  '#b17401', 
  '#42a3f3', 
  '#ce8785', 
]

const styles = {
  cSec:{
    maxHeight:500,
    overflowY:'auto'
  },
  delCol:{
    paddingLeft: "10px",
    cursor: "pointer",
    textAlignLast:'right'
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
  },
  sendIconHoverd:{
    fontSize: "24px",
    paddingLeft: "10px",
    color: 'blue'
  },

  delIcon: {
    fontSize:'18px'
  },
  sendAvatar:{
    backgroundColor:"#"+Math.floor(Math.random() * 0x1000000).toString(16)
  },
}
