import { useState } from 'react';
import React, { ChangeEvent } from 'react';
import './App.css';
import InputMask from "react-input-mask";
import { nameRegex, phoneNumberRegex } from './regex/regex';
import { useAddContactMutation, useDeleteContactMutation, useGetContactsQuery } from './store/controllers/contactsApi';
import { IUserContactsPre } from './interfaces/IUserContactsPre';

const App = () => {
  const {data = []} = useGetContactsQuery();
  const [sendContact] = useAddContactMutation();
  const [deleteCont] = useDeleteContactMutation();
  const [userContacts, setUserContacts] = useState<IUserContactsPre>({
    contactName: "",
    contactNumber: ""
  });

  const sendUserHandler = (e: React.FormEvent) => {
    e.preventDefault();
    sendContact(userContacts);
  }

  const changeUserValues = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserContacts(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  return (
    <div className='container'>
      <form onSubmit={sendUserHandler}>
        <h2>Добавить контакт</h2>
        <input onChange={changeUserValues} name='contactName' type="text" placeholder='Имя'/>
        <InputMask onChange={changeUserValues} name='contactNumber' mask="+7 (999) 999-99-99" placeholder="Телефон" />
        <button
          type="submit"
          disabled={
            !phoneNumberRegex.test(userContacts.contactNumber) ||
            (userContacts.contactName.trim().length === 0 ||
            nameRegex.test(userContacts.contactName))
          }
          >Добавить</button>
      </form>

      <div className='contacts'>
        <h2>Список контактов</h2>
        {data.length ? data?.map((contact) => (
          <div className='contact' key={contact.id}>
            <button className='delete' onClick={() => deleteCont(contact.id)}>x</button>
            <p className='text'>{contact.contactName}</p>
            <p className='text'>{contact.contactNumber}</p>
          </div>
        )) : <p>Список контактов пуст</p>}
      </div>
    </div>
  )
}

export default App;
