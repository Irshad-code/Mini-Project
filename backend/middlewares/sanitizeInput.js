const sanitizeHtml = require("sanitize-html");

function sanitizeInput(req, res, next) {
  // Iterate over the request body fields and sanitize them
  for (const field in req.body) {
    if (typeof req.body[field] === "string") {
      req.body[field] = sanitizeHtml(req.body[field], {
        allowedTags: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p",
          "blockquote",
          "code",
          "pre",
          "strong",
          "em",
          "u",
          "a",
          "ul",
          "ol",
          "li",
          "br",
          "b",
          "i",
          "span",
          "div",
          "img",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "caption",
          "hr",
          "sup",
          "sub",
          "mark",
        ],
        allowedAttributes: {
          a: ["href", "title", "target"],
          img: ["src", "alt", "title", "width", "height"],
          "*": ["class", "id", "style", "data-*"], // Allow common attributes on all tags
        },
        allowedStyles: {
          "*": {
            // Allow some safe inline styles
            color: [
              /^#(0x)?[0-9a-f]+$/i,
              /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/,
            ],
            "text-align": [/^left$/, /^right$/, /^center$/],
            "font-size": [/^\d+(?:px|em|rem|%)$/],
            "font-weight": [/^\d{1,3}$/],
          },
        },
        // Additional options to remove potentially unsafe URLs (JavaScript URLs, etc.)
        allowProtocolRelative: false, // Don't allow '//' URLs
        allowedSchemes: ["http", "https", "mailto"], // Only allow these URL schemes
      });
    }
  }
  next(); // Continue to the next middleware or route handler
}

module.exports = sanitizeInput;
