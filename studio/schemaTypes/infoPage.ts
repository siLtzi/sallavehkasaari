import {defineArrayMember, defineField, defineType} from 'sanity'

export const infoPage = defineType({
  name: 'infoPage',
  title: 'Info-sivu',
  type: 'document',
  groups: [
    {name: 'intro', title: 'Alku', default: true},
    {name: 'values', title: 'Ydinarvot'},
    {name: 'steps', title: 'Kuvauksen eteneminen'},
    {name: 'contract', title: 'Kuvaussopimus'},
  ],
  fields: [
    defineField({
      name: 'cover', title: 'Alun kuva', type: 'image', group: 'intro', options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Kuvan kuvaus', type: 'string', validation: (rule) => rule.required()})],
    }),
    defineField({name: 'valuesTitle', title: 'Ydinarvojen otsikko', type: 'string', group: 'values', validation: (rule) => rule.required()}),
    defineField({
      name: 'values', title: 'Ydinarvot', type: 'array', group: 'values', validation: (rule) => rule.required().min(1),
      of: [defineArrayMember({
        type: 'object', title: 'Ydinarvo',
        fields: [
          defineField({name: 'title', title: 'Otsikko', type: 'string', validation: (rule) => rule.required()}),
          defineField({name: 'text', title: 'Teksti', type: 'text', rows: 4, validation: (rule) => rule.required()}),
        ],
        preview: {select: {title: 'title', subtitle: 'text'}},
      })],
    }),
    defineField({name: 'stepsTitle', title: 'Kuvauksen etenemisen otsikko', type: 'string', group: 'steps', validation: (rule) => rule.required()}),
    defineField({
      name: 'steps', title: 'Kuvauksen vaiheet', type: 'array', group: 'steps', validation: (rule) => rule.required().min(1),
      of: [defineArrayMember({
        type: 'object', title: 'Vaihe',
        fields: [
          defineField({name: 'label', title: 'Vaiheen tunniste', type: 'string', description: 'Esimerkiksi STEP 01.', validation: (rule) => rule.required()}),
          defineField({name: 'title', title: 'Otsikko', type: 'string', validation: (rule) => rule.required()}),
          defineField({name: 'text', title: 'Teksti', type: 'text', rows: 4, validation: (rule) => rule.required()}),
        ],
        preview: {select: {title: 'title', subtitle: 'label'}},
      })],
    }),
    defineField({name: 'contractEyebrow', title: 'Sopimuksen yläteksti', type: 'string', group: 'contract', validation: (rule) => rule.required()}),
    defineField({name: 'contractTitle', title: 'Sopimuksen otsikko', type: 'string', group: 'contract', validation: (rule) => rule.required()}),
    defineField({
      name: 'contractSections', title: 'Sopimuksen kohdat', type: 'array', group: 'contract', validation: (rule) => rule.required().min(1),
      description: 'Jokainen kohta avautuu sivustolla omasta otsikostaan. Erottele tekstikappaleet tyhjällä rivillä.',
      of: [defineArrayMember({
        type: 'object', title: 'Sopimuksen kohta',
        fields: [
          defineField({name: 'title', title: 'Otsikko', type: 'string', validation: (rule) => rule.required()}),
          defineField({name: 'text', title: 'Sopimusteksti', type: 'text', rows: 12, validation: (rule) => rule.required()}),
        ],
        preview: {select: {title: 'title'}},
      })],
    }),
    defineField({name: 'lawText', title: 'Sovellettava laki ja erimielisyydet', type: 'text', rows: 3, group: 'contract', validation: (rule) => rule.required()}),
    defineField({name: 'acceptanceText', title: 'Sopimuksen hyväksyminen', type: 'text', rows: 4, group: 'contract', validation: (rule) => rule.required()}),
  ],
  preview: {prepare: () => ({title: 'Info-sivu'})},
})
