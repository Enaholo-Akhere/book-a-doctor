/**
 * Renders schema.org structured data for search engines. Escapes "<" so
 * text from the database (a doctor's bio, say) can't close the script tag.
 */
const JsonLd = ({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
);

export default JsonLd;
