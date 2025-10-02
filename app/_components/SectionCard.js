import React from 'react';
import EditableText from './EditableText';
import ContentArea from './ContentArea';
import { Plus, ArrowUp, ArrowDown, Trash } from 'lucide-react';

const SectionCard = ({ chapterId, section, sectionIndex, totalSections, chapterNumber, updateSection, updateContent, moveItem, deleteItem, generateUniqueId }) => {

  const addContent = () => {
    const newContent = {
      id: generateUniqueId(),
      type: 'content',
      text: 'Start writing your content here...',
      parentId: section.id
    };
    updateSection(chapterId, section.id, { content: [...section.content, newContent] });
  };

  const handleSectionNameChange = (newName) => {
    updateSection(chapterId, section.id, { name: newName });
  };

  const handleMoveSection = (direction) => {
    moveItem(section.id, 'section', chapterId, direction);
  };

  const handleDeleteSection = () => {
    deleteItem(section.id, 'section', chapterId);
  };

  const canMoveUp = sectionIndex > 1;
  const canMoveDown = sectionIndex < totalSections;

  return (
    <div className="relative bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-primary group transition-all duration-200 hover:shadow-lg hover:border-emerald-500 ease-in-out">
      {/* Connecting line to the previous section or chapter's main line */}
      {/* <div className="absolute -left-6 sm:-left-8 top-0 bottom-0 w-px sm:w-0.5 bg-emerald-500" /> */}
      {/* <div className="absolute -left-6 sm:-left-8 top-5 w-6 sm:w-8 h-px bg-emerald-500" /> */}

      {/* Section Number and Name */}
      <div className="flex items-center mb-4 space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
          {chapterNumber}.{sectionIndex}
        </div>
        <div className="flex-grow min-w-0">
          <EditableText
            text={section.name}
            onSave={handleSectionNameChange}
            className="text-xl sm:text-2xl font-bold text-primary leading-tight w-full pr-10"
            placeholder="Section Title"
          />
        </div>
        {/* Action Buttons for Section */}
        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleMoveSection('up')}
              disabled={!canMoveUp}
              className={`p-1 rounded-full ${canMoveUp ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50 cursor-not-allowed'} transition-colors duration-200`}
              title="Move Section Up"
            >
              <ArrowUp className="h-4 w-4 text-primary" />
            </button>
            <button
              onClick={() => handleMoveSection('down')}
              disabled={!canMoveDown}
              className={`p-1 rounded-full ${canMoveDown ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50 cursor-not-allowed'} transition-colors duration-200`}
              title="Move Section Down"
            >
              <ArrowDown className="h-4 w-4 text-primary" />
            </button>
          </div>
          <button
            onClick={handleDeleteSection}
            className="p-1.5 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white shadow-sm transition-colors duration-200"
            title="Delete Section"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div 
        className="relative pl-4 sm:pl-6 border-l-2 border-primary space-y-3 pt-3"
      >
        {section.content.map((contentBlock, contentIndex) => (
          <div
            key={contentBlock.id}
            className="relative z-10 transition-all duration-200 ease-in-out rounded-xl"
          >
            <ContentArea
              chapterId={chapterId}
              sectionId={section.id}
              content={contentBlock}
              contentIndex={contentIndex + 1}
              totalContent={section.content.length}
              updateContent={updateContent}
              moveItem={moveItem}
              deleteItem={deleteItem}
            />
          </div>
        ))}

        <div className="flex justify-end mt-5 pr-3">
          <button
            onClick={addContent}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-4 rounded-2xl shadow-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Content</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
