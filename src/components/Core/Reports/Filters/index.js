export * from "./filtersFields"
export {default as ReportsFilters} from './ReportsFilters'

export const _createQuery = (searchColumn = {})=>{
    let query  = ''
    let filters = Object.entries(searchColumn)
    let lastIndex = filters.length
    filters.map(([key, {value, type, multi}], index)=>{
  
      if (query && (value?.selectedIds?.length || value?.value || value?.length )){
        query += '&'
      }
  
      if (type === 'Select' && multi){
  
        query += `${value?.selectedIds?.length ? `${key}=` + `${value?.selectedIds}` : ''}`
  
      }else if (type === 'Select'){
  
        query += `${`${key}=`+`${value?.value}`}`
        
      }else if (type === 'Date'){
  
        let [startDate, endDate] = value || [];
  
        query += `${startDate ? 'startDate=' + startDate : ''}${
          startDate && endDate ? '&' : ''
        }${endDate ? 'endDate=' + endDate : ''}`;
  
      }else{
  
        query += `${value ? `${key}=` + `${value}` : ''}`
  
      }    
    })
  
    return query
}