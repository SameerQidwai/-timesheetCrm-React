import React, { useEffect, useState } from 'react';
import {
  BellOutlined,
  InfoOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons'; //Icons
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Empty,
  List,
  Spin,
  Tooltip,
  notification,
} from 'antd';
// import './style.css';
import { Link, useHistory } from 'react-router-dom';
import {
  clearNotification,
  getNotifications,
  getRecentNotifications,
  markAsRead,
  markAsUnRead,
} from '../../service/notification-Apis';
import { ellipsis, formatDate } from '../../service/constant';
import moment from 'moment';

const AlertIcon = {
  0: { icon: <BellOutlined />, color: '#1890ff' },
  1: { icon: <InfoOutlined />, color: '#1890ff' },
  2: { icon: <CheckOutlined />, color: '#4caf50' },
  3: { icon: <CloseOutlined />, color: 'red' },
};

function Notifications() {
  const history = useHistory();
  const [count, setCount] = useState(0);
  const [meta, setMeta] = useState({ limit: 5, page: 1 });
  const [loading, setLoading] = useState(true);
  const [readLoading, setReadLoading] = useState(false);
  const [notify, setNotify] = useState([]);

  useEffect(() => {
    get();

    const intervalId = setInterval(() => {
      getRecentNotifications(history).then((res) => {
        if (res.success) {
          setCount(res.counter);
          setNotify((prev) => [...res.data, ...prev]);
        }
      });
    }, 10000);

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, [meta]);

  const get = () => {
    const { limit, page } = meta;
    const query = `limit=${limit}&page=${page}`;
    getNotifications(query).then((res) => {
      setLoading(false);
      if (res.success) {
        const { records } = res.data;
        setNotify((prev) => [...prev, ...records]);
      }
    });
  };

  const markRead = (id, item) => {
    setReadLoading(true);
    notification.destroy();
    markAsRead(id).then((res) => {
      setNotify((prev) =>
        prev.map((no) => {
          if (id) {
            if (id == no.id) {
              no.readAt = true;
            }
          }
          return no;
        })
      );
      setReadLoading(false);
    });
  };

  const markUnRead = (id, item) => {
    setReadLoading(true);
    notification.destroy();
    markAsUnRead(id).then((res) => {
      setNotify((prev) =>
        prev.map((no) => {
          if (id) {
            if (id == no.id) {
              no.readAt = false;
            }
          }
          return no;
        })
      );
      setReadLoading(false);
    });
  };

  const content = (
    <div>
      <List
        className="notify-list"
        dataSource={notify}
        locale={{
          emptyText: (
            <Empty
              description="No Notifications"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        renderItem={(item) => {
          let avatar = AlertIcon[item.type] ?? {};
          return (
            //text badger 
            // <Badge.Ribbon
            // className="notification-status"
            //   text={
            //     <Tooltip
            //         title={`Mark As ${item.readAt ? 'Unread' : 'Read'}`}
            //         color={item.readAt ? 'red' : '#73d13d'}
            //         onClick={() => {
            //             if (item.readAt) {
            //             markUnRead([item.id], item);
            //             } else {
            //             markRead([item.id], item);
            //             }
            //         }}
            //     >
            //       {item.readAt ? 'Read' : 'Unread'}
            //     </Tooltip>
            //   }
            //   color={item.readAt ? '#73d13d' : 'red'}
            // >
              <List.Item key={item.id}>
                <div
                  style={{ width: '100%' }}
                //   onClick={() => {
                //     markRead([item.id], item);
                //   }}
                >
                  <Link to={`${item.url}`} className="notification-link">
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={avatar.icon}
                          style={{ backgroundColor: avatar.color }}
                        />
                      }
                      title={item.title}
                      description={
                        <span>
                          <div>{ellipsis(item.content, 60)}</div>
                          <div>
                            {moment(
                              formatDate(
                                item.createdAt,
                                true,
                                'YYYY-MM-DDTHH:mm:ss'
                              )
                            ).fromNow()}
                          </div>
                        </span>
                      }
                    />
                  </Link>
                </div>
                <Tooltip
                    title={`Mark As ${item.readAt ? 'Unread' : 'Read'}`}
                    color={item.readAt ? 'red' : '#73d13d'}
                >
                    <div className="notification-status">
                    <Badge
                        dot
                        status={item.readAt ? 'default' : 'error'}
                        onClick={() => {
                        if (item.readAt) {
                            markUnRead([item.id], item);
                        } else {
                            markRead([item.id], item);
                        }
                        }}
                    />
                    </div>
                </Tooltip>
              </List.Item>
            // </Badge.Ribbon>
          );
        }}
      />
      <Spin spinning={loading} className="notification-spin" />
      <Divider />
      <div className="btn-loadmore">
        <Button
          type="link"
          loading={loading}
          onClick={() => {
            setMeta((prev) => ({ ...prev, page: prev.page + 1 }));
            setLoading(true);
          }}
        >
          Load More
        </Button>
      </div>
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
    <div className="notification-page">
      {title}
      {content}
    </div>
  );
}

export default Notifications;
