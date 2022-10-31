import { Tag } from 'antd'
import React from 'react'
import { R_STATUS, STATUS_COLOR } from '../../../service/constant'

const Tags = ({ text, arr }) => {
  return (
    (text && text !== 'SV') ? <Tag color={STATUS_COLOR[text]}>{R_STATUS[text]}</Tag> : null
    )
}

export default Tags