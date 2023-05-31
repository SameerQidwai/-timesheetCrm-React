import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import {
  checkToolLogin,
  toolLogin,
  toolLogout,
} from '../../../service/integration-Apis';
import ATable from '../../../components/Core/Table/TableFilter';

let initialState = [
  {
    id: 1,
    img: 'data:image/png;base64,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',
    title: 'Accounting Software – Do Beautiful Business',
    tool: 'xero',
  },
];

function Integration() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(initialState);
  const columns = [
    {
      title: 'Tool',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a src="https://identity.xero.com" target="_blank">
          <img
            // id="wp_thbn_37"
            src={record.img}
            height="40"
            width="40"
            alt=""
            data-atf="1"
            data-frt="0"
          />{' '}
          {text}
        </a>
      ),
    },
    {
      title: 'Login Email',
      dataIndex: 'loginEmail',
      key: 'loginEmail',
      align: 'center',
      render: (text) => <a> {text} </a>,
    },
    {
      title: '',
      dataIndex: 'tool',
      key: 'tool',
      align: 'right',
      //   width:'1%',
      render: (text, record) =>
        record.loginEmail ? (
          <Button type="primary" danger onClick={() => logout(text)}>
            Disconnect {text}
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setLoading(true);
              toolLogin(text);
            }}
            loading={loading}
          >
            Connect {text}
          </Button>
        ),
    },
  ];

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    checkToolLogin('xero').then((res) => {
      if (res.success) {
        setData([{ ...data[0], ...res.data }]);
      }
      setLoading(false);
    });
  };

  // window.addEventListener('message', event => {
  //     // Only accept messages from http://example.com.
  //     if (event.data === 'close') {
  //         checkLogin()
  //     }
  // })

  const logout = (text) => {
    toolLogout(text).then((res) => {
      if (res.success) {
        setData(initialState);
      }
    });
  };

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col span={24}>
          <ATable
            rowKey="id"
            sticky={true}
            bordered={false}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </Col>
      </Row>
    </>
  );
}

export default Integration;
