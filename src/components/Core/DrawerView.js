import React, { useEffect, useState } from 'react';
import { Col, Divider, Drawer, Row, Table } from 'antd';
import { formatCurrency, parseDate } from '../../service/constant';

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

export default function DrawerView({
  visible = false,
  placement = 'right',
  width,
  content: { title, key, data } = {},
  onClose,
}) {
  return (
    <Drawer
      visible={visible}
      title={title}
      placement={placement}
      width={width}
      onClose={onClose}
      destroyOnClose
    >
      {key === 'workInHandForecast' && (
        <ForecastRevenueTable forecasts={data} />
      )}
    </Drawer>
  );
}

// table to show workInHandForecast for Revenue
function ForecastRevenueTable({ forecasts }) {
  const [dataSource, setDataSource] = useState([]);
  let {
    projects,
    opportunities,
    year: { start, end },
  } = forecasts;
  const forecastRevenueColumns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      // render: (record) => `00${record}`,
      // ...tableSorter('id', 'number'),
    },
    {
      title: 'Projects',
      dataIndex: 'projects',
      key: 'projects',
      // ...tableSorter('id', 'number'),
    },
    {
      title: 'Opportunities',
      dataIndex: 'opportunities',
      key: 'opportunities',
      // ...tableSorter('id', 'number'),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      // ...tableSorter('id', 'number'),
    },
  ];

  useEffect(() => {
    let tempData = [];
    for (
      var iDate = parseDate(start);
      iDate.isSameOrBefore(end);
      iDate.add(1, 'months')
    ) {
      let key = parseDate(iDate, 'MMM YY');
      tempData.push({
        month: key,
        actual: iDate.isBefore(parseDate(new Date()), 'month'),
        projects: formatCurrency(projects[key]??0),
        opportunities: formatCurrency(opportunities[key]??0),
        total: formatCurrency((opportunities[key]??0) + (projects[key]??0)),
      });
    }
    setDataSource(tempData);
  }, [forecasts]);

  return (
    <Table
      columns={forecastRevenueColumns}
      dataSource={dataSource}
      bordered
      pagination={false}
      rowKey={(data) => data.month}
      size="small"
      className="fs-small table-background-row-color"
      rowClassName={(record) => (record.actual ? 'actual' : '')}
    />
  );
}

// not complete yet but thinking to make Detail view from drawer
// will complete when UI will change... 
// it isn't matter now..
function OrganisationViewDrawer({data}){
  return <>
  <p className="site-description-item-profile-p">General Detail</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Name" content="Lily" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Title" content="AntDesign@example.com" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="City" content="HangZhou" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Country" content="China🇨🇳" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Birthday" content="February 2,1900" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Website" content="-" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Message"
              content="Make things as simple as possible but no simpler."
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Company</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Position" content="Programmer" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Responsibilities" content="Coding" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Department" content="XTech" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Supervisor" content={<a>Lin</a>} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Skills"
              content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Contacts</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Email" content="AntDesign@example.com" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Github"
              content={
                <a href="http://github.com/ant-design/ant-design/">
                  github.com/ant-design/ant-design/
                </a>
              }
            />
          </Col>
        </Row></>
}


const organiztionStructure = [
  {title: 'Name', key: 'name'},
  {title: 'Title', key: 'title'},
  {title: 'Parent', key: 'parentOrganization'},
  {title: 'Phone', key: 'phoneNumber'},
  {title: 'Email', key: 'email'},
  {title: 'Bussiness Type', key: 'businessType'},
  {title: 'Delegate Contact person', key: 'delegateContactPerson'},
  {title: 'Address', key: 'address'},
  {title: 'Website', key: 'website'},
  {divider: true, key: 1},
  {title: 'ABN', key: 'abn'},
  {title: 'Tax Code', key: 'taxCode'},
  {title: 'Email for Invoices', key: 'invoiceContactNumber'},
  {title: ' Contact Number for Invoices', key: 'invoiceEmail'},
  {heading: 'Professional Indemnity', key: 'Professional Indemnity'},
]