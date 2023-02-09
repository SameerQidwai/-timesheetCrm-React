import { formatCurrency, formatFloat, getFiscalYear, parseDate } from '../../../service/constant'
import { tableSorter } from '../Table/TableFilter'

export {default as WorkInHand} from './WorkInHand'
export {default as BenchResources} from './BenchResources'
export {default as WorkforceSkills} from './WorkforceSkills'
export {default as Positions} from './Positions'
export {default as WorkForceAllocation} from './WorkForceAllocation'
export {default as ProjectRevenueAnalysis} from './ProjectRevenueAnalysis'
export {default as ClientRevenueAnalysis} from './ClientRevenueAnalysis'
export {default as TimesheetSummary} from './TimesheetSummary'
export {default as LeaveSummary} from './LeaveSummary'

//-----------------> HelperFunction <---------------
export const _generateMonthlyColumns = ({date, contantColmuns, setColumn, spliceBtw, colRender, format, dataIndex, width="5%"})=>{
    
    let {start, end} = getFiscalYear('dates',date)
    let monthlyColumn = []
    for (
      var iMonth = parseDate(start) ; // defination
      iMonth.isSameOrBefore(parseDate(end));  //condition
      iMonth.add(1, 'months') //itrerater
      ){
        let key = parseDate(iMonth, 'MMM YY') // creating month key
        monthlyColumn.push({
            key: key,
            dataIndex: dataIndex ? [...dataIndex, key] :key ,
            title: key,
            align: 'center',
            width: width,
            render: (value) =>{
                value = colRender ? value?.[colRender] : value                
                return ( //amount render
                    valueFormat(format, value) 
                )
            },
            ...tableSorter(dataIndex ? `${dataIndex[0]}.${key}.${colRender}` : `${key}.${colRender}`, 'number'), //sort
        });
      }
    let creatingColumn = [...contantColmuns]
    creatingColumn.splice(spliceBtw, 0 , ...monthlyColumn);
    setColumn([...creatingColumn])
}

const valueFormat = (format, value) =>{
  if (format === 'currency'){
    return formatCurrency(value)
  }else if (format === 'float'){
    return formatFloat(value)
  }else if (format === 'status'){
    return statusFormat(value)
  }else{
    return value
  }
}

const statusFormat = (value) =>{
    if (value === '-' || value === 'N/A'){
        return value
    }else{
        return formatFloat(value)
    }
}