import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ChapterCard from './ChapterCard';
import { Plus } from 'lucide-react';

const BookEditor = ({
  chapters,
  sections,
  contents,
  setChapters,
  setSections,
  setContents,
  moveItem,
  deleteItem,
  generateUniqueId,
}) => {
  // ----------- Combine normalized data for rendering ----------
  const bookData = useMemo(() => {
    return chapters.map((chapter) => ({
      ...chapter,
      sections: sections
        .filter((s) => s.chapterId === chapter.id)
        .map((section) => ({
          ...section,
          content: contents.filter((c) => c.sectionId === section.id),
        })),
    }));
  }, [chapters, sections, contents]);

  // ----------- Updaters ----------
  const updateChapter = (chapterId, data) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, ...data } : ch))
    );
  };

  const updateSection = (sectionId, data) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === sectionId ? { ...sec, ...data } : sec))
    );
  };

  const updateContent = (contentId, data) => {
    setContents((prev) =>
      prev.map((cont) => (cont.id === contentId ? { ...cont, ...data } : cont))
    );
  };

  // ----------- Add Handlers ----------
  const addChapter = () => {
    const newChapter = {
      id: generateUniqueId(),
      name: 'New Chapter',
    };
    setChapters((prev) => [...prev, newChapter]);
  };

  const addSection = (chapterId) => {
    const newSection = {
      id: generateUniqueId(),
      chapterId,
      name: 'New Section',
    };
    setSections((prev) => [...prev, newSection]);
  };

  const addContent = (sectionId) => {
    const newContent = {
      id: generateUniqueId(),
      sectionId,
      text: 'New Content...',
    };
    setContents((prev) => [...prev, newContent]);
  };

  // ----------- Render ----------
  return (
    <div className="space-y-6 lg:space-y-8 max-w-6xl mx-auto py-8">
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
            addSection={addSection}
            addContent={addContent}
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

BookEditor.propTypes = {
  chapters: PropTypes.array.isRequired,
  sections: PropTypes.array.isRequired,
  contents: PropTypes.array.isRequired,
  setChapters: PropTypes.func.isRequired,
  setSections: PropTypes.func.isRequired,
  setContents: PropTypes.func.isRequired,
  moveItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  generateUniqueId: PropTypes.func.isRequired,
};

export default BookEditor;