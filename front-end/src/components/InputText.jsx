import React, { useState } from "react";
import './InputText.scss';  // Assuming styles are defined in this file
import './button.scss';
 
 const InputText = ({ addMessage }) => {
     const [message, setMessage] = useState("");
     const sendMessage = () => {
         if (message.trim()) {
             addMessage(message.trim());
             setMessage("");
         }
     };
 
     return (
         <form className="input-text-form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
             <input
                 type="text"
                 placeholder="Type a message..."
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
             />
             <button type="submit" disabled={!message.trim()}>Send</button>
         </form>
     );
 };
 
 export default InputText;
