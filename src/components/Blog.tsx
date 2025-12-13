import React from 'react';
import articlesData from '../data/articles.json';

interface Article {
  title: string;
  summary: string;
  tags: string[];
  link: string;
}

const Blog = () => {
  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-lightest mb-12 flex items-center">
          <span className="text-teal mr-2">Articles & Writing</span>
          <span className="h-px bg-slate-700 flex-grow ml-4 max-w-xs"></span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {(articlesData as Article[]).map((article, index) => (
            <a key={index} href={article.link} target="_blank" rel="noreferrer" className="group block">
              <div className="bg-navy-800 p-8 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-navy-700 h-full flex flex-col">
                <h3 className="text-xl font-bold text-slate-lightest mb-3 group-hover:text-teal transition-colors">{article.title}</h3>
                <p className="text-slate-light mb-6 flex-grow leading-relaxed">
                  {article.summary}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {article.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono text-teal border border-teal/30 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
