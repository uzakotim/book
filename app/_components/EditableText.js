import React, { useState, useRef, useEffect } from 'react';
import { Edit, Check, X } from 'lucide-react';
import PropTypes from 'prop-types';
const EditableText = ({ text, onSave, className, placeholder = "Edit text" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); 
    }
  }, [isEditing]);

  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  const handleSave = () => {
    if (currentText.trim() === '') {
      onSave(text); // Save original if current is empty or revert
      setCurrentText(text); // Revert UI to original if saved empty
    } else if (currentText !== text) {
      onSave(currentText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentText(text); 
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleMouseDownOnButton = (e) => {
    e.preventDefault(); 
  };

  return (
    <div className="flex items-center group relative w-full">
      {isEditing ? (
        <div className="flex flex-grow items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={handleSave} 
            onKeyDown={handleKeyDown}
            className={`bg-primary text-white placeholder-primary/50 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary ${className}`}
            placeholder={placeholder}
          />
          <button
            onClick={handleSave}
            onMouseDown={handleMouseDownOnButton}
            className="p-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors duration-200 flex-shrink-0"
            title="Save"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            onMouseDown={handleMouseDownOnButton}
            className="p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors duration-200 flex-shrink-0"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-grow items-center space-x-2">
          <span
            role='button'
            onClick={() => setIsEditing(true)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(true)}
            className={`${className} cursor-pointer break-words`}
            onTouchStart={() => setIsEditing(true)}
          >
            {text || <span className="opacity-60">{placeholder}</span>}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:text-primary text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 absolute right-0 top-1/2 -translate-y-1/2"
            title="Edit"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};


EditableText.propTypes = {
  text: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};
export default EditableText;


