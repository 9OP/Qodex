import sanitizeHtml from 'sanitize-html';


export default function sanitize(input: string): string {
  // Super restrictive set (can be refined for more security)
  const sanitazingHTMLOptions = {
    allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe'],
    allowedAttributes: {
      a: ['href'],
    },
  };

  return sanitizeHtml(input, sanitazingHTMLOptions);
}
