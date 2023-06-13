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
  defaultValue,
  ...rest
}) {
  const [FYears, setFYears] = useState([]);
  const [fYear, selectFYear] = useState(null);

  useEffect(() => {
    getAllFY(true).then((res) => {
      if (res.success) {
        if (defaultValue){
          let currentFy = res.option?.[0]?? null
          for(let fy of res.option??[]){
            if (
              formatDate(new Date()).isBetween(
                formatDate(fy.start),
                formatDate(fy.end)
              )
            ) {
              currentFy = fy;
              break;
            }
          }
          console.log(currentFy)
          selectFYear(currentFy.value)
          callBack({
            closed: currentFy?.closed,
            start: formatDate(currentFy.start),
            end: formatDate(currentFy.end),
          });
        }
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
      onChange={(value, record) => {
        selectFYear(value);
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
