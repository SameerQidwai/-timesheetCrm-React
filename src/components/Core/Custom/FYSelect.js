import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { getAllFY } from '../../../service/financial-year-apis';
import { CalendarOutlined } from '@ant-design/icons';

function FYSelect({
  placeholder = 'Financaial Year',
  size = 'small',
  suffixIcon = <CalendarOutlined />,
  style,
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
      value={fYear}
      placeholder={placeholder}
      allowClear
      size={size}
      options={FYears}
      suffixIcon={suffixIcon}
      style={{ ...style, width: '100%' }}
      {...rest}
    />
  );
}

export default FYSelect