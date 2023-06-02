import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { getAllFY } from '../../../service/financial-year-apis';
import { CalendarOutlined } from '@ant-design/icons';
import { formatDate, getFiscalYear } from '../../../service/constant';

function FYSelect({
  placeholder = 'Financaial Year',
  size = 'small',
  suffixIcon = <CalendarOutlined />,
  style,
  callBack,
  ...rest
}) {
  const [FYears, setFYears] = useState([]);
  const [fYear, selectFYear] = useState(null);

  useEffect(() => {
    getAllFY(true).then((res) => {
      if (res.success) {
        setFYears(res.option);
      }
    });
  }, []);

  return (
    <Select
    //   value={fYear}
      placeholder={placeholder}
      allowClear
      size={size}
      options={FYears}
      suffixIcon={suffixIcon}
      style={{ ...style, width: '100%' }}
      {...rest}
      onChange={(value, record) => {
        // selectFYear(value);
        console.time('timing');
        let select = record ?? getFiscalYear('dates')
        callBack({
          closed: select?.closed,
          start: formatDate(select.start),
          end: formatDate(select.end),
        });
      }}
    //   onSelect={(_, record) => {
    //     let select = record ?? getFiscalYear('dates')
    //     callBack({
    //       start: formatDate(select.start),
    //       end: formatDate(select.end),
    //     });
    //   }}
    />
  );
}

export default FYSelect;
