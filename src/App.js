import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';
import { FaFilter } from "react-icons/fa";
import { closestCenter, DndContext, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import {arrayMove, SortableContext,
  useSortable,
verticalListSortingStrategy} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"


const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};



function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  useEffect(() => {
    setFilteredList(list);
  }, [list]);


  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  

  function crossOver(id) {
    console.log("hello")
    setList(
      list.map((item) => {
        if (item.id === id ) {
          return { ...item, cross:  (item.cross === "none" ? "line-through" : "none") };
        }
        return item;
      }));
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'please enter value');
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value changed');
    } else {
      showAlert(true, 'success', 'item added to the list');
      const newItem = { id: new Date().getTime().toString(), title: name +"\t"+currentDate, cross:"none"};

      setList([...list, newItem]);
      setName('');
    }
  };

  const handleChange = (e) =>{
    const selectedOption = e.target.value;
    if(selectedOption==="all"){
      showAll();
    }
    else if(selectedOption==="complete"){
      showComplete();
    }
    else{
      showIncomplete();
    }
  }

  const showAll = () =>{
    setFilteredList(list);
  }

  const showComplete = () =>{
    showAlert(true, 'success', 'Completed Tasks');
    setFilteredList(list.filter((item) => item.cross !== "none"));
  }

  const showIncomplete = () =>{
    showAlert(true, 'danger', 'Incomplete Tasks');
    setFilteredList(list.filter((item) => item.cross !== "line-through"));
  }

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  



   const SortableUser = ({ item }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: item.id });
    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
        <List
          id={item.id}
          title={item.title}
          style={item.cross}
          removeItem={removeItem}
          editItem={editItem}
          crossOver={crossOver}
        />
      </div>
    );
  };

  const onDragEnd = (event) => {
    const {active, over}= event;
    if(active.id=== over.id){
      return ;
    }
    setList((list) => {
      const oldIndex = list.findIndex((item)=> item.id=== active.id);
      const newIndex = list.findIndex((item)=> item.id=== over.id);
      return arrayMove(list, oldIndex, newIndex);
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);




  
  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <span className='filter-btn' style={{display:"inline"}}><FaFilter /></span>

        <select id="filter" name="status" className='submit-btn'  onChange={handleChange} style={{display:"inline", width:"20%"}} >
          <option value="all">All</option>
          <option value="complete">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <h3>task tracker</h3>
        
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='e.g. eggs'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      <div className='grocery-container'>
      {list.length > 0 && (
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} sensors={sensors}>
          <SortableContext items={filteredList} strategy={verticalListSortingStrategy}>
            {filteredList.map((item) => (
            <SortableUser key={item.id} item={item} />
            ))}
            
        <button className='clear-btn' onClick={clearList}>
              clear items
        </button>
        </SortableContext>
        </DndContext>
      )}
      </div>
    </section>
  );
}

export default App;
