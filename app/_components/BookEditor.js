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
  const updateChapter = async (chapterId, data) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId ? { ...ch, ...data } : ch
      )
    );

    // Sync with Convex
    // try {
      // await convex.mutations.chapters.update({ id: chapterId, data });
    // } catch (error) {
      // console.error("Failed to update chapter in Convex:", error);
    // }
  };

  const updateSection = async (sectionId, data) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId ? { ...sec, ...data } : sec
      )
    );

    // Sync with Convex
    // try {
      // await convex.mutations.sections.update({ id: sectionId, data });
    // } catch (error) {
      // console.error("Failed to update section in Convex:", error);
    // }
  };

  const updateContent = async (contentId, data) => {
    setContents((prev) =>
      prev.map((cont) =>
        cont.id === contentId ? { ...cont, ...data } : cont
      )
    );

    // Sync with Convex
    // try {
      // await convex.mutations.contents.update({ id: contentId, data });
    // } catch (error) {
      // console.error("Failed to update content in Convex:", error);
    // }
  };

  // ----------- Add Handlers -----------
  const addChapter = async () => {
    setChapters((prev) => {
      const newChapter = {
        id: generateUniqueId(),
        type: "chapter",
        name: "New Chapter",
        position: prev.length, // last position
      };
      const updated = [...prev, newChapter];
      // TODO: CREATE IN CONVEX
      // createInConvex("chapter", newChapter);
      return updated;
    });
  };

  const addSection = async (chapterId) => {
    setSections((prev) => {
      const chapterSections = prev.filter((s) => s.chapterId === chapterId);
      const newSection = {
        id: generateUniqueId(),
        type: "section",
        chapterId,
        name: "New Section",
        position: chapterSections.length, // next available position in this chapter
      };
      const updated = [...prev, newSection];
      // TODO: CREATE IN CONVEX
      // createInConvex("section", newSection);
      return updated;
    });
  };

  const addContent = async (sectionId) => {
    setContents((prev) => {
      const sectionContents = prev.filter((c) => c.sectionId === sectionId);
      const newContent = {
        id: generateUniqueId(),
        type: "content",
        sectionId,
        text: "New Content...",
        position: sectionContents.length, // next available position
      };
      const updated = [...prev, newContent];
      // TODO: CREATE IN CONVEX
      // createInConvex("content", newContent);
      return updated;
    });
  };

  // const createInConvex = async (type, item) => {
  //   try {
  //     if (type === "chapter") await convex.mutations.chapters.create(item);
  //     if (type === "section") await convex.mutations.sections.create(item);
  //     if (type === "content") await convex.mutations.contents.create(item);
  //   } catch (error) {
  //     console.error("Error creating item in Convex:", error);
  //   }
  // };
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