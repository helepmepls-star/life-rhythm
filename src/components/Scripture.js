import React, { useEffect, useState } from "react";

// Map common abbreviations to full book names
const bookMap = {
  "Gen": "Genesis",
  "Ex": "Exodus",
  "Lev": "Leviticus",
  "Num": "Numbers",
  "Deut": "Deuteronomy",
  "Josh": "Joshua",
  "Judg": "Judges",
  "Ruth": "Ruth",
  "1Sam": "1Samuel",
  "2Sam": "2Samuel",
  "1Kgs": "1Kings",
  "2Kgs": "2Kings",
  "1Chr": "1Chronicles",
  "2Chr": "2Chronicles",
  "Ezra": "Ezra",
  "Neh": "Nehemiah",
  "Est": "Esther",
  "Job": "Job",
  "Ps": "Psalms",
  "Prov": "Proverbs",
  "Eccl": "Ecclesiastes",
  "Song": "SongofSolomon",
  "Isa": "Isaiah",
  "Jer": "Jeremiah",
  "Lam": "Lamentations",
  "Ezek": "Ezekiel",
  "Dan": "Daniel",
  "Hos": "Hosea",
  "Joel": "Joel",
  "Amos": "Amos",
  "Obad": "Obadiah",
  "Jonah": "Jonah",
  "Mic": "Micah",
  "Nah": "Nahum",
  "Hab": "Habakkuk",
  "Zeph": "Zephaniah",
  "Hag": "Haggai",
  "Zech": "Zechariah",
  "Mal": "Malachi",
  "Matt": "Matthew",
  "Mark": "Mark",
  "Luke": "Luke",
  "John": "John",
  "Acts": "Acts",
  "Rom": "Romans",
  "1Cor": "1Corinthians",
  "2Cor": "2Corinthians",
  "Gal": "Galatians",
  "Eph": "Ephesians",
  "Phil": "Philippians",
  "Col": "Colossians",
  "1Thess": "1Thessalonians",
  "2Thess": "2Thessalonians",
  "1Tim": "1Timothy",
  "2Tim": "2Timothy",
  "Titus": "Titus",
  "Phlm": "Philemon",
  "Heb": "Hebrews",
  "Jas": "James",
  "1Pet": "1Peter",
  "2Pet": "2Peter",
  "1Jn": "1John",
  "2Jn": "2John",
  "3Jn": "3John",
  "Jude": "Jude",
  "Rev": "Revelation"
};

// Load scripture from local Bible JSON files
export default function Scripture({ reference }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = reference || "John 3:16";
    setLoading(true);
    setError(null);

    // Parse reference: e.g., "Ps 24:7" -> book: "Ps", chapter: "24", verse: "1"
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (!match) {
      setError("Invalid reference format. Use 'Book Chapter:Verse'");
      setLoading(false);
      return;
    }
    let [, book, chapter, verse] = match;

    // Map abbreviation to full name
    const fullBook = bookMap[book] || book;

    // Load the book JSON
    import(`../data/${fullBook}.json`)
      .then((bibleBook) => {
        const chapters = bibleBook.chapters;
        const chap = chapters.find(c => c.chapter === chapter);
        if (!chap) throw new Error(`Chapter ${chapter} not found in ${fullBook}`);
        const vers = chap.verses.find(v => v.verse === verse);
        if (!vers) throw new Error(`Verse ${verse} not found in ${fullBook} ${chapter}`);
        setText(vers.text);
      })
      .catch((err) => {
        console.error("Scripture load error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [reference]);

  if (loading) return <p>Loading scripture...</p>;
  if (error) return <p>Error loading scripture: {error}</p>;
  return (
    <div className="scripture">
      <h3>Scripture</h3>
      <p>{text || "No scripture available."}</p>
      {reference && <p className="ref">{reference}</p>}
    </div>
  );
}
