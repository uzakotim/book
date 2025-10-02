"use client";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BookEditor from "./_components/BookEditor";

// ---------- Helpers ----------
const generateUniqueId = () => uuidv4();

const deepCopy = (data) => JSON.parse(JSON.stringify(data));

// Reusable move logic
const performMove = (list, itemId, dir) => {
  const index = list.findIndex((item) => item.id === itemId);
  if (index === -1) return list;

  const newIndex = dir === "up" ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= list.length) return list;

  const [movedItem] = list.splice(index, 1);
  list.splice(newIndex, 0, movedItem);
  return list;
};

// ---------- Handlers ----------
const handleMoveItem = (setBookData) => (id, type, parentId, direction) => {
  setBookData((prevBookData) => {
    const newBookData = deepCopy(prevBookData);

    if (type === "chapter") {
      return performMove(newBookData, id, direction);
    }

    if (type === "section") {
      const chapter = newBookData.find((ch) => ch.id === parentId);
      if (chapter) {
        chapter.sections = performMove(chapter.sections, id, direction);
      }
      return newBookData;
    }

    if (type === "content") {
      newBookData.forEach((ch) => {
        ch.sections.forEach((sec) => {
          if (sec.id === parentId) {
            sec.content = performMove(sec.content, id, direction);
          }
        });
      });
    }

    return newBookData;
  });
};

const handleDeleteItem = (setBookData) => (id, type, parentId) => {
  if (
    !window.confirm(
      `Are you sure you want to delete this ${type}? This action cannot be undone.`
    )
  ) {
    return;
  }

  setBookData((prevBookData) => {
    const newBookData = deepCopy(prevBookData);

    if (type === "chapter") {
      return newBookData.filter((ch) => ch.id !== id);
    }

    if (type === "section") {
      const chapter = newBookData.find((ch) => ch.id === parentId);
      if (chapter) {
        chapter.sections = chapter.sections.filter((sec) => sec.id !== id);
      }
      return newBookData;
    }

    if (type === "content") {
      newBookData.forEach((ch) => {
        ch.sections.forEach((sec) => {
          if (sec.id === parentId) {
            sec.content = sec.content.filter((cont) => cont.id !== id);
          }
        });
      });
    }

    return newBookData;
  });
};

// ---------- Component ----------
export default function Home() {
  const [bookData, setBookData] = useState([
    {
      id: generateUniqueId(),
      type: "chapter",
      name: "Introduction to the Great Novel",
      sections: [
        {
          id: generateUniqueId(),
          type: "section",
          name: "The Spark of an Idea",
          content: [
            {
              id: generateUniqueId(),
              type: "content",
              text: "Every great journey begins with a single step...",
            },
            {
              id: generateUniqueId(),
              type: "content",
              text: "The initial concept was simple: a forgotten relic...",
            },
          ],
        },
        {
          id: generateUniqueId(),
          type: "section",
          name: "Crafting the World",
          content: [
            {
              id: generateUniqueId(),
              type: "content",
              text: "Building the world of Aerthos was a meticulous process...",
            },
          ],
        },
      ],
    },
    {
      id: generateUniqueId(),
      type: "chapter",
      name: "The Protagonist's Journey",
      sections: [
        {
          id: generateUniqueId(),
          type: "section",
          name: "Elara's Awakening",
          content: [
            {
              id: generateUniqueId(),
              type: "content",
              text: "Elara, initially a timid scholar, was thrust into circumstances...",
            },
          ],
        },
        {
          id: generateUniqueId(),
          type: "section",
          name: "First Encounters",
          content: [
            {
              id: generateUniqueId(),
              type: "content",
              text: "Her journey introduced her to a colorful cast of characters...",
            },
          ],
        },
      ],
    },
  ]);

  const updateBookData = useCallback((newData) => setBookData(newData), []);
  const moveItem = useCallback((id, type, parentId, direction) => {
    handleMoveItem(setBookData)(id, type, parentId, direction);
    }, []);

    const deleteItem = useCallback((id, type, parentId) => {
      handleDeleteItem(setBookData)(id, type, parentId);
    }, []);
  return (
    <div className="min-h-screen w-full bg-white text-gray-100 font-sans">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-20">
        <BookEditor
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
