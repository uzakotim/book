"use client";
import BookEditor from './_components/BookEditor';
import { useCallback, useState } from 'react';


export default function Home() {
  const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  const [bookData, setBookData] = useState([
    {
      id: generateUniqueId(),
      type: 'chapter',
      name: 'Introduction to the Great Novel',
      sections: [
        {
          id: generateUniqueId(),
          type: 'section',
          name: 'The Spark of an Idea',
          content: [
            { id: generateUniqueId(), type: 'content', text: 'Every great journey begins with a single step, or in this case, a fleeting thought during a rainy afternoon. The protagonist, Elara, found herself staring out the window, a cup of lukewarm tea in her hand, as the city hummed a melancholic tune. Little did she know, this quiet moment would unravel a tapestry of adventures.' },
            { id: generateUniqueId(), type: 'content', text: 'The initial concept was simple: a forgotten relic, a hidden lineage, and a destiny reluctantly embraced. But as the world began to build in her mind, the layers of complexity grew, demanding more than just a passing glance.' }
          ]
        },
        {
          id: generateUniqueId(),
          type: 'section',
          name: 'Crafting the World',
          content: [
            { id: generateUniqueId(), type: 'content', text: 'Building the world of Aerthos was a meticulous process. From the shimmering spires of Eldoria to the shadowed alleys of Veridian, each location needed a history, a culture, and a distinct feel. The flora and fauna, the magical systems, and the political landscape all intertwined to create a living, breathing entity.' }
          ]
        }
      ]
    },
    {
      id: generateUniqueId(),
      type: 'chapter',
      name: 'The Protagonist\'s Journey',
      sections: [
        {
          id: generateUniqueId(),
          type: 'section',
          name: 'Elara\'s Awakening',
          content: [
            { id: generateUniqueId(), type: 'content', text: 'Elara, initially a timid scholar, was thrust into circumstances far beyond her comprehension. Her latent abilities began to surface, often at inconvenient times, leading to both humorous and perilous situations.' }
          ]
        },
        {
          id: generateUniqueId(),
          type: 'section',
          name: 'First Encounters',
          content: [
            { id: generateUniqueId(), type: 'content', text: 'Her journey introduced her to a colorful cast of characters: Kael, the gruff but loyal warrior; Lyra, the enigmatic sorceress; and Fimble, the mischievous forest sprite. Each encounter shaped her, challenging her preconceived notions and forging unlikely alliances.' }
          ]
        }
      ]
    }
  ]);

  const updateBookData = useCallback((newData) => {
    setBookData(newData);
  }, []);

  // This function handles moving items (chapter, section, or content)
  const moveItem = useCallback((id, type, parentId, direction) => {
    setBookData(prevBookData => {
      const newBookData = JSON.parse(JSON.stringify(prevBookData)); // Deep copy for immutable update

      const performMove = (list, itemId, dir) => {
        const index = list.findIndex(item => item.id === itemId);
        if (index === -1) return list; // Item not found

        const newIndex = dir === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= list.length) return list; // Cannot move further

        const [movedItem] = list.splice(index, 1);
        list.splice(newIndex, 0, movedItem);
        return list;
      };

      if (type === 'chapter') {
        return performMove(newBookData, id, direction);
      } else if (type === 'section') {
        const chapter = newBookData.find(ch => ch.id === parentId);
        if (chapter) {
          chapter.sections = performMove(chapter.sections, id, direction);
        }
      } else if (type === 'content') {
        newBookData.forEach(ch => {
          ch.sections.forEach(sec => {
            if (sec.id === parentId) {
              sec.content = performMove(sec.content, id, direction);
            }
          });
        });
      }
      return newBookData;
    });
  }, []);

  // This function handles deleting items (chapter, section, or content)
  const deleteItem = useCallback((id, type, parentId) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      return; // User cancelled deletion
    }

    setBookData(prevBookData => {
      const newBookData = JSON.parse(JSON.stringify(prevBookData)); // Deep copy

      if (type === 'chapter') {
        return newBookData.filter(ch => ch.id !== id);
      } else if (type === 'section') {
        const chapter = newBookData.find(ch => ch.id === parentId);
        if (chapter) {
          chapter.sections = chapter.sections.filter(sec => sec.id !== id);
        }
      } else if (type === 'content') {
        newBookData.forEach(ch => {
          ch.sections.forEach(sec => {
            if (sec.id === parentId) {
              sec.content = sec.content.filter(cont => cont.id !== id);
            }
          });
        });
      }
      return newBookData;
    });
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
