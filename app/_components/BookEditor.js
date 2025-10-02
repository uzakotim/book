import React from 'react';
import ChapterCard from './ChapterCard';
import { Plus } from 'lucide-react';

BookEditor.propTypes = {
  bookData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sections: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          content: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              type: PropTypes.string.isRequired,
              text: PropTypes.string.isRequired,
            })
          ).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  updateBookData: PropTypes.func.isRequired,
  moveItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  generateUniqueId: PropTypes.func.isRequired,
};
const BookEditor = ({ bookData, updateBookData, moveItem, deleteItem, generateUniqueId }) => {
  // Generic nested updater to reduce duplication
  const updateNested = (chapterId, sectionId, contentId, newData) => {
    updateBookData(
      bookData.map(ch => {
        if (ch.id !== chapterId) return ch;

        if (!sectionId) {
          return { ...ch, ...newData }; // update chapter
        }

        return {
          ...ch,
          sections: ch.sections.map(sec => {
            if (sec.id !== sectionId) return sec;

            if (!contentId) {
              return { ...sec, ...newData }; // update section
            }

            return {
              ...sec,
              content: sec.content.map(cont =>
                cont.id === contentId ? { ...cont, ...newData } : cont
              ),
            };
          }),
        };
      })
    );
  };

  const addChapter = () => {
    const newChapter = {
      id: generateUniqueId(),
      type: 'chapter',
      name: `New Chapter ${bookData.length + 1}`,
      sections: [],
    };
    updateBookData([...bookData, newChapter]);
  };

  // Wrappers for clarity
  const updateChapter = (chapterId, data) => updateNested(chapterId, null, null, data);
  const updateSection = (chapterId, sectionId, data) =>
    updateNested(chapterId, sectionId, null, data);
  const updateContent = (chapterId, sectionId, contentId, data) =>
    updateNested(chapterId, sectionId, contentId, data);

  return (
    <div className="space-y-6 lg:space-y-8 max-w-4xl mx-auto py-8">
      {bookData.map((chapter, index) => (
        <div
          key={chapter.id}
          className="relative z-10 transition-all duration-200 ease-in-out rounded-3xl"
        >
          <ChapterCard
            chapter={chapter}
            chapterIndex={index + 1}
            totalChapters={bookData.length}
            updateChapter={updateChapter}
            updateSection={updateSection}
            updateContent={updateContent}
            moveItem={moveItem}
            deleteItem={deleteItem}
            generateUniqueId={generateUniqueId}
          />
        </div>
      ))}

      <div className="flex justify-center mt-8">
        <button
          onClick={addChapter}
          className="flex items-center space-x-2 bg-primary/90 hover:bg-primary text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Chapter</span>
        </button>
      </div>
    </div>
  );
};

export default BookEditor;
