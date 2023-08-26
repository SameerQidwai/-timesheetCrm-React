import React, { useState } from 'react';
import { BellFilled, BellTwoTone, BellOutlined } from '@ant-design/icons'; //Icons
import { Avatar, Badge, Divider, List, Popover } from 'antd';
import './style.css';
import { Link } from 'react-router-dom';

function NotificationIcon() {
  const [count, setCount] = useState(199);

  const notifications = [
    {
      id: 1,
      message: 'Salman Comment on Project',
      time: '1 hour ago',
    },
    {
      id: 2,
      message: 'Sameer Submit Timesheet',
      time: '2 hours ago',
    },
    {
      id: 3,
      message: 'Timesheet is Approved',
      time: '2 hours ago',
    },
    {
      id: 4,
      message: 'Sohail Submit Leave',
      time: '2 hours ago',
    },
    {
      id: 5,
      message: 'New Project Created',
      time: '2 hours ago',
    },
    {
      id: 6,
      message: 'New Expense Added',
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
      <Divider />
      <a className="btn-seeAll" href="#">
        Load More
      </a>
    </div>
  );
  const title = (
    // <div className="notification-dropdown">
    <h5 className="notification-title">
      <span className="notification-title-text">Notifications</span>
      <a className="notification-title-text read">Read All</a>
      {/* <Badge count={count} /> */}
    </h5>
    //   </div>
  );
  return (
    <div>
      <Popover content={content} 
      title={title} 
      placement="bottomRight"
      trigger="click">
        {count ? (
          <Badge count={count} size="small" className='notify-bagde' offset={[count> 9 ? 5: 0, 0]}>
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
