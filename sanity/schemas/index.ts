import { hero } from './hero'
import { homepage } from './homepage'
import { navigation } from './navigation'
import { teamMember, teamPage } from './team'
import { recruitmentPosition, recruitmentPage } from './recruitment'
import { sponsorPage } from './sponsor'
import { contactPage } from './contact'

export const schemaTypes = [
  // Pages
  hero,
  homepage,
  teamPage,
  recruitmentPage,
  sponsorPage,
  contactPage,
  navigation,
  // Individual items
  teamMember,
  recruitmentPosition,
]
