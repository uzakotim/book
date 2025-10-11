"use client";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BookEditor from "./_components/BookEditor";

// ---------- Helpers ----------
const generateUniqueId = () => uuidv4();

const deepCopy = (data) => structuredClone(data);
// ---------- Helpers ----------

const performMove = (list, itemId, dir, filterFn = () => true) => {
  // Filter to only the relevant items (e.g., sections within the same chapter)
  const filteredList = list.filter(filterFn);
  const index = filteredList.findIndex((item) => item.id === itemId);
  if (index === -1) return list;

  const newIndex = dir === "up" ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= filteredList.length) return list;

  // Move item inside the filtered list
  const [movedItem] = filteredList.splice(index, 1);
  filteredList.splice(newIndex, 0, movedItem);

  // Merge order back into the full list (preserve other unrelated items)
  const reorderedIds = filteredList.map((i) => i.id);
  const reorderedList = [
    ...filteredList,
    ...list.filter((i) => !reorderedIds.includes(i.id)),
  ];
  return reorderedList;
};

// ---------- Handlers ----------
const handleMoveItem = (setChapters, setSections, setContents) => 
  (id, type, parentId, direction) => {

  if (type === "chapter") {
    setChapters((prev) => performMove(deepCopy(prev), id, direction));
  }

  if (type === "section") {
    setSections((prev) => {
      const newList = performMove(
        deepCopy(prev),
        id,
        direction,
        (item) => item.chapterId === parentId // Only reorder within same chapter
      );
      return newList;
    });
  }

  if (type === "content") {
    setContents((prev) => {
      const newList = performMove(
        deepCopy(prev),
        id,
        direction,
        (item) => item.sectionId === parentId // Only reorder within same section
      );
      return newList;
    });
  }
};
const handleDeleteItem = (setChapters, setSections, setContents) => 
  (id, type) => {

  if (
    !globalThis.confirm(
      `Are you sure you want to delete this ${type}? This action cannot be undone.`
    )
  ) {
    return;
  }

  if (type === "chapter") {
    setChapters((prev) => prev.filter((ch) => ch.id !== id));

    // Cascade delete: sections + contents under this chapter
    setSections((prevSecs) => prevSecs.filter((sec) => sec.chapterId !== id));
    setContents((prevConts, _, allSections) =>
      prevConts.filter(
        (cont) =>
          !allSections.some(
            (sec) => sec.chapterId === id && sec.id === cont.sectionId
          )
      )
    );
  }

  if (type === "section") {
    setSections((prev) => prev.filter((sec) => sec.id !== id));
    // Cascade delete contents under this section
    setContents((prev) => prev.filter((cont) => cont.sectionId !== id));
  }

  if (type === "content") {
    setContents((prev) => prev.filter((cont) => cont.id !== id));
  }
};

// ---------- Component ----------
export default function Home() {

 const [chapters, setChapters] = useState([
    {
      id: "chapter-1",
      name: "Introduction to the Great Novel",
    },
    {
      id: "chapter-2",
      name: "The Protagonist's Journey",
    },
  ]);

  const [sections, setSections] = useState([
    {
      id: "section-1",
      chapterId: "chapter-1",
      name: "The Spark of an Idea",
    },
    {
      id: "section-2",
      chapterId: "chapter-1",
      name: "Crafting the World",
    },
    {
      id: "section-3",
      chapterId: "chapter-2",
      name: "Elara's Awakening",
    },
    {
      id: "section-4",
      chapterId: "chapter-2",
      name: "First Encounters",
    },
  ]);

  const [contents, setContents] = useState([
    {
      id: "content-1",
      sectionId: "section-1",
      text: "Every great journey begins with a single step...",
    },
    {
      id: "content-2",
      sectionId: "section-1",
      text: "A journey of a thousand miles begins with a single step...",
    },
    {
      id: "content-3",
      sectionId: "section-2",
      text: "Building the world of Aerthos was a meticulous process...",
    },
    {
      id: "content-4",
      sectionId: "section-3",
      text: "Elara, initially a timid scholar, was thrust into circumstances...",
    },
    {
      id: "content-5",
      sectionId: "section-4",
      text: "Her journey introduced her to a colorful cast of characters...",
    },
  ]);

  const bookData = chapters.map((chapter) => ({
    ...chapter,
    sections: sections
      .filter((sec) => sec.chapterId === chapter.id)
      .map((sec) => ({
        ...sec,
        content: contents.filter((cont) => cont.sectionId === sec.id),
      })),
  }));
  const updateBookData = useCallback((newData) => setBookData(newData), []);
  const moveItem = handleMoveItem(setChapters, setSections, setContents);
  const deleteItem = handleDeleteItem(setChapters, setSections, setContents);
  return (
    <div className="min-h-screen w-full bg-white text-gray-100 font-sans">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-20">
        <BookEditor
          chapters={chapters}
          sections={sections}
          contents={contents}
          setChapters={setChapters}
          setSections={setSections}
          setContents={setContents}
          bookData={bookData}
          updateBookData={updateBookData}
          moveItem={moveItem}
          deleteItem={deleteItem}
          generateUniqueId={generateUniqueId}
        />
      </main>
    </div>
  );
}
