import React from 'react';
import EditableText from './EditableText';
import ContentArea from './ContentArea';
import { Plus, ArrowUp, ArrowDown, Trash } from 'lucide-react';
import PropTypes from 'prop-types';

const SectionCard = ({
  chapterId,
  section,
  sectionIndex,
  totalSections,
  chapterNumber,
  updateSection,
  updateContent,
  moveItem,
  deleteItem,
  addContent,
}) => {
  // ---------- Handlers ----------
  const handleSectionNameChange = (newName) => {
    updateSection(section.id, { name: newName });
  };

  const handleMoveSection = (direction) => {
    moveItem(section.id, 'section', chapterId, direction);
  };

  const handleDeleteSection = () => {
    deleteItem(section.id, 'section', chapterId);
  };

  const handleAddContent = () => {
    addContent(section.id);
  };

  const canMoveUp = sectionIndex > 1;
  const canMoveDown = sectionIndex < totalSections;

  // ---------- Render ----------
  return (
    <div className="relative bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-primary group transition-all duration-200 hover:shadow-lg hover:border-emerald-500 ease-in-out">
      {/* Section Header */}
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
              className={`p-1 rounded-full ${
                canMoveUp
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-white/5 opacity-50 cursor-not-allowed'
              } transition-colors duration-200`}
              title="Move Section Up"
            >
              <ArrowUp className="h-4 w-4 text-primary" />
            </button>
            <button
              onClick={() => handleMoveSection('down')}
              disabled={!canMoveDown}
              className={`p-1 rounded-full ${
                canMoveDown
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-white/5 opacity-50 cursor-not-allowed'
              } transition-colors duration-200`}
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

      {/* Content Blocks */}
      <div className="relative pl-4 sm:pl-6 border-l-2 border-primary space-y-3 pt-3">
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

        {/* Add Content Button */}
        <div className="flex justify-end mt-5 pr-3">
          <button
            onClick={handleAddContent}
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

SectionCard.propTypes = {
  chapterId: PropTypes.string.isRequired,
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  sectionIndex: PropTypes.number.isRequired,
  totalSections: PropTypes.number.isRequired,
  chapterNumber: PropTypes.number.isRequired,
  updateSection: PropTypes.func.isRequired,
  updateContent: PropTypes.func.isRequired,
  moveItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  addContent: PropTypes.func.isRequired,
};

export default SectionCard;