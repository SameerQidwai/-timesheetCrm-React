import React, { useEffect, useState } from 'react';
import { BellFilled, BellTwoTone, BellOutlined } from '@ant-design/icons'; //Icons
import { Avatar, Badge, Button, Divider, List, Popover, Spin } from 'antd';
import './style.css';
import { Link } from 'react-router-dom';
import { getNotifications } from '../../../service/notification-Apis';
import { formatDate } from '../../../service/constant';
import moment from 'moment';

function NotificationIcon() {
  const [count, setCount] = useState(0);
  const [meta, setMeta] = useState({ limit: 5, page: 1});
  const [loading, setLoading] = useState(false)
  const [notify, setNotify] = useState([]);

  useEffect(() => {
    get();
  }, [meta]);

  const get = () => {
    const { limit, page } = meta;
    const query = `limit=${limit}&page=${page}`;
    getNotifications(query).then((res) => {
      if (res.success) {
        const { records } = res.data;
        setNotify((prev) => [...prev, ...records]);
        setLoading(false)
      }
    });
  };

  // const notifications = [
  //   {
  //     id: 1,
  //     message: 'Salman Comment on Project',
  //     time: '1 hour ago',
  //   },
  //   {
  //     id: 2,
  //     message: 'Sameer Submit Timesheet',
  //     time: '2 hours ago',
  //   },
  //   {
  //     id: 3,
  //     message: 'Timesheet is Approved',
  //     time: '2 hours ago',
  //   },
  //   {
  //     id: 4,
  //     message: 'Sohail Submit Leave',
  //     time: '2 hours ago',
  //   },
  //   {
  //     id: 5,
  //     message: 'New Project Created',
  //     time: '2 hours ago',
  //   },
  //   {
  //     id: 6,
  //     message: 'New Expense Added',
  //     time: '2 hours ago',
  //   },
  //   // Add more notification items as needed
  // ];

  const content = (
    <div className="notification-dropdown">
      <List
        className="notify-list"
        dataSource={notify}
        renderItem={(item) => (
          <Link
            to={{ pathname: item.url }}
            className="notification-link"
            target="_blank"
          >
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar icon={<BellOutlined />} />}
                title={item.title}
                description={moment(
                  formatDate(item.createdAt, true, 'YYYY-MM-DDTHH:mm:ss')
                ).fromNow()}
              />
              <div className="notification-status">
                <Badge dot />
              </div>
            </List.Item>
          </Link>
        )}
      />
      <Spin spinning={loading} className='notification-spin'/>
      <Divider />
      <Button
        type="link"
        className="btn-seeAll"
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
    // <div className="notification-dropdown">
    <h5 className="notification-title">
      <span className="notification-title-text">Notifications</span>
      <Button
        type="link"
        className="notification-title-text read"
        onClick={() => console.log('see More')}
      >
        Read All
      </Button>
      {/* <Badge count={count} /> */}
    </h5>
    //   </div>
  );
  return (
    <div>
      <Popover
        content={content}
        title={title}
        placement="bottomRight"
        trigger="click"
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
