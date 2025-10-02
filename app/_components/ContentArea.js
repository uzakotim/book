import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, Trash } from 'lucide-react';

const ContentArea = ({ chapterId, sectionId, content, contentIndex, totalContent, updateContent, moveItem, deleteItem }) => {
  const [text, setText] = useState(content.text);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  // Sync internal state with external prop changes
  useEffect(() => {
    setText(content.text);
  }, [content.text]);

  const handleChange = (e) => {
    setText(e.target.value);
    updateContent(chapterId, sectionId, content.id, { text: e.target.value });
  };

  const handleMoveContent = (direction) => {
    moveItem(content.id, 'content', sectionId, direction);
  };

  const handleDeleteContent = () => {
    deleteItem(content.id, 'content', sectionId);
  };

  const canMoveUp = contentIndex > 1;
  const canMoveDown = contentIndex < totalContent;

  return (
    <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-inner border border-primary group transition-all duration-150 hover:shadow-md hover:border-orange-500 ease-in-out">
      {/* Connecting line to the previous content block or section's main line */}
      {/* <div className="absolute -left-4 sm:-left-6 top-0 bottom-0 w-px bg-primary" /> */}
      {/* <div className="absolute -left-4 sm:-left-6 top-4 w-4 sm:w-6 h-px bg-primary" /> */}

      {/* Move Up/Down Buttons and Delete for Content */}
      <div className="flex flex-col items-center space-y-0.5 mt-1">
        <button
          onClick={() => handleMoveContent('up')}
          disabled={!canMoveUp}
          className={`p-0.5 rounded-full ${canMoveUp ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50 cursor-not-allowed'} transition-colors duration-200`}
          title="Move Content Up"
        >
          <ArrowUp className="h-4 w-4 text-primary" />
        </button>
        <button
          onClick={() => handleMoveContent('down')}
          disabled={!canMoveDown}
          className={`p-0.5 rounded-full ${canMoveDown ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50 cursor-not-allowed'} transition-colors duration-200`}
          title="Move Content Down"
        >
          <ArrowDown className="h-4 w-4 text-primary" />
        </button>
        <button
          onClick={handleDeleteContent}
          className="p-1 mt-1 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white shadow-sm transition-colors duration-200"
          title="Delete Content"
        >
          <Trash className="h-3.5 w-3.5" />
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        className="flex-grow min-h-[120px] sm:min-h-[100px] bg-transparent text-primary rounded-lg p-3 text-base resize-y outline-none transition-colors duration-200 focus:ring-1"
        placeholder="Start writing your content here..."
        rows={1} // Start with 1 row, let JS handle resizing
      />
    </div>
  );
};

export default ContentArea;
