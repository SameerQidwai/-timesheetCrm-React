import React, { useState } from 'react';
import { BellFilled, BellTwoTone, BellOutlined } from '@ant-design/icons'; //Icons
import { Avatar, Badge, List, Popover } from 'antd';
import './style.css';
import { Link } from 'react-router-dom';

function NotificationIcon() {
  const [count, setCount] = useState(0);

  const notifications = [
    {
      id: 1,
      message: 'New post in a subreddit.',
      time: '1 hour ago',
    },
    {
      id: 2,
      message: 'Comment on your post.',
      time: '2 hours ago',
    },
    {
      id: 3,
      message: 'Comment on your post.',
      time: '2 hours ago',
    },
    {
      id: 4,
      message: 'Comment on your post.',
      time: '2 hours ago',
    },
    {
      id: 5,
      message: 'Comment on your post.',
      time: '2 hours ago',
    },
    {
      id: 6,
      message: 'Comment on your post.',
      time: '2 hours ago',
    },
    // Add more notification items as needed
  ];

  const content = (
    <div className="notification-dropdown">
      <List
        className="notify-list"
        dataSource={notifications}
        renderItem={(item) => (
            <Link to={`/notifications/${item.id}`} className="notification-link">
          <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar icon={<BellOutlined />} />}
                title={item.message}
                description={item.time}
              />
              <div className="notification-status">
                <Badge dot />
              </div>
          </List.Item>
            </Link>
        )}
      />
      <a className="btn-seeAll" href="#">
        See all incoming activity
      </a>
    </div>
  );
  const title = (
    // <div className="notification-dropdown">
    <h5 className="notification-title">
      <span className="notification-title-text">Notifications</span>
      <Badge count={3} />
    </h5>
    //   </div>
  );
  return (
    <div>
      <Popover content={content} title={title} trigger="click">
        {count ? (
          <Badge count={count} size="small">
            <a>
              <BellTwoTone />
            </a>
          </Badge>
        ) : count === false ? (
          <a>
            <BellFilled />
          </a>
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
