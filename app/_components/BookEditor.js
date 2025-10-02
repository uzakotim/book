import React, { useCallback } from 'react';
import ChapterCard from './ChapterCard';
import { Plus } from 'lucide-react';

const BookEditor = ({ bookData, updateBookData, moveItem, deleteItem, generateUniqueId }) => {

  const addChapter = () => {
    const newChapter = {
      id: generateUniqueId(),
      type: 'chapter',
      name: 'New Chapter ' + (bookData.length + 1),
      sections: []
    };
    updateBookData([...bookData, newChapter]);
  };

  const updateChapter = (chapterId, newChapterData) => {
    updateBookData(bookData.map(ch =>
      ch.id === chapterId ? { ...ch, ...newChapterData } : ch
    ));
  };

  const updateSection = (chapterId, sectionId, newSectionData) => {
    updateBookData(bookData.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          sections: ch.sections.map(sec =>
            sec.id === sectionId ? { ...sec, ...newSectionData } : sec
          )
        };
      }
      return ch;
    }));
  };

  const updateContent = (chapterId, sectionId, contentId, newContentData) => {
    updateBookData(bookData.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          sections: ch.sections.map(sec => {
            if (sec.id === sectionId) {
              return {
                ...sec,
                content: sec.content.map(cont =>
                  cont.id === contentId ? { ...cont, ...newContentData } : cont
                )
              };
            }
            return sec;
          })
        };
      }
      return ch;
    }));
  };

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
