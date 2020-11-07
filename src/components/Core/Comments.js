// import React, { Component, useState } from 'react'
import React, { Component } from 'react'

import { Comment, Tooltip, Avatar } from 'antd'

import moment from 'moment';

import { DeleteOutlined, DeleteFilled } from '@ant-design/icons';

// const { Panel } = Collapse;
const hover = false
class Comments extends Component{
  constructor (){
    super ()
    this.state= {
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
    }
  }
  deleteIcon = (e,filled) =>{
    if (filled){
      return <DeleteFilled/>
    }else{
      return <DeleteOutlined/>
    }
  }

  render () { 
    // const { actions } = Demo
    const { data } = this.state
    return (
      <div style={{maxHeight:'500px'}}>
      {
        data.map((item,j) => (
          <Comment
            key={j}
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
                  style={{paddingLeft:'10px', cursor:'pointer'}}
                    // onMouseOver={this.deleteIcon(true)}
                    // onMouseOut={this.deleteIcon(false)}
                  >
                    {this.deleteIcon}
                  </span>
                </Tooltip>
              </>
            }
          >
            {/* { item.reply &&
              <Collapse
                bordered={false}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className="site-collapse-custom-collapse"
               >
                <Panel header="repy" key="1" className="site-collapse-custom-panel">
                  {item.reply.map((reply,i) => (
                    <Comment
                      key={i}
                      actions={actions}
                      author={<a>{reply.author}</a>}
                      avatar={
                        <Avatar
                          alt={reply.author}
                        >
                          {reply.author[0].toUpperCase()}
                        </Avatar>
                      }
                      content={
                        <p>{reply.content}</p>
                      }
                      datetime={
                        <Tooltip title={moment(reply.date).format('YYYY-MM-DD HH:mm:ss')}>
                          <span>{moment(reply.date).fromNow()}</span>
                        </Tooltip>
                      } 
                    />
                  ))}
                </Panel>
              </Collapse>
            } */}
          </Comment>
          ))
        }
      </div>
    );
  }
}
export default Comments