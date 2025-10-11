"use client";
import { useCallback, useEffect, useState } from "react";
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
const handleMoveItem = (setChapters, setSections, setContents, updatePositionsInConvex) => 
  (id, type, parentId, direction) => {

  const updatePositions = (items, filterFn) => {
    // Only reorder within the same parent (if filterFn exists)
    const filtered = filterFn ? items.filter(filterFn) : items;
    return items.map((item) => ({
      ...item,
      position: filtered.findIndex(f => f.id === item.id),
    }));
  };

  if (type === "chapter") {
    setChapters((prev) => {
      const newList = performMove([...prev], id, direction);
      const updated = updatePositions(newList);
      // TODO: UPDATE IN DB
      // updatePositionsInConvex("chapter", updated);
      return updated;
    });
  }

  if (type === "section") {
    setSections((prev) => {
      const newList = performMove(
        [...prev],
        id,
        direction,
        (item) => item.chapterId === parentId
      );
      const updated = updatePositions(newList, (item) => item.chapterId === parentId);
      // TODO: UPDATE IN DB
      // updatePositionsInConvex("section", updated);
      return updated;
    });
  }

  if (type === "content") {
    setContents((prev) => {
      const newList = performMove(
        [...prev],
        id,
        direction,
        (item) => item.sectionId === parentId
      );
      const updated = updatePositions(newList, (item) => item.sectionId === parentId);
      // TODO: UPDATE IN DB
      // updatePositionsInConvex("content", updated);
      return updated;
    });
  }
};
// const updatePositionsInConvex = async (type, items) => {
//   // Filter to only the moved group if you prefer
//   const updates = items.map(item => ({
//     id: item.id,
//     position: item.position,
//   }));

//   // Example mutation
//   if (type === "chapter") await convex.mutations.chapters.updatePositions({ updates });
//   if (type === "section") await convex.mutations.sections.updatePositions({ updates });
//   if (type === "content") await convex.mutations.contents.updatePositions({ updates });
// };

const handleDeleteItem = (setChapters, setSections, setContents, deleteFromConvex) => 
  async (id, type) => {

  if (
    !globalThis.confirm(
      `Are you sure you want to delete this ${type}? This action cannot be undone.`
    )
  ) {
    return;
  }

  if (type === "chapter") {
    let deletedSectionIds = [];

    // Delete locally
    setChapters(prev => prev.filter(ch => ch.id !== id));

    setSections(prevSecs => {
      const sectionsToDelete = prevSecs.filter(sec => sec.chapterId === id);
      deletedSectionIds = sectionsToDelete.map(sec => sec.id);
      return prevSecs.filter(sec => sec.chapterId !== id);
    });

    setContents(prevConts =>
      prevConts.filter(cont => !deletedSectionIds.includes(cont.sectionId))
    );

    // Delete remotely
    // TODO: DELETE FROM DB
    await deleteFromConvex("chapter", id, deletedSectionIds);
    return;
  }

  if (type === "section") {
    let deletedContentIds = [];

    setSections(prev => prev.filter(sec => sec.id !== id));

    setContents(prevConts => {
      const contentsToDelete = prevConts.filter(cont => cont.sectionId === id);
      deletedContentIds = contentsToDelete.map(cont => cont.id);
      return prevConts.filter(cont => cont.sectionId !== id);
    });

    // TODO: DELETE FROM DB
    // await deleteFromConvex("section", id, deletedContentIds);
    return;
  }

  if (type === "content") {
    setContents(prev => prev.filter(cont => cont.id !== id));
    // TODO: DELETE FROM DB
    // await deleteFromConvex("content", id);
  }
};

// ---------- Component ----------
export default function Home() {
  // READ FROM DB

const [chapters, setChapters] = useState([
    { id: "chapter-1", name: "Introduction to the Great Novel", position: 0 },
    { id: "chapter-2", name: "The Protagonist's Journey", position: 1 },
  ]);

  const [sections, setSections] = useState([
    { id: "section-1", chapterId: "chapter-1", name: "The Spark of an Idea", position: 0 },
    { id: "section-2", chapterId: "chapter-1", name: "Crafting the World", position: 1 },
    { id: "section-3", chapterId: "chapter-2", name: "Elara's Awakening", position: 0 },
    { id: "section-4", chapterId: "chapter-2", name: "First Encounters", position: 1 },
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
          moveItem={moveItem}
          deleteItem={deleteItem}
          generateUniqueId={generateUniqueId}
        />
      </main>
    </div>
  );
}
