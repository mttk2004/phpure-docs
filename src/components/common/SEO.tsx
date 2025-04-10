import { useTranslation } from 'react-i18next';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  slug?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

export function SEO({
  title,
  description,
  keywords,
  ogImage = '/og-default.jpg',
  ogUrl,
  slug,
  type = 'website',
  article
}: SEOProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const siteName = 'PHPure Documentation';
  const baseUrl = 'https://phpure-docs.example.com';
  const url = slug ? `${baseUrl}/${slug}` : ogUrl || baseUrl;

  const defaultDescription = t('seo.defaultDescription', 'Framework PHP nhẹ nhàng và mạnh mẽ dành cho ứng dụng hiện đại');
  const finalDescription = description || defaultDescription;
  const finalTitle = `${title} | ${siteName}`;

  return (
    <>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Hỗ trợ ngôn ngữ - Giúp Google hiểu trang nhiều ngôn ngữ */}
      <link rel="alternate" href={`${baseUrl}/${slug}`} hrefLang={currentLanguage} />
      <link rel="alternate" href={`${baseUrl}/${currentLanguage === 'vi' ? 'en' : 'vi'}/${slug}`} hrefLang={currentLanguage === 'vi' ? 'en' : 'vi'} />
      <link rel="alternate" href={`${baseUrl}/${slug}`} hrefLang="x-default" />

      {/* Open Graph tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={currentLanguage === 'vi' ? 'vi_VN' : 'en_US'} />

      {/* Twitter Card data */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />

      {/* Article specific metadata */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data - Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'TechArticle' : 'WebSite',
          headline: title,
          description: finalDescription,
          url: url,
          name: siteName,
          ...(type === 'article' && article && {
            datePublished: article.publishedTime,
            dateModified: article.modifiedTime || article.publishedTime,
          })
        })}
      </script>
    </>
  );
}

export default SEO;
