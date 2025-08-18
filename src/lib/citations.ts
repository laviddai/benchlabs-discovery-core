export interface CitationData {
  title: string;
  authors?: string[];
  journal?: string;
  year?: string;
  publicationDate?: string;
  url: string;
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
}

export const formatCitation = (data: CitationData, format: 'bibtex' | 'apa' | 'mla'): string => {
  const { title, authors = [], journal, year, publicationDate, url, doi } = data;
  const yearToUse = year || (publicationDate ? new Date(publicationDate).getFullYear().toString() : new Date().getFullYear().toString());
  const authorsText = authors.length > 0 ? authors.join(', ') : 'Unknown Author';

  switch (format) {
    case 'bibtex':
      const key = title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20) + yearToUse;
      return `@article{${key},
  title={${title}},
  author={${authorsText}},
  journal={${journal || 'Unknown Journal'}},
  year={${yearToUse}},
  url={${url}}${doi ? `,\n  doi={${doi}}` : ''}
}`;

    case 'apa':
      const apaAuthors = authors.length > 0 ? `${authorsText}. ` : '';
      const apaJournal = journal ? ` ${journal}.` : '';
      return `${apaAuthors}(${yearToUse}). ${title}.${apaJournal} Retrieved from ${url}`;

    case 'mla':
      const mlaAuthors = authors.length > 0 ? `${authorsText}. ` : '';
      const mlaJournal = journal ? ` ${journal},` : '';
      return `${mlaAuthors}"${title}."${mlaJournal} ${yearToUse}. Web. ${new Date().toLocaleDateString()}.`;

    default:
      return '';
  }
};

export const generateCitationKey = (title: string, year: number): string => {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20) + year;
};