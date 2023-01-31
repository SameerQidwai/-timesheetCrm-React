import { Tag } from 'antd'
import React from 'react'
import { R_STATUS, STATUS_COLOR, O_PHASE, O_PHASE_COLORS,ACTIVE_STATUS, ACTIVE_STATUS_COLORS } from '../../../service/constant'

let constantNames = {
  R_STATUS, STATUS_COLOR, O_PHASE, O_PHASE_COLORS, ACTIVE_STATUS, ACTIVE_STATUS_COLORS
}

const Tags = ({ text, objName, colorName }) => {
  return text && text !== 'SV' ? (
    <Tag
      color={colorName ? constantNames?.[colorName]?.[text] : STATUS_COLOR[text]}
    >
      {objName ? constantNames?.[objName]?.[text] : R_STATUS[text]}
    </Tag>
  ) : null;
};

export default Tags