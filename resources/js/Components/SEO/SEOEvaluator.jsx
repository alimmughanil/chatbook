import { htmlParse } from "@/utils/format";
import useLang from "@/utils/useLang";
import { useEffect, useState } from "react";

function SEOEvaluator({ data, keyword, lang }) {
  const [keywordData, setKeywordData] = useState(keyword || '');
  const [score, setScore] = useState(null);

  const calculateSeoScore = (keyword, seoData) => {
    if (!keyword) return 0;

    const keywordLower = keyword.toLowerCase();
    const { title, description, slug } = seoData;
    let points = 0;

    if (title.includes(keywordLower)) points += 30;
    if (slug && slug.includes(keywordLower)) points += 30; 
    if (description.includes(keywordLower)) points += 30;

    if (title.length >= 50 && title.length <= 60) points += 5;
    if (description.length >= 110 && description.length <= 160) points += 5;

    return points;
  };

  const evaluate = (keyword) => {
    setKeywordData(keyword);
    const seoData = getSeoData(data, lang);

    const points = calculateSeoScore(keyword, seoData);

    const results = {
      inTitle: seoData.title.includes(keyword.toLowerCase()),
      inSlug: seoData.slug ? seoData.slug.includes(keyword.toLowerCase()) : false,
      inDescription: seoData.description.includes(keyword.toLowerCase()),
      titleLength: seoData.title.length,
      descriptionLength: seoData.description.length,
      contentLength: seoData.content.length,
    };

    const keywordSuggestions = extractKeywordSuggestions(seoData);

    setScore({ points, results, keywordSuggestions });
  };

  useEffect(() => {
    if (keyword) {
      evaluate(keyword);
      setKeywordData(keyword)
    }

    return () => { }
  }, [keyword])

  const handleKeywordChange = (e) => {
    const newKeyword = e.target.value;
    setKeywordData(newKeyword);
    evaluate(newKeyword);
  }

  return (
    <div className="p-1 bg-white shadow rounded space-y-1">
      <h2 className="text-xl font-semibold">🔍 Evaluasi SEO {useLang(`lang.${lang}`)}</h2>
      <div className="flex items-center gap-2 w-full">
        <p>Keyword:</p>
        <input type="text" value={keywordData} onChange={handleKeywordChange} className="input input-sm input-bordered rounded-md w-full text-base" />
      </div>

      {score && (
        <div className="space-y-1 mt-2">
          <p className="font-bold">Skor SEO: {score.points} / 100</p>
          <ul className="list-disc list-inside">
            <li className={score.results.inTitle ? "text-green-600" : "text-red-600"}>
              Keyword di {`name_${lang}` in data ? 'Nama' : 'Judul'}: {score.results.inTitle ? "✅ Ya" : "❌ Tidak"}
            </li>
            {data?.[`slug_${lang}`] && (
              <li className={score.results.inSlug ? "text-green-600" : "text-red-600"}>
                Keyword di Slug: {score.results.inSlug ? "✅ Ya" : "❌ Tidak"}
              </li>
            )}
            <li className={score.results.inDescription ? "text-green-600" : "text-red-600"}>
              Keyword di SEO Deskripsi: {score.results.inDescription ? "✅ Ya" : "❌ Tidak"}
            </li>
            <li className={score.results.titleLength >= 50 && score.results.titleLength <= 60 ? "text-green-600" : "text-yellow-600"}>
              Panjang {`name_${lang}` in data ? 'Nama' : 'Judul'}: {score.results.titleLength} karakter
            </li>
            <li className={score.results.descriptionLength >= 110 && score.results.descriptionLength <= 160 ? "text-green-600" : "text-yellow-600"}>
              Panjang SEO Deskripsi: {score.results.descriptionLength} karakter
            </li>
            {score.results.contentLength ? (
              <li className={""}>
                Panjang Konten: {score.results.contentLength} karakter
              </li>
            ): null}
          </ul>
        </div>
      )}
      <div className="mt-4">
        <p className="font-bold text-sm">💡 Rekomendasi Keyword:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {score?.keywordSuggestions.map((kw, index) => (
            <button
              type="button"
              key={index}
              onClick={() => evaluate(kw.phrase)}
              className="bg-gray-200 rounded hover:bg-blue-100 select-all"
            >
              <span className="px-2 py-1">
                {kw.phrase}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const getSeoData = (data, lang) => {
  let column = {
    title: `title_${lang}`,
    slug: `slug_${lang}`,
    description: `seo_description_${lang}`,
    content: `description_${lang}`,
  }

  if (`short_description_${lang}` in data) {
    column.description = `short_description_${lang}`;
  }

  if (`name_${lang}` in data) {
    column.description = `name_${lang}`;
  }

  const title = data?.[column.title]?.toLowerCase() ?? '';
  const slug = data?.[column.slug]?.toLowerCase() ?? '';
  const description = data?.[column.description]?.toLowerCase() ?? '';
  const content = htmlParse(data?.[column.content]?.toLowerCase() || '');

  return { title, slug, description, content };
}

const extractKeywordSuggestions = (data) => {
  const stopWords = new Set([
    "dan", "untuk", "yang", "dari", "dengan", "adalah", "di", "ke", "ini", "itu", "the", "of", "in", "on", "a", "an", "to", "is", "are", "by", "at", "be", "or", "as", "from", "for", "with", "this", "that"
  ]);

  const { title, slug, description, content } = data;
  const allText = `${title} ${slug.replace(/-/g, " ")} ${content}`.toLowerCase();
  const words = allText.match(/\b[a-z0-9]+\b/g) || [];

  const phraseScores = {};
  const ngramLengths = [1, 2, 3];

  ngramLengths.forEach(n => {
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(" ");

      if (n === 1 && stopWords.has(phrase)) {
        continue;
      }

      const phraseWords = phrase.trim().split(/\s+/);
      const nonStopWords = phraseWords.filter(word => !stopWords.has(word));

      if (nonStopWords.length === 0) {
        continue;
      }

      if (!phraseScores[phrase]) {
        phraseScores[phrase] = {
          frequency: 0,
          bonus: 0,
          totalScore: 0,
        };
      }

      phraseScores[phrase].frequency += 1;
    }
  });

  for (const phrase in phraseScores) {
    let bonus = 0;

    if (title.includes(phrase)) bonus += 30;
    if (slug.includes(phrase)) bonus += 30;
    if (description.includes(phrase)) bonus += 15;

    phraseScores[phrase].bonus = bonus;
    phraseScores[phrase].totalScore = bonus + (phraseScores[phrase].frequency / 5);
  }

  const allSuggestions = Object.entries(phraseScores)
    .filter(([phrase, data]) => phrase.length >= 3 && (data.frequency > 1 || data.bonus > 0))
    .map(([phrase, data]) => ({
      phrase,
      score: data.totalScore,
      isOneGram: !phrase.includes(' ')
    }));

  const oneGrams = allSuggestions.filter(s => s.isOneGram);
  const multiGrams = allSuggestions.filter(s => !s.isOneGram);

  oneGrams.sort((a, b) => b.score - a.score);
  multiGrams.sort((a, b) => b.score - a.score);

  const topOneGrams = oneGrams.slice(0, 3);
  const topMultiGrams = multiGrams.slice(0, 10);

  return [...topOneGrams, ...topMultiGrams]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(data => ({
      phrase: data.phrase,
      score: data.score.toFixed(1)
    }));
};
export default SEOEvaluator;