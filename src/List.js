import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";


// const getLocalStorageAgain = () => {
//   let style = localStorage.getItem('style');
//   if (style) {
//     return (style = localStorage.getItem('style'));
//   } 
// };


const List = ({ id, title, style, removeItem, editItem, crossOver}) => {


    React.useEffect(() => {
    localStorage.setItem('style', style);
  }, [style]);

  return (
    <div className="grocery-list">
      <article className="grocery-item" key={id}>
        <p
          className="title"
          onClick={()=>(crossOver(id))}
          style={{ textDecoration: style }}
        >
          {title}
        </p>
        <div className="btn-container">
          <button
            type="button"
            className="edit-btn"
            onClick={() => editItem(id)}
          >
            <FaEdit />
          </button>
          <button
            type="button"
            className="delete-btn"
            onClick={() => {
              removeItem(id);
              // maintainCrossOver();
            }}
          >
            <FaTrash />
          </button>
        </div>
      </article>
    </div>
  );
};

export default List;
