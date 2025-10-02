import React from 'react';
import SectionCard from './SectionCard';
import EditableText from './EditableText';
import { Plus, ArrowUp, ArrowDown, Trash } from 'lucide-react';

ChapterCard.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        parentId: PropTypes.string.isRequired,
        content: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
  chapterIndex: PropTypes.number.isRequired,
  totalChapters: PropTypes.number.isRequired,
  updateChapter: PropTypes.func.isRequired,
  updateSection: PropTypes.func.isRequired,
  updateContent: PropTypes.func.isRequired,
  moveItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  generateUniqueId: PropTypes.func.isRequired,
};
const ChapterCard = ({ chapter, chapterIndex, totalChapters, updateChapter, updateSection, updateContent, moveItem, deleteItem, generateUniqueId }) => {
  const addSection = () => {
    const newSection = {
      id: generateUniqueId(),
      type: 'section',
      name: 'New Section ' + (chapter.sections.length + 1),
      parentId: chapter.id,
      content: []
    };
    updateChapter(chapter.id, { sections: [...chapter.sections, newSection] });
  };

  const handleChapterNameChange = (newName) => {
    updateChapter(chapter.id, { name: newName });
  };

  const handleMoveChapter = (direction) => {
    moveItem(chapter.id, 'chapter', null, direction);
  };

  const handleDeleteChapter = () => {
    deleteItem(chapter.id, 'chapter', null);
  };

  const canMoveUp = chapterIndex > 1;
  const canMoveDown = chapterIndex < totalChapters;

  return (
    <div 
      className="relative bg-transparent  p-6 sm:p-8 rounded-3xl mb-6 group transition-all duration-300  ease-in-out"
    >
      {/* Chapter Number and Name */}
      <div className="flex items-center mb-6 space-x-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold shadow-md">
          {chapterIndex}
        </div>
        <div className="flex-grow min-w-0">
          <EditableText
            text={chapter.name}
            onSave={handleChapterNameChange}
            className="text-3xl sm:text-4xl font-extrabold text-primary leading-tight w-full pr-12"
            placeholder="Chapter Title"
          />
        </div>
        {/* Action Buttons for Chapter */}
        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleMoveChapter('up')}
              disabled={!canMoveUp}
              className={`p-1 rounded-full ${canMoveUp ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50 cursor-not-allowed'} transition-colors duration-200`}
              title="Move Chapter Up"
            >
              <ArrowUp className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={() => handleMoveChapter('down')}
              disabled={!canMoveDown}
              className={`p-1 rounded-full ${canMoveDown ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50 cursor-not-allowed'} transition-colors duration-200`}
              title="Move Chapter Down"
            >
              <ArrowDown className="h-5 w-5 text-primary" />
            </button>
          </div>
          <button
            onClick={handleDeleteChapter}
            className="p-2 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white shadow-md transition-colors duration-200"
            title="Delete Chapter"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div 
        className="relative pl-6 sm:pl-8 space-y-4 pt-4 sm:pt-6"
      >
        {chapter.sections.map((section, secIndex) => (
          <div
            key={section.id}
            className="relative z-10 transition-all duration-200 ease-in-out rounded-2xl"
          >
            <SectionCard
              chapterId={chapter.id}
              section={section}
              sectionIndex={secIndex + 1}
              totalSections={chapter.sections.length}
              chapterNumber={chapterIndex}
              updateSection={updateSection}
              updateContent={updateContent}
              moveItem={moveItem}
              deleteItem={deleteItem}
              generateUniqueId={generateUniqueId}
            />
          </div>
        ))}

        <div className="flex justify-end mt-6 pr-4 sm:pr-6">
          <button
            onClick={addSection}
            className="flex items-center space-x-2 bg-primary/90 hover:bg-primary text-white font-semibold py-2 px-5 rounded-2xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Section</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterCard;
