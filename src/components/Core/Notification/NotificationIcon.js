import React, { useEffect, useState } from 'react';
import { BellFilled, BellTwoTone, BellOutlined } from '@ant-design/icons'; //Icons
import { Avatar, Badge, Button, Divider, List, Popover, Spin } from 'antd';
import './style.css';
import { Link, useHistory } from 'react-router-dom';
import { clearNotification, getNotifications, getRecentNotifications, markAsRead } from '../../../service/notification-Apis';
import { formatDate } from '../../../service/constant';
import moment from 'moment';

function NotificationIcon() {
  const history = useHistory()
  const [count, setCount] = useState(0);
  const [meta, setMeta] = useState({ limit: 5, page: 1});
  const [loading, setLoading] = useState(true)
  const [readLoading, setReadLoading] = useState(false)
  const [notify, setNotify] = useState([]);

  useEffect(() => {
    get();

    const intervalId = setInterval(() => {
      getRecentNotifications(history).then(res=>{
        if(res.success){
          setCount(res.counter)
          setNotify((prev) => [...res.data, ...prev]);
        }
      })
    }, 10000);

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [meta]);

  const get = () => {
    const { limit, page } = meta;
    const query = `limit=${limit}&page=${page}`;
    getNotifications(query).then((res) => {
      setLoading(false)
      if (res.success) {
        const { records } = res.data;
        setNotify((prev) => [...prev, ...records]);
      }
    });
  };
  

  const markRead = (id, item) =>{
    setReadLoading(true)
    markAsRead(id).then((res)=>{
      setNotify(prev => prev.map(no=>{
        if (id == no.id){
          no.readAt = true;
        };
        return no;
      }));
      setReadLoading(false)
    });

    if(id){
      history.push(`/time-sheet`)
    }
  }

  const clear = () =>{
    clearNotification().then(res=>{
      if(res.success){
        setCount(0)
      }
    })
  }

  // const openNotification = () =>{

  // }


  const content = (
    <div className="notification-dropdown">
      <List
        className="notify-list"
        dataSource={notify}
        renderItem={(item) => (
          <Link
            to={{ pathname: `/time-sheet` }}
            className="notification-link"
          >
            <List.Item key={item.id} onClick={()=>{markRead([item.id], item)}}>
              <List.Item.Meta
                avatar={<Avatar icon={<BellOutlined />} />}
                title={item.title}
                description={moment(formatDate(item.createdAt, true, "YYYY-MM-DDTHH:mm:ss")).fromNow()}
              />
              {!item.readAt&&<div className="notification-status">
                <Badge dot />
              </div>}
            </List.Item>
          </Link>
        )}
      />
      <Spin spinning={loading} className='notification-spin'/>
      <Divider />
      <Button
        type="link"
        className="btn-seeAll"
        loading={loading}
        onClick={() => {
          setMeta((prev) => ({ ...prev, page: prev.page + 1 }))
          setLoading(true)
        } }
      >
        Load More
      </Button>
    </div>
  );

  const title = (
    <h5 className="notification-title">
      <span className="notification-title-text">Notifications</span>
      <Button
        type="link"
        className="notification-title-text read"
        onClick={() => markRead()}
        loading={readLoading}
      >
        Read All
      </Button>
    </h5>
  );

  return (
    <div>
      <Popover
        content={content}
        title={title}
        placement="bottomRight"
        trigger="click"
        onVisibleChange={(visible)=>{
          if(count){
            clear()
          }
        }}
      >
        {count ? (
          <Badge
            count={count}
            size="small"
            className="notify-bagde"
            offset={[count > 9 ? 5 : 0, 0]}
          >
            <a>
              <BellTwoTone />
            </a>
          </Badge>
        ) : (
          <a>
            <BellOutlined />
          </a>
        )}
      </Popover>
    </div>
  );
}

export default NotificationIcon;
