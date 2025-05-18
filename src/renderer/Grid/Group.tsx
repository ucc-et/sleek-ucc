import React, { memo } from 'react'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import { HandleFilterSelect, IsSelected } from '../Shared'
import { useDrop } from 'react-dnd'

interface GroupProps {
  key: string
  value: string | string[]
  filters: Filters | null
}

const { ipcRenderer } = window.api

const Group: React.FC<GroupProps> = memo(({ attributeKey, value, filters }) => {
  if (!value || value.length === 0) {
    return (
      <ListItem className="row group">
        <Divider />
      </ListItem>
    )
  }

  const insertNewPriority = (todoValue: string) => {
    const regex = /\([A-Za-z]\)/;
    if(regex.test(todoValue)){
      return todoValue.replace(regex, `(${value})`)
    }
    if(todoValue.startsWith('x')){
      const withoutX = todoValue.slice(1).trimStart();
      return `x (${value}) ${withoutX}`
    }

    return `(${value}) ${todoValue}`
  }

  const [, dropRef] = useDrop({
    accept: 'ROW',
    drop: (object: TodoObject) => {
      const stringVal = insertNewPriority(object?.id.string)
      ipcRenderer.send('writeTodoToFile', object?.id.lineNumber,stringVal)
    }
  })
  const groupElements = typeof value === 'string' ? [value] : value

  return (
    <div ref={dropRef}>
      <ListItem className="row group">
        {groupElements.map((value, index) => {
          return (
            <div
              key={index}
              className={IsSelected(attributeKey, filters, [value]) ? 'selected filter' : 'filter'}
              data-todotxt-attribute={attributeKey}
              data-todotxt-value={value}   
            >
              <button
                onClick={() => HandleFilterSelect(attributeKey, [value], filters, false)}
                data-testid={`datagrid-group-button-${attributeKey}`}
              >
                {value}
              </button>
            </div>
          )
        })}
      </ListItem>
    </div>
  )
})

Group.displayName = 'Group'

export default Group
