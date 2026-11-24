import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blogikirjoitus',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Otsikko', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug', title: 'Osoite', type: 'slug',
      description: 'Luo osoite otsikon perusteella Luo-painikkeella. Osoitteen muuttaminen rikkoo vanhat linkit.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt', title: 'Julkaisupäivä', type: 'date',
      description: 'Päivä näkyy kirjoituksen yhteydessä. Kirjoitus näkyy sivustolla vasta, kun julkaiset sen.',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'excerpt', title: 'Lyhyt esittely', type: 'text', rows: 3, description: 'Näkyy blogin etusivulla.', validation: (rule) => rule.required()}),
    defineField({
      name: 'cover', title: 'Kansikuva', type: 'image', options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Kuvan kuvaus', type: 'string', description: 'Kerro lyhyesti, mitä kuvassa näkyy.', validation: (rule) => rule.required()})],
    }),
    defineField({
      name: 'body', title: 'Kirjoituksen sisältö', type: 'array', validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Tavallinen', value: 'normal'}, {title: 'Väliotsikko', value: 'h2'}, {title: 'Pienempi väliotsikko', value: 'h3'}, {title: 'Lainaus', value: 'blockquote'}],
          lists: [{title: 'Luettelo', value: 'bullet'}, {title: 'Numeroitu luettelo', value: 'number'}],
          marks: {decorators: [{title: 'Lihavoitu', value: 'strong'}, {title: 'Kursivoitu', value: 'em'}], annotations: [{
            name: 'link', title: 'Linkki', type: 'object',
            fields: [defineField({name: 'href', title: 'Osoite', type: 'url', validation: (rule) => rule.required().uri({allowRelative: true, scheme: ['http', 'https', 'mailto']})})],
          }]},
        }),
        defineArrayMember({
          type: 'image', title: 'Kuva', options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Kuvan kuvaus', type: 'string', description: 'Kerro lyhyesti, mitä kuvassa näkyy.', validation: (rule) => rule.required()})],
        }),
      ],
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'publishedAt', media: 'cover'}},
  orderings: [{title: 'Uusimmat ensin', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]}],
})
