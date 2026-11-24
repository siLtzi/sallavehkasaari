import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {fiFILocale} from '@sanity/locale-fi-fi'
import {schemaTypes} from './schemaTypes'
import {pageFormInput} from './PageInput'

export default defineConfig({
  name: 'default',
  title: 'Kotisivut',

  projectId: 'tl8ba6bi',
  dataset: 'production',

  plugins: [fiFILocale(), structureTool({
    structure: (S) => S.list().title('Sisältö').items([
      ...[
        ['etusivu', 'Etusivu'],
        ['portfolio', 'Portfolio'],
        ['minusta', 'Minusta'],
        ['kuvaustiedot', 'Kuvaustiedot'],
        ['hinnasto', 'Hinnasto'],
        ['yhteys', 'Yhteydenotto (etusivu)'],
        ['blogi', 'Blogin asetukset'],
        ['asetukset', 'Yhteiset tiedot ja navigaatio'],
      ].map(([id, title]) => S.listItem().id(id).title(title).child(S.document().id(id).title(title).schemaType('homePage').documentId('homePage'))),
      S.listItem().id('info-sivu').title('Info-sivu').child(S.document().id('info-sivu').title('Info-sivu').schemaType('infoPage').documentId('infoPage')),
      S.divider(),
      S.listItem().title('Blogikirjoitukset').schemaType('blogPost').child(S.documentTypeList('blogPost').title('Blogikirjoitukset')),
    ]),
  })],

  form: {components: {input: pageFormInput}},
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => !['homePage', 'infoPage'].includes(template.schemaType)),
  },
  document: {
    actions: (actions, context) => ['homePage', 'infoPage'].includes(context.schemaType)
      ? actions.filter(({action}) => action !== 'duplicate' && action !== 'delete')
      : actions,
  },
})
