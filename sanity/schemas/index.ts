import { hero } from './hero'
import { homepage } from './homepage'
import { navigation } from './navigation'
import { committeeMember, committeePage } from './committee'
import { sponsorPage } from './sponsor'
import { contactPage } from './contact'
import { socialLinks } from './socialLinks'
import { oweekPage } from './oweek'
import { event } from './event'

export const schemaTypes = [
  // Pages
  hero,
  homepage,
  committeePage,
  sponsorPage,
  contactPage,
  oweekPage,
  navigation,
  socialLinks,
  // Individual items
  committeeMember,
  event,
]
