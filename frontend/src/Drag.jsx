import {useState, useEffect} from 'react';


const Draggable = (props) => {
    const [dragging, setDragging] = useState(false);
    const [pos, setPos] = useState(props.initialPos);
    const [rel, setRel] = useState(null);

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      setDragging(true);
      setRel({
        x: e.pageX - e.target.offsetLeft,
        y: e.pageY - e.target.offsetTop
      });
      e.stopPropagation();
      e.preventDefault();
    };

    const onMouseUp = (e) => {
      setDragging(false);
      e.stopPropagation();
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!dragging) return;
      setPos({
        x: e.pageX - rel.x,
        y: e.pageY - rel.y
      });
      e.stopPropagation();
      e.preventDefault();
    };
   
    const onDragStart = (e) => {
        e.dataTransfer.setData('text/plain', 'Draggable');
    };
    
    useEffect(() => {
      if (dragging) {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      } else {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }, [dragging, onMouseMove, onMouseUp]);

    return (
      <div
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          left: pos.x + 'px',
          top: pos.y + 'px',
          border: '2px solid #aa5',
          padding: '10px'
        }}
      >
        {props.children}
      </div>
    );
  };

export default Draggable;