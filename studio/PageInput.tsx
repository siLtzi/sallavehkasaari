import {usePaneRouter} from 'sanity/structure'
import type {InputProps, ObjectInputProps, ObjectMember} from 'sanity'

const pages = {
  etusivu: {
    fields: ['texts', 'heroDesktop', 'heroMobile', 'signature'],
    texts: ['heroTitle', 'portfolioLink', 'experienceIntro'],
  },
  portfolio: {
    fields: ['texts', 'photos'],
    texts: ['experienceIntro'],
  },
  minusta: {
    fields: ['texts', 'portrait', 'signature'],
    texts: ['aboutEyebrow', 'aboutTitle', 'aboutFirst', 'aboutSecond'],
  },
  kuvaustiedot: {
    fields: ['texts'],
    texts: ['experienceEyebrow', 'experienceTitle', 'experienceIntro', 'experienceDetails', 'experienceFirst', 'experienceSecond'],
  },
  hinnasto: {
    fields: ['texts', 'portraitPackages', 'weddingPackages'],
    texts: ['pricingEyebrow', 'pricingIntro', 'portraitPackages', 'weddingPackages', 'portraitPackagesLabel', 'weddingPackagesLabel', 'packageDetails', 'packageContact', 'packageTypeLabel'],
  },
  yhteys: {
    fields: ['texts', 'contactTypes'],
    texts: ['contactEyebrow', 'contactIntro', 'nameLabel', 'emailLabel', 'typeLabel', 'typePlaceholder', 'messageLabel', 'messagePlaceholder', 'formNotice', 'formSubmit', 'formSuccess'],
  },
  blogi: {
    fields: ['texts'],
    texts: ['blog', 'blogIntro', 'blogEmpty', 'blogBack'],
  },
  asetukset: {
    fields: ['texts', 'logo', 'symbol', 'signature', 'instagramUrl', 'instagramFeed'],
    texts: ['siteName', 'occupation', 'location', 'portfolio', 'about', 'info', 'pricing', 'contact', 'footerContact', 'instagram', 'metadataTitle', 'metadataDescription', 'skip', 'navigationLabel', 'menuOpen', 'menuClose', 'backToTop', 'photoViewer', 'openPhoto', 'previousPhoto', 'nextPhoto'],
  },
} as const

function isPage(value: string): value is keyof typeof pages {
  return Object.prototype.hasOwnProperty.call(pages, value)
}

function selectMembers(members: ObjectMember[], names: readonly string[]): ObjectMember[] {
  return members.flatMap<ObjectMember>((member) => {
    if (member.kind === 'field') return names.includes(member.name) ? [member] : []
    if (member.kind !== 'fieldSet') return [member]
    const fields = member.fieldSet.members.filter((item) => item.kind !== 'field' || names.includes(item.name))
    if (!fields.some((item) => item.kind === 'field')) return []
    return [{...member, fieldSet: {...member.fieldSet, members: fields}}]
  })
}

function PageInput(props: ObjectInputProps) {
  const {routerPanesState, groupIndex, siblingIndex} = usePaneRouter()
  const page = routerPanesState[groupIndex]?.[siblingIndex]?.id
  if (!page || !isPage(page)) return props.renderDefault(props)

  const names = props.id === 'root' ? pages[page].fields : pages[page].texts
  const form = props.renderDefault({...props, members: selectMembers(props.members, names)})
  return props.id === 'root' ? <>
    <p style={{fontSize: 13, lineHeight: 1.5, margin: '0 0 24px'}}>
      Sivut käyttävät osittain samoja tekstejä ja kuvia. Julkaise-painike julkaisee kaikkien sivunäkymien odottavat muutokset.
    </p>
    {form}
  </> : form
}

export function pageFormInput(props: InputProps) {
  const isSiteRoot = props.id === 'root' && props.schemaType.name === 'homePage'
  const isSiteTexts = props.path.length === 1 && props.path[0] === 'texts'
  if ((isSiteRoot || isSiteTexts) && 'onFieldGroupSelect' in props) return <PageInput {...props} />
  return props.renderDefault(props)
}
