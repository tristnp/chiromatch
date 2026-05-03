import { defineArrayMember, defineField, defineType } from "sanity";

const richText = defineArrayMember({
  type: "block"
});

function createImageField(name = "image", title = "Image") {
  return defineField({
    name,
    title,
    type: "image",
    options: {
      hotspot: true
    },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        validation: (rule) => rule.required()
      })
    ]
  });
}

export const blogPostType = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "publishDate",
      title: "Publish date",
      type: "date",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Published", value: "published" }
        ],
        layout: "radio"
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "topic",
      title: "Topic",
      type: "string",
      options: {
        list: [
          "Symptoms",
          "Timing",
          "Insurance",
          "Choosing care",
          "Appointments",
          "Starting point",
          "Logistics",
          "Decision"
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "searchIntent",
      title: "Search intent",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      initialValue: "ChiropracticMatch"
    }),
    createImageField("featuredImage", "Featured image"),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string"
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "ctaVariant",
      title: "CTA variant",
      type: "string",
      initialValue: "match",
      options: {
        list: [
          { title: "Request Match", value: "match" },
          { title: "Browse Cities", value: "browse" }
        ],
        layout: "radio"
      }
    }),
    defineField({
      name: "relatedPosts",
      title: "Related posts",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blogPost" }]
        })
      ]
    }),
    defineField({
      name: "bodyBlocks",
      title: "Body blocks",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: "intro",
          title: "Intro",
          type: "object",
          fields: [
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [richText],
              validation: (rule) => rule.required()
            })
          ],
          preview: {
            prepare: () => ({ title: "Intro" })
          }
        }),
        defineArrayMember({
          name: "textSection",
          title: "Text section",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Section title",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [richText],
              validation: (rule) => rule.required()
            })
          ],
          preview: {
            select: { title: "title" }
          }
        }),
        defineArrayMember({
          name: "faqBlock",
          title: "FAQ block",
          type: "object",
          fields: [
            defineField({
              name: "items",
              title: "FAQs",
              type: "array",
              of: [
                defineArrayMember({
                  name: "faqItem",
                  title: "FAQ item",
                  type: "object",
                  fields: [
                    defineField({
                      name: "question",
                      title: "Question",
                      type: "string",
                      validation: (rule) => rule.required()
                    }),
                    defineField({
                      name: "answer",
                      title: "Answer",
                      type: "array",
                      of: [richText],
                      validation: (rule) => rule.required()
                    })
                  ],
                  preview: {
                    select: { title: "question" }
                  }
                })
              ]
            })
          ],
          preview: {
            prepare: () => ({ title: "FAQ block" })
          }
        }),
        defineArrayMember({
          name: "ctaBlock",
          title: "CTA block",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Button label", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "href", title: "Button link", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "title", title: "CTA title", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "accentLine",
              title: "CTA accent line",
              type: "string",
              validation: (rule) => rule.required()
            })
          ],
          preview: {
            select: { title: "title" }
          }
        }),
        defineArrayMember({
          name: "ctaBanner",
          title: "CTA banner",
          type: "object",
          fields: [
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({ name: "headline", title: "Headline", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "subheading",
              title: "Subheading",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required()
            }),
            defineField({ name: "buttonLabel", title: "Button label", type: "string" })
          ],
          preview: {
            select: { title: "headline", subtitle: "subheading" }
          }
        }),
        defineArrayMember({
          name: "relatedLinksBlock",
          title: "Related links block",
          type: "object",
          fields: [
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                defineArrayMember({
                  name: "relatedLink",
                  title: "Related link",
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "href", title: "Link", type: "string", validation: (rule) => rule.required() }),
                    defineField({
                      name: "description",
                      title: "Description",
                      type: "text",
                      rows: 2,
                      validation: (rule) => rule.required()
                    })
                  ],
                  preview: {
                    select: { title: "label" }
                  }
                })
              ]
            })
          ],
          preview: {
            prepare: () => ({ title: "Related links block" })
          }
        }),
        defineArrayMember({
          name: "imageBlock",
          title: "Image block",
          type: "object",
          fields: [
            createImageField(),
            defineField({ name: "caption", title: "Caption", type: "string" })
          ],
          preview: {
            select: { media: "image", title: "caption" }
          }
        }),
        defineArrayMember({
          name: "quoteBlock",
          title: "Quote block",
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (rule) => rule.required() }),
            defineField({ name: "attribution", title: "Attribution", type: "string" })
          ],
          preview: {
            select: { title: "quote" }
          }
        }),
        defineArrayMember({
          name: "pullQuote",
          title: "Pull quote",
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (rule) => rule.required() }),
            defineField({ name: "attribution", title: "Attribution", type: "string" })
          ],
          preview: {
            select: { title: "quote", subtitle: "attribution" }
          }
        }),
        defineArrayMember({
          name: "checklistBlock",
          title: "Checklist block",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.min(1)
            })
          ],
          preview: {
            select: { title: "title" }
          }
        }),
        defineArrayMember({
          name: "comparisonBlock",
          title: "Comparison block",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "rows",
              title: "Rows",
              type: "array",
              of: [
                defineArrayMember({
                  name: "comparisonRow",
                  title: "Comparison row",
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() })
                  ],
                  preview: {
                    select: { title: "label", subtitle: "value" }
                  }
                })
              ],
              validation: (rule) => rule.min(1)
            })
          ],
          preview: {
            select: { title: "title" }
          }
        }),
        defineArrayMember({
          name: "highlightBlock",
          title: "Highlight block",
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "content", title: "Content", type: "text", rows: 3, validation: (rule) => rule.required() })
          ],
          preview: {
            select: { title: "title", subtitle: "content" }
          }
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "topic",
      media: "featuredImage"
    }
  }
});
