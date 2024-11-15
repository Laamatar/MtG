import React from 'react';
import {useDroppable} from '@dnd-kit/core';


/** 
 *
 * droppable.jsx
 * 
 * Adds a Droppable -element. Basic functionality that is given by dnd kit introduction. (droppable.jsx is copied from the introduction tutorial)
*/

export function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}